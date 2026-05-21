'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { EventDataFragment } from '../../core/dato/fragments/event-data.typegen'
import { logger } from '../../core/logger/logger'
import { DatoEventDataFragmentSchema } from '../../io/schemas'
import type { BookingState } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { BOOKING_QUERY_KEY } from './keys'
import { bookingRepository, initialBookingState } from './repository'

/**
 * Set selected event in booking
 *
 * - Saves event data to booking store
 * - Persists to localStorage
 * - Pass null to clear event
 */
export const useBookingSetEvent = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (event: EventDataFragment | null) => {
      logger.info({ event }, `${LOG_NAMESPACE}: mutation.setEvent.onMutate`)
      const base =
        qc.getQueryData<BookingState>(BOOKING_QUERY_KEY) ?? initialBookingState

      if (!event) {
        const next: BookingState = { ...base, event: null, error: null }
        qc.setQueryData(BOOKING_QUERY_KEY, next)
        await bookingRepository.write(next)
        logger.info({}, `${LOG_NAMESPACE}: mutation.setEvent.onSuccess`)
        return event
      }

      const normalizedData: EventDataFragment = {
        ...event,
        model: event.model
          ? {
              ...event.model,
              media: event.model.media ?? null,
              gradient: event.model.gradient ?? null,
              track: event.model.track
                ? {
                    ...event.model.track,
                    model: event.model.track.model
                      ? {
                          ...event.model.track.model,
                          trackSvg: event.model.track.model.trackSvg ?? null
                        }
                      : null
                  }
                : event.model.track
            }
          : null
      }

      const result = DatoEventDataFragmentSchema.safeParse(normalizedData)
      if (!result.success) {
        const errorMsg = `Invalid event data: ${result.error.issues.map((i) => i.message).join(', ')}`
        const next: BookingState = { ...base, error: errorMsg }
        qc.setQueryData(BOOKING_QUERY_KEY, next)
        await bookingRepository.write(next)
        throw new Error(errorMsg)
      }

      const next: BookingState = {
        ...base,
        event: normalizedData,
        error: null
      }
      qc.setQueryData(BOOKING_QUERY_KEY, next)
      await bookingRepository.write(next)

      logger.info(
        { eventId: event.id },
        `${LOG_NAMESPACE}: mutation.setEvent.onSuccess`
      )
      return event
    },
    onSuccess: (event) => {
      logger.info(
        { eventId: event?.id },
        `${LOG_NAMESPACE}: mutation.setEvent.onSuccess`
      )
    },
    onError: (error, event) => {
      logger.error(
        { error, eventId: event?.id },
        `${LOG_NAMESPACE}: mutation.setEvent.onError`
      )
    }
  })
}
