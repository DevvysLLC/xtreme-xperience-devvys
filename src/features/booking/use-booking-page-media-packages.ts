'use client'

import { useCallback, useMemo } from 'react'
import { logger } from '../../core/logger/logger'
import type { BookingWizardPageMediaPackagesInput } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { useBooking } from './use-booking'
import { useBookingSetMediaPackages } from './use-booking-set-media-packages'

/**
 * Media packages selection page hook
 *
 * - Stores media package selections
 * - Validates cart matches stored data
 * - Requires ride-along page to be complete
 */
export const useBookingPageMediaPackages = () => {
  const { data } = useBooking()
  const setMediaPackages = useBookingSetMediaPackages()
  const persisted = data?.media_packages ?? null

  const get = useCallback(() => {
    return data?.media_packages ?? null
  }, [data?.media_packages])

  const save = useCallback(
    (input: BookingWizardPageMediaPackagesInput) =>
      setMediaPackages.mutateAsync(input),
    [setMediaPackages]
  )

  const isValid = useCallback(() => {
    const valid = Boolean(data?.ride_along)
    logger.info({ valid }, `${LOG_NAMESPACE}: page.mediaPackages.isValid`)

    return valid
  }, [data?.ride_along])

  return useMemo(
    () => ({
      persisted,
      get,
      save,
      set: save,
      isValid
    }),
    [persisted, get, save, isValid]
  )
}

export type UseBookingPageMediaPackagesReturn = ReturnType<
  typeof useBookingPageMediaPackages
>
