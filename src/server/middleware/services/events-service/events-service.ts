import { AppError } from '../../../../core/errors/app-error'
import { logger } from '../../../../core/logger/logger'
import type {
  MiddlewareEventsGetEventRequest,
  MiddlewareEventsGetEventResponse,
  MiddlewareEventsListEventsResponse
} from '../../../../io'
import { RocketRezEventDataSchema } from '../../../../io/schemas'
import { getUtcTodayString } from '../../../../utils/date-time'
import { getDb } from '../../../db/get-db'
import {
  getCachedRocketRezEvent,
  listCachedRocketRezEvents
} from '../../../rocket-rez/services/events-cache/events-cache'

export class EventsService {
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
