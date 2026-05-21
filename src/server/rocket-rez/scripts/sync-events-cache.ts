#!/usr/bin/env bun

import { z } from 'zod'
import { initDatoSdk } from '../../../core/dato/sdk'
import { AppError } from '../../../core/errors/app-error'
import { safeAwait } from '../../../core/errors/safe-await'
import { initLogger } from '../../../core/logger'
import {
  RocketRezGetEventProductResponseSchema as GetEventProductResponseSchema,
  RocketRezProductType
} from '../../../io/schemas'
import type {
  RocketRezEventScheduleDate,
  RocketRezListEventSchedulesResponse,
  RocketRezProduct
} from '../../../io/types'
import { getDatoEventDates } from '../../../utils/get-dato-event-dates'
import { getDb } from '../../db/get-db'
import { RocketRezClient } from '../client/rocket-rez-client'
import {
  deleteMissingEvents,
  updateRocketRezEventPayload,
  updateRocketRezSchedulesPayload,
  upsertRocketRezEventList
} from '../services/events-cache/events-cache'
import {
  CONCURRENCY,
  DELAY_BETWEEN_REQUESTS_MS,
  RETRY_COUNT,
  RETRY_DELAY_BETWEEN_REQUESTS_MS
} from './config'

const logger = initLogger().child({ name: 'sync-rocket-rez-events-cache' })

const Env = z.object({
  ROCKET_REZ_CLIENT_ID: z.string().min(1),
  ROCKET_REZ_CLIENT_SECRET: z.string().min(1),
  ROCKET_REZ_API_BASE_URL: z.string().min(1),
  NEXT_PUBLIC_DATOCMS_READONLY_TOKEN: z.string().min(1)
})

const isRateLimitError = (error: unknown): boolean => {
  if (error instanceof AppError) {
    return error.details?.status === 429
  }
  return false
}

const withRetry = async <T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelayMs?: number
    maxDelayMs?: number
    backoffMultiplier?: number
    context?: string
  } = {}
): Promise<T> => {
  const {
    maxRetries = 5,
    initialDelayMs = 1000,
    maxDelayMs = 30000,
    backoffMultiplier = 2,
    context = 'operation'
  } = options

  let lastError: unknown
  let delay = initialDelayMs

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (!isRateLimitError(error)) {
        throw error
      }

      if (attempt === maxRetries) {
        logger.warn(
          { context, attempt: attempt + 1, maxRetries: maxRetries + 1 },
          'Max retries reached for rate limit error'
        )
        throw error
      }

      let retryDelay = delay
      if (
        error instanceof AppError &&
        error.details?.retryAfter &&
        typeof error.details.retryAfter === 'number'
      ) {
        const retryAfterSeconds = error.details.retryAfter
        retryDelay = Math.min(retryAfterSeconds * 1000, maxDelayMs)
        logger.info(
          {
            context,
            attempt: attempt + 1,
            maxRetries: maxRetries + 1,
            retryAfterSeconds,
            delayMs: retryDelay
          },
          'Rate limit hit, using Retry-After header'
        )
      } else {
        logger.info(
          {
            context,
            attempt: attempt + 1,
            maxRetries: maxRetries + 1,
            delayMs: delay
          },
          'Rate limit hit, retrying after delay'
        )
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay))

      if (!(error instanceof AppError && error.details?.retryAfter)) {
        delay = Math.min(delay * backoffMultiplier, maxDelayMs)
      } else {
        delay = retryDelay
      }
    }
  }

  throw lastError
}

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const fetchAllEvents = async (
  client: RocketRezClient
): Promise<RocketRezProduct[]> => {
  const productsService = await client.getProductsService()

  const pageSize = 250
  let pageIndex = 0

  const all: RocketRezProduct[] = []

  while (true) {
    const response = await productsService.getProducts({
      pageSize,
      pageIndex,
      type: [RocketRezProductType.EVENT]
    })

    all.push(...response.data)

    if (response.data.length < pageSize) {
      break
    }

    pageIndex += 1
  }

  return all
}

const fetchAllEventSchedules = async (
  productsService: Awaited<
    ReturnType<typeof RocketRezClient.prototype.getProductsService>
  >,
  eventId: number,
  request: { startDate?: string; endDate?: string } = {}
): Promise<RocketRezListEventSchedulesResponse> => {
  const pageSize = 250
  let pageIndex = 0

  const allSchedules: RocketRezEventScheduleDate[] = []
  let lastResponse: RocketRezListEventSchedulesResponse | null = null

  while (true) {
    const response = await productsService.getEventSchedules(eventId, {
      ...request,
      pageSize,
      pageIndex
    })

    if (!response.data || response.data.length === 0) {
      break
    }

    allSchedules.push(...response.data)
    lastResponse = response

    if (response.pagination) {
      const totalCount = response.pagination.count
      const fetchedCount = allSchedules.length
      if (fetchedCount >= totalCount) {
        break
      }
    } else if (response.data.length < pageSize) {
      break
    }

    pageIndex += 1
  }

  if (lastResponse) {
    return {
      ...lastResponse,
      data: allSchedules,
      pagination: lastResponse.pagination
        ? {
            ...lastResponse.pagination,
            count: allSchedules.length,
            pageIndex: 0,
            pageSize: allSchedules.length
          }
        : undefined
    }
  }

  return {
    data: [],
    statusCode: '200',
    rawContent: null,
    errorMessage: null,
    pagination: undefined
  }
}

