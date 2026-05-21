'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import type { BookingState } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { BOOKING_QUERY_KEY } from './keys'
import { bookingRepository, initialBookingState } from './repository'

/**
 * Persist the user's intended wizard page in booking state.
 *
 * Written by: guard (canonicalize, back, submit, hard redirect),
 *             progress bar (click), initializer (setup complete).
 * Read by:    guard (enforce intended page).
 */
export const useBookingSetIntendedPage = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (pageId: string | null) => {
      logger.info(
        { pageId },
        `${LOG_NAMESPACE}: mutation.setIntendedPage.onMutate`
      )
      const base =
        qc.getQueryData<BookingState>(BOOKING_QUERY_KEY) ?? initialBookingState
      const next: BookingState = { ...base, intendedPageId: pageId }

      qc.setQueryData(BOOKING_QUERY_KEY, next)
      await bookingRepository.write(next)

      logger.info(
        { pageId },
        `${LOG_NAMESPACE}: mutation.setIntendedPage.onSuccess`
      )
      return pageId
    },
    onError: (error, pageId) => {
      logger.error(
        { error, pageId },
        `${LOG_NAMESPACE}: mutation.setIntendedPage.onError`
      )
    }
  })
}

export type UseBookingSetIntendedPageReturn = ReturnType<
  typeof useBookingSetIntendedPage
>
