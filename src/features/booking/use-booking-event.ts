'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import { ApiEventsGetEventResponseSchema } from '../../io'
import type { MiddlewareEventsGetEventResponse } from '../../io/types'
import {
  BOOKING_ERRORS,
  BOOKING_QUERY_KEYS,
  DEFAULT_RETRY_CONFIG
} from './config'

export type UseBookingEventDetailOptions = {
  eventId: number
  enabled?: boolean
}

export const useBookingEvent = (
  options: UseBookingEventDetailOptions
): UseQueryResult<MiddlewareEventsGetEventResponse | null> => {
  const { eventId, enabled = true } = options

  return useQuery({
    queryKey: BOOKING_QUERY_KEYS.events.detail(eventId),
    queryFn: async (): Promise<MiddlewareEventsGetEventResponse | null> => {
      const url = `${ROUTES.API.BOOKING.EVENTS}/${eventId}`
      const res = await fetch(url)

      if (!res.ok) {
        throw new Error(BOOKING_ERRORS.FETCH_EVENT_DETAIL)
      }

      const json: unknown = await res.json()
      const schema = ApiEventsGetEventResponseSchema
      const parseResult = schema.safeParse(json)

      if (!parseResult.success) {
        throw new Error(BOOKING_ERRORS.INVALID_RESPONSE)
      }

      if (parseResult.data.status !== 'success') {
        throw new Error(
          parseResult.data.message ?? BOOKING_ERRORS.FETCH_EVENT_DETAIL
        )
      }

      return parseResult.data.data ?? null
    },
    enabled: enabled && eventId > 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    ...DEFAULT_RETRY_CONFIG
  })
}

export type UseBookingEventDetaiReturn = ReturnType<typeof useBookingEvent>
