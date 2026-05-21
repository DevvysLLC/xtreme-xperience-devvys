#!/usr/bin/env bun

import { z } from 'zod'
import { AppError } from '../../../core/errors/app-error'
import { safeAwait } from '../../../core/errors/safe-await'
import { initLogger } from '../../../core/logger'
import type {
  RocketRezEventScheduleDate,
  RocketRezListEventSchedulesResponse
} from '../../../io/types'
import { getUtcTodayString, isValidDateFormat } from '../../../utils/date-time'
import { getDb } from '../../db/get-db'
import { RocketRezClient } from '../client/rocket-rez-client'
import {
  listCachedRocketRezEvents,
  updateRocketRezSchedulesPayload
} from '../services/events-cache/events-cache'
import {
  CONCURRENCY,
  DELAY_BETWEEN_REQUESTS_MS,
  RETRY_COUNT,
  RETRY_DELAY_BETWEEN_REQUESTS_MS
} from './config'

const logger = initLogger().child({ name: 'sync-rocket-rez-event-schedules' })

const Env = z.object({
  ROCKET_REZ_CLIENT_ID: z.string().min(1),
  ROCKET_REZ_CLIENT_SECRET: z.string().min(1),
  ROCKET_REZ_API_BASE_URL: z.string().min(1)
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

const fetchAllEventSchedules = async (
  productsService: Awaited<
    ReturnType<typeof RocketRezClient.prototype.getProductsService>
  >,
  eventId: number,
  request: { startDate: string; endDate: string }
): Promise<RocketRezListEventSchedulesResponse> => {
  const pageSize = 250
  let pageIndex = 0

  const allSchedules: RocketRezEventScheduleDate[] = []
  let lastResponse: RocketRezListEventSchedulesResponse | null = null

  while (true) {
    const response = await productsService.getEventSchedules(eventId, {
      startDate: request.startDate,
      endDate: request.endDate,
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

type EventDateRange = {
  eventId: number
  startDate: string
  endDate: string
}

const getFutureEventDateRangesFromDb = async (
  db: ReturnType<typeof import('../../db/get-db').getDb>,
  startDate: string
): Promise<EventDateRange[]> => {
  const pageSize = 250
  let pageIndex = 0
  const rangesByEventId = new Map<number, EventDateRange>()

  while (true) {
    const response = await listCachedRocketRezEvents(db, {
      pageSize,
      pageIndex,
      startDate
    })

    for (const item of response.items) {
      const firstDate = item.schedules?.[0]?.date
      const lastDate = item.schedules?.[item.schedules.length - 1]?.date

      if (
        !firstDate ||
        !lastDate ||
        !isValidDateFormat(firstDate) ||
        !isValidDateFormat(lastDate)
      ) {
        logger.info(
          {
            eventId: item.id,
            firstDate: firstDate ?? null,
            lastDate: lastDate ?? null
          },
          'Skipping event range - missing or invalid schedule boundary dates'
        )
        continue
      }

      if (lastDate < startDate) {
        logger.info(
          { eventId: item.id, lastDate, startDate },
          'Skipping event range - last schedule is in the past'
        )
        continue
      }

      const effectiveStartDate = firstDate < startDate ? startDate : firstDate

      rangesByEventId.set(item.id, {
        eventId: item.id,
        startDate: effectiveStartDate,
        endDate: lastDate
      })
    }

    if (response.items.length < pageSize) {
      break
    }
    pageIndex += 1
  }

  return Array.from(rangesByEventId.values())
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
  const startTime = Date.now()

  try {
    logger.info(
      { startTime: new Date(startTime).toISOString() },
      'Starting RocketRez event schedules sync'
    )

    logger.info('Initializing database connection')
    const db = getDb()
    logger.info('Database connection initialized')
    const todayUtc = getUtcTodayString()
    const now = new Date()

    logger.info('Creating RocketRez client')
    const rocketRezClient = new RocketRezClient({
      baseUrl: env.ROCKET_REZ_API_BASE_URL,
      clientId: env.ROCKET_REZ_CLIENT_ID,
      clientSecret: env.ROCKET_REZ_CLIENT_SECRET,
      scope: 'read_products'
    })

    logger.info('Authenticating with RocketRez API')
    await rocketRezClient.authenticate()
    logger.info('Successfully authenticated with RocketRez API')

    logger.info(
      { startDate: todayUtc },
      'Selecting future-scheduled events from DB'
    )
    const eventDateRanges = await getFutureEventDateRangesFromDb(db, todayUtc)

    logger.info(
      { eventsReturned: eventDateRanges.length, startDate: todayUtc },
      'Selected candidate events for schedules sync'
    )

    const productsService = await rocketRezClient.getProductsService()

    let syncedEventsCount = 0
    let skippedEventsCount = 0
    let syncedScheduleRowsCount = 0

    await withConcurrency(
      eventDateRanges,
      CONCURRENCY,
      async (eventDateRange: EventDateRange) => {
        const eventId = eventDateRange.eventId
        logger.info(
          { eventId, eventDateRange },
          'Processing event schedules sync'
        )

        const [schedulesError, schedulesResponse] = await safeAwait(
          withRetry(
            () =>
              fetchAllEventSchedules(productsService, eventId, {
                startDate: eventDateRange.startDate,
                endDate: eventDateRange.endDate
              }),
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
              { eventId, eventDateRange, error: schedulesError },
              'Failed to refresh schedules'
            )
          } else {
            logger.error(
              { eventId, eventDateRange, error: schedulesError },
              'Failed to refresh schedules after retries'
            )
          }
          logger.info(
            { eventId, eventDateRange },
            'Skipping schedules update - request failed'
          )
          return
        }

        if (
          schedulesResponse &&
          (schedulesResponse.statusCode === '200' ||
            schedulesResponse.statusCode === 'OK') &&
          schedulesResponse.data
        ) {
          const schedulesCountForEvent = schedulesResponse.data.length

          if (schedulesCountForEvent === 0) {
            skippedEventsCount++
            logger.info(
              { eventId, eventDateRange },
              'Skipping schedules update - empty schedules data'
            )
            return
          }

          await updateRocketRezSchedulesPayload(
            db,
            eventId,
            schedulesResponse,
            now
          )
          syncedEventsCount++
          syncedScheduleRowsCount += schedulesCountForEvent
          logger.info(
            { eventId, eventDateRange, schedulesCountForEvent },
            'Successfully updated schedules payload'
          )
        } else {
          skippedEventsCount++
          logger.warn(
            {
              eventId,
              eventDateRange,
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
        totals: {
          eventsReturned: eventDateRanges.length,
          eventsSkipped: skippedEventsCount,
          eventsSynced: syncedEventsCount
        }
      },
      'Event schedules sync totals (returned/skipped/synced)'
    )

    logger.info(
      {
        endTime: new Date(endTime).toISOString(),
        durationMs,
        durationSeconds: Math.round(durationMs / 1000),
        totalEvents: eventDateRanges.length,
        syncedEvents: syncedEventsCount,
        syncedSchedules: syncedEventsCount,
        startDate: todayUtc,
        syncedScheduleRows: syncedScheduleRowsCount
      },
      'Successfully completed RocketRez event schedules sync'
    )
    process.exit(0)
  } catch (error) {
    const endTime = Date.now()
    const durationMs = endTime - startTime
    logger.error(
      {
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        endTime: new Date(endTime).toISOString(),
        durationMs,
        durationSeconds: Math.round(durationMs / 1000)
      },
      'Failed to sync RocketRez event schedules'
    )
    process.exit(1)
  }
}

main()
