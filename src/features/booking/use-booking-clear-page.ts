'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import type { BookingState } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { BOOKING_QUERY_KEY } from './keys'
import { bookingRepository, initialBookingState } from './repository'

const PAGE_KEYS: Record<string, keyof BookingState> = {
  date_and_car: 'date_and_car',
  coverage_options: 'coverage_options',
  ride_along: 'ride_along',
  media_packages: 'media_packages',
  review: 'review',
  event: 'event',
  track: 'track'
}

/**
 * Clear single page data in booking
 *
 * - Resets specific page to null
 * - Used when user goes back in flow
 */
export const useBookingClearPage = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (pageId: string) => {
      logger.info({ pageId }, `${LOG_NAMESPACE}: mutation.clearPage.onMutate`)
      const base =
        qc.getQueryData<BookingState>(BOOKING_QUERY_KEY) ?? initialBookingState

      const key = PAGE_KEYS[pageId]
      if (!key) {
        logger.warn(
          { pageId },
          `${LOG_NAMESPACE}: mutation.clearPage — unknown page`
        )
        return base
      }

      const next: BookingState = {
        ...base,
        error: null,
        ...(key in base ? { [key]: null } : {})
      }

      qc.setQueryData(BOOKING_QUERY_KEY, next)
      await bookingRepository.write(next)

      logger.info({ pageId }, `${LOG_NAMESPACE}: mutation.clearPage.onSuccess`)
      return next
    },
    onSuccess: (_, pageId) => {
      logger.info({ pageId }, `${LOG_NAMESPACE}: mutation.clearPage.onSuccess`)
    },
    onError: (error, pageId) => {
      logger.error(
        { error, pageId },
        `${LOG_NAMESPACE}: mutation.clearPage.onError`
      )
    }
  })
}

export type UseBookingClearPageReturn = ReturnType<typeof useBookingClearPage>
