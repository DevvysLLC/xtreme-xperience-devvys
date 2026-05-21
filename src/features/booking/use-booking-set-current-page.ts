'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import type { BookingState } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { BOOKING_QUERY_KEY } from './keys'
import { bookingRepository, initialBookingState } from './repository'

/**
 * Track current page in booking flow
 *
 * - Saves current page path to booking store
 * - Used for navigation and progress tracking
 */
export const useBookingSetCurrentPage = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (page: string | null) => {
      logger.info(
        { page },
        `${LOG_NAMESPACE}: mutation.setCurrentPage.onMutate`
      )
      const base =
        qc.getQueryData<BookingState>(BOOKING_QUERY_KEY) ?? initialBookingState
      const next: BookingState = { ...base, currentPage: page }

      qc.setQueryData(BOOKING_QUERY_KEY, next)
      await bookingRepository.write(next)

      logger.info(
        { page },
        `${LOG_NAMESPACE}: mutation.setCurrentPage.onSuccess`
      )
      return page
    },
    onSuccess: (page) => {
      logger.info(
        { page },
        `${LOG_NAMESPACE}: mutation.setCurrentPage.onSuccess`
      )
    },
    onError: (error, page) => {
      logger.error(
        { error, page },
        `${LOG_NAMESPACE}: mutation.setCurrentPage.onError`
      )
    }
  })
}

export type UseBookingSetCurrentPageReturn = ReturnType<
  typeof useBookingSetCurrentPage
>
