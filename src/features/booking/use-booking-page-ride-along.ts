'use client'

import { useCallback, useMemo } from 'react'
import { logger } from '../../core/logger/logger'
import type { BookingWizardPageRideAlongInput } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { useBooking } from './use-booking'
import { useBookingSetRideAlong } from './use-booking-set-ride-along'

/**
 * Ride-along selection page hook
 *
 * - Stores ride-along selections
 * - Validates cart matches stored data
 * - Requires coverage options page to be complete
 */
export const useBookingPageRideAlong = () => {
  const { data } = useBooking()
  const setRideAlong = useBookingSetRideAlong()

  const get = useCallback(() => {
    logger.info({ data }, `${LOG_NAMESPACE}: page.rideAlong.get`)
    return data?.ride_along ?? null
  }, [data])
  const persisted = data?.ride_along ?? null

  const save = useCallback(
    (input: BookingWizardPageRideAlongInput) => setRideAlong.mutateAsync(input),
    [setRideAlong]
  )

  const isValid = useCallback(() => {
    const valid = Boolean(data?.coverage_options)
    logger.info({ valid }, `${LOG_NAMESPACE}: page.rideAlong.isValid`)
    return valid
  }, [data?.coverage_options])

  const skipRideAlong = useCallback(async () => {
    logger.info(
      {},
      `${LOG_NAMESPACE}: page.rideAlong.skipRideAlong: Skipping ride-along page`
    )

    await save({
      value: {
        selected: true,
        isValid: true,
        isSubmitted: false
      },
      pageIsValid: true,
      userHasSubmitted: false
    })

    logger.info(
      {},
      `${LOG_NAMESPACE}: page.rideAlong.skipRideAlong: Page value set`
    )
  }, [save])

  return useMemo(
    () => ({
      persisted,
      get,
      save,
      set: save,
      isValid,
      skipRideAlong
    }),
    [persisted, get, save, isValid, skipRideAlong]
  )
}

export type UseBookingPageRideAlongReturn = ReturnType<
  typeof useBookingPageRideAlong
>
