'use client'

import { useMutation } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { logger } from '../../core/logger/logger'
import type { BookingWizardPageLocationInput } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { useBooking } from './use-booking'

/**
 * Location page hook
 *
 * - First step in booking wizard
 * - Validates event and track are selected
 * - No form data stored (event/track stored directly)
 */
export const useBookingPageLocation = () => {
  const { data } = useBooking()

  const get = useCallback(() => {
    return null
  }, [])

  const mutation = useMutation({
    mutationFn: async (input: BookingWizardPageLocationInput) => {
      void input // Location page doesn't store form data; event/track set via other hooks
      logger.info({}, `${LOG_NAMESPACE}: page.location.mutation.set`)
      return null
    },
    onSuccess: (result, variables) => {
      logger.info(
        { data: result, variables },
        `${LOG_NAMESPACE}: page.location.mutation.onSuccess`
      )
    },
    onError: (error, variables) => {
      logger.error(
        { error, variables },
        `${LOG_NAMESPACE}: page.location.mutation.onError`
      )
    }
  })

  const set = mutation.mutateAsync

  const isValid = useCallback(() => {
    const valid = Boolean(data?.event && data?.track)
    logger.info({ valid }, `${LOG_NAMESPACE}: page.location.isValid`)
    return valid
  }, [data?.event, data?.track])

  return useMemo(
    () => ({
      get,
      set,
      isValid
    }),
    [get, set, isValid]
  )
}

export type UseBookingPageLocationReturn = ReturnType<
  typeof useBookingPageLocation
>
