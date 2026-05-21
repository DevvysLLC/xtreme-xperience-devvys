'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import { LOG_NAMESPACE } from './config'
import { BOOKING_CLEAR_MUTATION_KEY, BOOKING_QUERY_KEY } from './keys'
import { bookingRepository, initialBookingState } from './repository'

/**
 * Clear all booking state
 *
 * - Resets entire booking store to initial state
 * - Persists to localStorage
 */
export const useBookingClear = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: BOOKING_CLEAR_MUTATION_KEY,
    mutationFn: async () => {
      logger.info({}, `${LOG_NAMESPACE}: mutation.clear.onMutate`)
      qc.setQueryData(BOOKING_QUERY_KEY, initialBookingState)
      await bookingRepository.clear()
      logger.info({}, `${LOG_NAMESPACE}: mutation.clear.onSuccess`)
      return initialBookingState
    },
    onSuccess: () => {
      logger.info({}, `${LOG_NAMESPACE}: mutation.clear.onSuccess`)
    },
    onError: (error) => {
      logger.error({ error }, `${LOG_NAMESPACE}: mutation.onError`)
    }
  })
}

export type UseBookingClearReturn = ReturnType<typeof useBookingClear>
