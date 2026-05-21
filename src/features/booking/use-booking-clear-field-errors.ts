'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { logger } from '../../core/logger/logger'
import type { BookingState } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { BOOKING_QUERY_KEY } from './keys'
import { bookingRepository, initialBookingState } from './repository'

/**
 * Clear validation errors in booking
 *
 * - Clears fieldErrors and error state
 * - Used after fixing validation issues
 */
export const useBookingClearFieldErrors = () => {
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      logger.info({}, `${LOG_NAMESPACE}: mutation.clearFieldErrors.onMutate`)
      const base =
        qc.getQueryData<BookingState>(BOOKING_QUERY_KEY) ?? initialBookingState
      const next: BookingState = {
        ...base,
        fieldErrors: null,
        error: null
      }

      qc.setQueryData(BOOKING_QUERY_KEY, next)
      await bookingRepository.write(next)

      logger.info({}, `${LOG_NAMESPACE}: mutation.clearFieldErrors.onSuccess`)
      return next
    },
    onSuccess: () => {
      logger.info({}, `${LOG_NAMESPACE}: mutation.clearFieldErrors.onSuccess`)
    },
    onError: (error) => {
      logger.error(
        { error },
        `${LOG_NAMESPACE}: mutation.clearFieldErrors.onError`
      )
    }
  })

  return useCallback(() => {
    logger.info({}, `${LOG_NAMESPACE}: clearFieldErrors`)
    mutation.mutate()
  }, [mutation])
}

export type UseBookingClearFieldErrorsReturn = ReturnType<
  typeof useBookingClearFieldErrors
>
