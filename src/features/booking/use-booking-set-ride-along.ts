'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import { BookingRideAlongSchema } from '../../io/schemas'
import type {
  BookingState,
  BookingWizardPageRideAlongInput
} from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { BOOKING_QUERY_KEY } from './keys'
import { bookingRepository, initialBookingState } from './repository'

export const useBookingSetRideAlong = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: BookingWizardPageRideAlongInput) => {
      logger.info({ input }, `${LOG_NAMESPACE}: mutation.setRideAlong.onMutate`)
      const base =
        qc.getQueryData<BookingState>(BOOKING_QUERY_KEY) ?? initialBookingState

      const result = BookingRideAlongSchema.safeParse({
        value: input.value ?? null,
        pageIsValid: input.pageIsValid,
        userHasSubmitted: input.userHasSubmitted,
        lastSubmittedAt: new Date().toISOString()
      })

      if (!result.success) {
        const errorMsg = `Invalid ride along data: ${result.error.issues.map((i) => i.message).join(', ')}`
        const next: BookingState = { ...base, error: errorMsg }
        qc.setQueryData(BOOKING_QUERY_KEY, next)
        await bookingRepository.write(next)
        throw new Error(errorMsg)
      }

      const next: BookingState = {
        ...base,
        ride_along: result.data,
        error: null
      }
      qc.setQueryData(BOOKING_QUERY_KEY, next)
      await bookingRepository.write(next)

      logger.info({}, `${LOG_NAMESPACE}: mutation.setRideAlong.onSuccess`)
      return result.data
    },
    onSuccess: () => {
      logger.info({}, `${LOG_NAMESPACE}: mutation.setRideAlong.onSuccess`)
    },
    onError: (error) => {
      logger.error({ error }, `${LOG_NAMESPACE}: mutation.setRideAlong.onError`)
    }
  })
}
