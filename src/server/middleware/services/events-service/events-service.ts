import { AppError } from '../../../../core/errors/app-error'
import { initDatoSdk } from '../../../../core/dato/sdk'
import { logger } from '../../../../core/logger/logger'
import type {
  MiddlewareEventsGetEventRequest,
  MiddlewareEventsGetEventResponse,
  MiddlewareEventsListEventsResponse
} from '../../../../io'
import { RocketRezEventDataSchema } from '../../../../io/schemas'
import { getDatoEventDates } from '../../../../utils/get-dato-event-dates'
import { getUtcTodayString } from '../../../../utils/date-time'
import { getDb } from '../../../db/get-db'
import { RocketRezClient } from '../../../rocket-rez/client/index'
import {
  getCachedRocketRezEvent,
  listCachedRocketRezEvents
} from '../../../rocket-rez/services/events-cache/events-cache'

export class EventsService {
  private getUtcDatePlusDaysString(days: number): string {
    const date = new Date()
    date.setUTCDate(date.getUTCDate() + days)
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  private normalizeRocketRezBaseUrl(baseUrl: string): string {
    const trimmed = baseUrl.replace(/\/+$/, '')
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
  }

  private getRocketRezEnv(): {
    clientId: string | null
    clientSecret: string | null
    baseUrl: string
    scope: string
  } {
    const clientId =
      process.env.ROCKET_REZ_CLIENT_ID ||
      process.env.ROCKETREZ_HEADLESS_CLIENT_ID ||
      null
    const clientSecret =
      process.env.ROCKET_REZ_CLIENT_SECRET ||
      process.env.ROCKETREZ_HEADLESS_CLIENT_SECRET ||
      null
    const configuredBaseUrl =
      process.env.ROCKET_REZ_API_BASE_URL ||
      process.env.ROCKETREZ_HEADLESS_API_URL ||
      'https://secure.rocket-rez.com'
    const baseUrl = this.normalizeRocketRezBaseUrl(configuredBaseUrl)
    const configuredScope = process.env.ROCKET_REZ_API_SCOPES?.trim()
    const scope =
      configuredScope && configuredScope.toLowerCase() !== 'xxx'
        ? configuredScope
        : 'read_products'

    return { clientId, clientSecret, baseUrl, scope }
  }

  private async getLiveEventWithSchedules(
    eventId: number
  ): Promise<MiddlewareEventsGetEventResponse['event'] | null> {
    const env = this.getRocketRezEnv()

    if (!env.clientId || !env.clientSecret) {
      throw new AppError('RocketRez credentials not provided', {
        traceTag: 'events-service.getLiveEventWithSchedules',
        eventId
      })
    }

    try {
      const client = new RocketRezClient({
        baseUrl: env.baseUrl,
        clientId: env.clientId,
        clientSecret: env.clientSecret,
        scope: env.scope
      })

      const productsService = await client.getProductsService()
      const eventResponse = await productsService.getEvent(eventId)

      const parsedEvent = RocketRezEventDataSchema.safeParse(eventResponse.data)
      if (!parsedEvent.success) {
        logger.warn(
          { eventId, validationError: parsedEvent.error },
          'events-service.getLiveEventWithSchedules: invalid live event payload'
        )
        return null
      }

      const today = getUtcTodayString()
      const oneYearFromToday = this.getUtcDatePlusDaysString(365)
      const sdk = initDatoSdk()
      const datoDates = await getDatoEventDates(sdk, String(eventId))
      const scheduleStartDate = datoDates?.startDate ?? today
      const scheduleEndDate =
        datoDates?.endDate && datoDates.endDate >= scheduleStartDate
          ? datoDates.endDate
          : oneYearFromToday

      let futureSchedules: MiddlewareEventsGetEventResponse['event']['schedules'] =
        []

      try {
        const schedulesResponse = await productsService.getEventSchedules(eventId, {
          startDate: scheduleStartDate,
          endDate: scheduleEndDate
        })

        futureSchedules = (schedulesResponse.data ?? []).filter(
          (s: { date: string }) => s.date >= today
        )
      } catch (schedulesError) {
        logger.warn(
          {
            eventId,
            startDate: scheduleStartDate,
            endDate: scheduleEndDate,
            error: schedulesError
          },
          'events-service.getLiveEventWithSchedules: schedules lookup failed, returning event with empty schedules'
        )
      }

      return {
        ...parsedEvent.data,
        schedules: futureSchedules
      }
    } catch (error) {
      if (error instanceof AppError && error.details?.status === 404) {
        logger.info(
          { eventId },
          'events-service.getLiveEventWithSchedules: upstream event not found'
        )
        return null
      }

      logger.warn(
        { eventId, error },
        'events-service.getLiveEventWithSchedules: live fallback failed'
      )

      throw new AppError('Live event lookup failed', {
        traceTag: 'events-service.getLiveEventWithSchedules',
        eventId,
        originalError: error
      })
    }
  }

  async getEvents(): Promise<MiddlewareEventsListEventsResponse> {
    logger.info('events-service.getEvents')

    const db = getDb()
    const { items } = await listCachedRocketRezEvents(db, {
      pageSize: 250,
      pageIndex: 0
    })

    const data = {
      events: items.flatMap((e) =>
        e.event ? [{ ...e.event, schedules: e.schedules ?? [] }] : []
      )
    }

    logger.info({ data }, 'events-service.getEvents.data')

    return data
  }

  async getEvent(
    request: MiddlewareEventsGetEventRequest
  ): Promise<MiddlewareEventsGetEventResponse> {
    logger.info({ request }, 'events-service.getEvent')

    const db = getDb()
    const { id } = request
    const idAsInteger = Number(id)

    if (!Number.isFinite(idAsInteger) || idAsInteger <= 0) {
      throw new AppError('Invalid event id', {
        traceTag: 'events-service.getEvent',
        eventId: id
      })
    }

    const cached = await getCachedRocketRezEvent(db, idAsInteger)

    if (!cached?.event) {
      const liveEvent = await this.getLiveEventWithSchedules(idAsInteger)
      if (liveEvent) {
        const data = {
          event: liveEvent
        }

        logger.info(
          { eventId: idAsInteger },
          'events-service.getEvent: served event from live fallback'
        )

        return data
      }

      throw new AppError('Event not found', {
        traceTag: 'events-service.getEvent',
        eventId: id
      })
    }

    const parsed = RocketRezEventDataSchema.safeParse(cached.event)

    if (!parsed.success) {
      throw new AppError('Invalid event data in cache', {
        traceTag: 'events-service.getEvent',
        eventId: id,
        validationError: parsed.error
      })
    }

    // Filter out past schedule dates so the client only sees bookable (future) dates
    const today = getUtcTodayString()
    const futureSchedules = (cached.schedules ?? []).filter(
      (s) => s.date >= today
    )

    const data = {
      event: {
        ...parsed.data,
        schedules: futureSchedules
      }
    }

    logger.info({ data }, 'events-service.getEvent.data')

    return data
  }
}