const withConcurrency = async <T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
  delayBetweenRequestsMs: number = 0
): Promise<void> => {
  if (items.length === 0) {
    return
  }

  const queue = items.slice()

  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (true) {
      const item = queue.shift()
      if (!item) {
        return
      }
      await fn(item)
      if (delayBetweenRequestsMs > 0) {
        await sleep(delayBetweenRequestsMs)
      }
    }
  })

  await Promise.all(workers)
}

const main = async () => {
  const envResult = Env.safeParse(process.env)
  if (!envResult.success) {
    logger.error(
      { issues: envResult.error.issues },
      'Invalid environment variable configuration'
    )
    process.exit(1)
  }

  const env = envResult.data

  // Parse command line arguments for specific event ID
  const args = process.argv.slice(2)
  const idArg = args.find((arg) => arg.startsWith('--id='))
  const idValue = idArg?.split('=')[1]
  const specificEventId = idValue ? Number.parseInt(idValue, 10) : null

  if (specificEventId && Number.isNaN(specificEventId)) {
    logger.error({ idArg }, 'Invalid --id argument: must be a valid number')
    process.exit(1)
  }

  const startTime = Date.now()
  try {
    logger.info(
      {
        startTime: new Date(startTime).toISOString(),
        specificEventId: specificEventId ?? 'all events'
      },
      'Starting RocketRez events cache sync'
    )

    logger.info('Initializing database connection')
    const db = getDb()

    logger.info('Initializing DatoCMS SDK')
    const datoEnvironment = process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT || ''
    const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || 'not-set'
    const mode: 'production' | 'development' =
      vercelEnv === 'production' ? 'production' : 'development'
    const effectiveDatoEnvironment = datoEnvironment || 'main/production'

    logger.info(
      {
        datoEnvironment: effectiveDatoEnvironment,
        datoEnvironmentRaw: datoEnvironment || '(not set, using default)',
        vercelEnv,
        mode,
        includeDrafts: mode !== 'production',
        usingEnvironmentHeader: datoEnvironment && mode !== 'production'
      },
      'DatoCMS environment configuration'
    )

    const datoSdk = initDatoSdk()
    logger.info('DatoCMS SDK initialized')

    logger.info('Initializing RocketRez client')
    const rocketRezClient = new RocketRezClient({
      baseUrl: env.ROCKET_REZ_API_BASE_URL,
      clientId: env.ROCKET_REZ_CLIENT_ID,
      clientSecret: env.ROCKET_REZ_CLIENT_SECRET,
      scope: 'read_products'
    })

    logger.info('Authenticating with RocketRez API')
    await rocketRezClient.authenticate()
    logger.info('Successfully authenticated with RocketRez API')

    const now = new Date()
    let eventsToProcess: number[]

    if (specificEventId) {
      logger.info(
        { eventId: specificEventId },
        'Syncing specific event ID only (skipping full event list sync)'
      )
      eventsToProcess = [specificEventId]
    } else {
      logger.info('Fetching all events from RocketRez API')
      const events = await fetchAllEvents(rocketRezClient)

      logger.info(
        { count: events.length },
        'Fetched events list from RocketRez'
      )

      logger.info(
        { count: events.length },
        'Upserting events list into database'
      )
      await upsertRocketRezEventList(
        db,
        events.map((e: RocketRezProduct) => ({
          id: e.id,
          name: e.name,
          type: e.type,
          category: e.category
        })),
        now
      )

      logger.info('Successfully upserted events list into cache')

      logger.info('Checking for events to delete')
      const activeEventIds = events.map((e: RocketRezProduct) => e.id)
      if (activeEventIds.length === 0) {
        logger.warn(
          'Skipping deletion of missing events - fetched events list is empty. This may indicate an API error.'
        )
      } else {
        const deletedCount = await deleteMissingEvents(db, activeEventIds)
        if (deletedCount > 0) {
          logger.info({ deletedCount }, 'Deleted events no longer in API')
          logger.info({ totalDeleted: deletedCount }, 'Total events deleted')
        } else {
          logger.info('No events need deleting')
        }
      }

      eventsToProcess = events.map((e: RocketRezProduct) => e.id)
    }

    logger.info('Getting products service for detail/schedule sync')
    const productsService = await rocketRezClient.getProductsService()

    logger.info(
      { total: eventsToProcess.length },
      'Processing all events for detail/schedule sync'
    )

    let syncedEventsCount = 0
    let syncedSchedulesCount = 0

    await withConcurrency(
      eventsToProcess,
      CONCURRENCY,
      async (eventId: number) => {
        const [eventError, eventResponse] = await safeAwait(
          withRetry(() => productsService.getEvent(eventId), {
            maxRetries: RETRY_COUNT,
            initialDelayMs: RETRY_DELAY_BETWEEN_REQUESTS_MS,
            maxDelayMs: 30000,
            context: `getEvent(${eventId})`
          })
        )

        if (eventError) {
          if (!isRateLimitError(eventError)) {
            logger.warn(
              { eventId, error: eventError },
              'Failed to refresh event'
            )
          } else {
            logger.error(
              { eventId, error: eventError },
              'Failed to refresh event after retries'
            )
          }
          return
        }

        if (
          eventResponse &&
          (eventResponse.statusCode === '200' ||
            eventResponse.statusCode === 'OK') &&
          eventResponse.data
        ) {
          const validatedResponse =
            GetEventProductResponseSchema.parse(eventResponse)
          await updateRocketRezEventPayload(db, eventId, validatedResponse, now)
          syncedEventsCount++
          logger.info({ eventId }, 'Successfully updated event payload')
        } else {
          logger.warn(
            {
              eventId,
              statusCode: eventResponse?.statusCode,
              hasData: !!eventResponse?.data
            },
            'Skipping event update - non-200 response or missing data'
          )
          return
        }

        const datoEventDates = await getDatoEventDates(datoSdk, String(eventId))
        const schedulesRequest = datoEventDates
          ? {
              startDate: datoEventDates.startDate ?? undefined,
              endDate: datoEventDates.endDate ?? undefined
            }
          : {}

        const [schedulesError, schedulesResponse] = await safeAwait(
          withRetry(
            () =>
              fetchAllEventSchedules(
                productsService,
                eventId,
                schedulesRequest
              ),
            {
              maxRetries: RETRY_COUNT,
              initialDelayMs: RETRY_DELAY_BETWEEN_REQUESTS_MS,
              maxDelayMs: 30000,
              context: `fetchAllEventSchedules(${eventId})`
            }
          )
        )

        if (schedulesError) {
          if (!isRateLimitError(schedulesError)) {
            logger.warn(
              { eventId, error: schedulesError },
              'Failed to refresh schedules'
            )
          } else {
            logger.error(
              { eventId, error: schedulesError },
              'Failed to refresh schedules after retries'
            )
          }
          return
        }

        if (
          schedulesResponse &&
          (schedulesResponse.statusCode === '200' ||
            schedulesResponse.statusCode === 'OK') &&
          schedulesResponse.data
        ) {
          await updateRocketRezSchedulesPayload(
            db,
            eventId,
            schedulesResponse,
            now
          )
          syncedSchedulesCount++
          logger.info({ eventId }, 'Successfully updated schedules payload')
        } else {
          logger.warn(
            {
              eventId,
              statusCode: schedulesResponse?.statusCode,
              hasData: !!schedulesResponse?.data
            },
            'Skipping schedules update - non-200 response or missing data'
          )
        }
      },
      DELAY_BETWEEN_REQUESTS_MS
    )

    const endTime = Date.now()
    const durationMs = endTime - startTime
    logger.info(
      {
        endTime: new Date(endTime).toISOString(),
        durationMs,
        durationSeconds: Math.round(durationMs / 1000),
        totalEvents: eventsToProcess.length,
        syncedEvents: syncedEventsCount,
        syncedSchedules: syncedSchedulesCount
      },
      'Successfully completed RocketRez events cache sync'
    )
    process.exit(0)
  } catch (error) {
    const endTime = Date.now()
    const durationMs = endTime - startTime

    // Log the error with proper serialization
    if (error instanceof Error) {
      logger.error(
        {
          error, // This will be serialized by Pino's error serializer
          errorMessage: error.message,
          errorStack: error.stack,
          errorName: error.name,
          endTime: new Date(endTime).toISOString(),
          durationMs,
          durationSeconds: Math.round(durationMs / 1000)
        },
        'Failed to sync RocketRez events cache'
      )
    } else {
      logger.error(
        {
          error: String(error),
          errorType: typeof error,
          endTime: new Date(endTime).toISOString(),
          durationMs,
          durationSeconds: Math.round(durationMs / 1000)
        },
        'Failed to sync RocketRez events cache with non-Error type'
      )
    }
    process.exit(1)
  }
}

main()
