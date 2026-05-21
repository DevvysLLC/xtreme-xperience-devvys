'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import type { BookingConfigFragment } from '../../core/dato/fragments/booking-config.typegen'
import { ApiBookingConfigGetBookingConfigResponseSchema } from '../../io'
import {
  BOOKING_ERRORS,
  BOOKING_QUERY_KEYS,
  DEFAULT_RETRY_CONFIG,
  hasBookingConfig
} from './config'

export type UseBookingConfigOptions = {
  enabled?: boolean
}

export const useBookingConfig = (
  options: UseBookingConfigOptions = {}
): UseQueryResult<BookingConfigFragment | null> => {
  const { enabled = true } = options

  return useQuery({
    queryKey: BOOKING_QUERY_KEYS.config.all,
    queryFn: async (): Promise<BookingConfigFragment | null> => {
      const res = await fetch(ROUTES.API.BOOKING.CONFIG)

      if (!res.ok) {
        throw new Error(BOOKING_ERRORS.FETCH_CONFIG)
      }

      const json: unknown = await res.json()
      const schema = ApiBookingConfigGetBookingConfigResponseSchema
      const parseResult = schema.safeParse(json)

      if (!parseResult.success) {
        throw new Error(BOOKING_ERRORS.INVALID_RESPONSE)
      }

      if (parseResult.data.status !== 'success') {
        throw new Error(parseResult.data.message ?? BOOKING_ERRORS.FETCH_CONFIG)
      }

      const data = parseResult.data.data

      if (!hasBookingConfig(data)) {
        return null
      }

      const configData = 'config' in data && data.config ? data.config : data

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return configData as BookingConfigFragment | null
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    ...DEFAULT_RETRY_CONFIG
  })
}

export type UseBookingConfigReturn = ReturnType<typeof useBookingConfig>
