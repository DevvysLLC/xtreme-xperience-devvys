'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import { BookingMediaPackagesSchema } from '../../io/schemas'
import type {
  BookingState,
  BookingWizardPageMediaPackagesInput
} from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { BOOKING_QUERY_KEY } from './keys'
import { bookingRepository, initialBookingState } from './repository'

export const useBookingSetMediaPackages = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: BookingWizardPageMediaPackagesInput) => {
      logger.info(
        { input },
        `${LOG_NAMESPACE}: mutation.setMediaPackages.onMutate`
      )
      const base =
        qc.getQueryData<BookingState>(BOOKING_QUERY_KEY) ?? initialBookingState

      const result = BookingMediaPackagesSchema.safeParse({
        value: input.value ?? null,
        pageIsValid: input.pageIsValid,
        userHasSubmitted: input.userHasSubmitted,
        lastSubmittedAt: new Date().toISOString()
      })

      if (!result.success) {
        const errorMsg = `Invalid media packages: ${result.error.issues.map((i) => i.message).join(', ')}`
        const next: BookingState = { ...base, error: errorMsg }
        qc.setQueryData(BOOKING_QUERY_KEY, next)
        await bookingRepository.write(next)
        throw new Error(errorMsg)
      }

      const next: BookingState = {
        ...base,
        media_packages: result.data,
        error: null
      }
      qc.setQueryData(BOOKING_QUERY_KEY, next)
      await bookingRepository.write(next)

      logger.info({}, `${LOG_NAMESPACE}: mutation.setMediaPackages.onSuccess`)
      return result.data
    },
    onSuccess: () => {
      logger.info({}, `${LOG_NAMESPACE}: mutation.setMediaPackages.onSuccess`)
    },
    onError: (error) => {
      logger.error(
        { error },
        `${LOG_NAMESPACE}: mutation.setMediaPackages.onError`
      )
    }
  })
}
