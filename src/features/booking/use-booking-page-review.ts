'use client'

import { useCallback, useMemo } from 'react'
import { logger } from '../../core/logger/logger'
import type { BookingWizardPageReviewInput } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { useBooking } from './use-booking'
import { useBookingSetReview } from './use-booking-set-review'

/**
 * Review page hook
 *
 * - Final review before checkout
 * - Validates all previous pages complete
 * - Requires media packages page to be complete
 */
export const useBookingPageReview = () => {
  const { data } = useBooking()
  const setReview = useBookingSetReview()
  const persisted = data?.review ?? null

  const save = useCallback(
    (input: BookingWizardPageReviewInput) => setReview.mutateAsync(input),
    [setReview]
  )

  const isValid = useCallback(() => {
    const valid = Boolean(data?.media_packages)
    logger.info({ valid }, `${LOG_NAMESPACE}: page.review.isValid`)

    return valid
  }, [data?.media_packages])

  return useMemo(
    () => ({
      persisted,
      get: () => persisted,
      save,
      set: save,
      isValid
    }),
    [persisted, save, isValid]
  )
}

export type UseBookingPageReviewReturn = ReturnType<typeof useBookingPageReview>
