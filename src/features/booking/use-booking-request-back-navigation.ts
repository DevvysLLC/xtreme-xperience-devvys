'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import type { BookingState } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { BOOKING_QUERY_KEY } from './keys'
import { bookingRepository, initialBookingState } from './repository'

type RequestBackNavigationInput = {
  fromPath: string
}

/**
 * Request guard-managed back navigation for current booking page.
 *
 * - Stores an ephemeral back-navigation intent in booking query state
 * - Persists via booking repository write pattern used by other booking mutations
 */
export const useBookingRequestBackNavigation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: RequestBackNavigationInput | null) => {
      const base =
        qc.getQueryData<BookingState>(BOOKING_QUERY_KEY) ?? initialBookingState

      const next: BookingState = {
        ...base,
        backNavigationFromPath: input?.fromPath ?? null,
        backNavigationRequestedAt: input ? new Date().toISOString() : null
      }

      logger.info(
        {
          fromPath: next.backNavigationFromPath,
          requestedAt: next.backNavigationRequestedAt
        },
        `${LOG_NAMESPACE}: mutation.requestBackNavigation.onMutate`
      )

      qc.setQueryData(BOOKING_QUERY_KEY, next)
      await bookingRepository.write(next)

      logger.info(
        {
          fromPath: next.backNavigationFromPath,
          requestedAt: next.backNavigationRequestedAt
        },
        `${LOG_NAMESPACE}: mutation.requestBackNavigation.onSuccess`
      )

      return next.backNavigationRequestedAt
    },
    onError: (error, input) => {
      logger.error(
        { error, fromPath: input?.fromPath ?? null },
        `${LOG_NAMESPACE}: mutation.requestBackNavigation.onError`
      )
    }
  })
}

export type UseBookingRequestBackNavigationReturn = ReturnType<
  typeof useBookingRequestBackNavigation
>
