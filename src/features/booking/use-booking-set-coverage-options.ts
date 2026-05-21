'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import { BookingCoverageOptionsSchema } from '../../io/schemas'
import type {
  BookingState,
  BookingWizardPageCoverageOptionsInput
} from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { BOOKING_QUERY_KEY } from './keys'
import { bookingRepository, initialBookingState } from './repository'

export const useBookingSetCoverageOptions = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: BookingWizardPageCoverageOptionsInput) => {
      logger.info(
        { input },
        `${LOG_NAMESPACE}: mutation.setCoverageOptions.onMutate`
      )
      const base =
        qc.getQueryData<BookingState>(BOOKING_QUERY_KEY) ?? initialBookingState

      const result = BookingCoverageOptionsSchema.safeParse({
        value: input.value ?? null,
        pageIsValid: input.pageIsValid,
        userHasSubmitted: input.userHasSubmitted,
        lastSubmittedAt: new Date().toISOString(),
        chooseOnDriveDay: input.chooseOnDriveDay ?? false
      })

      if (!result.success) {
        const errorMsg = `Invalid coverage options: ${result.error.issues.map((i) => i.message).join(', ')}`
        const next: BookingState = { ...base, error: errorMsg }
        qc.setQueryData(BOOKING_QUERY_KEY, next)
        await bookingRepository.write(next)
        throw new Error(errorMsg)
      }

      const next: BookingState = {
        ...base,
        coverage_options: result.data,
        error: null
      }
      qc.setQueryData(BOOKING_QUERY_KEY, next)
      await bookingRepository.write(next)

      logger.info({}, `${LOG_NAMESPACE}: mutation.setCoverageOptions.onSuccess`)
      return result.data
    },
    onSuccess: () => {
      logger.info({}, `${LOG_NAMESPACE}: mutation.setCoverageOptions.onSuccess`)
    },
    onError: (error) => {
      logger.error(
        { error },
        `${LOG_NAMESPACE}: mutation.setCoverageOptions.onError`
      )
    }
  })
}
