'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { TrackDataFragment } from '../../core/dato/fragments/track-data.typegen'
import { logger } from '../../core/logger/logger'
import type { BookingState } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { BOOKING_QUERY_KEY } from './keys'
import { bookingRepository, initialBookingState } from './repository'

/**
 * Set selected track in booking
 *
 * - Saves track data to booking store
 * - Persists to localStorage
 * - Pass null to clear track
 */
export const useBookingSetTrack = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (track: TrackDataFragment | null) => {
      logger.info({ track }, `${LOG_NAMESPACE}: mutation.setTrack.onMutate`)
      const base =
        qc.getQueryData<BookingState>(BOOKING_QUERY_KEY) ?? initialBookingState
      const next: BookingState = { ...base, track, error: null }

      qc.setQueryData(BOOKING_QUERY_KEY, next)
      await bookingRepository.write(next)

      logger.info(
        { trackHandle: track?.config?.handle },
        `${LOG_NAMESPACE}: mutation.setTrack.onSuccess`
      )
      return track
    },
    onSuccess: (track) => {
      logger.info(
        { trackHandle: track?.config?.handle },
        `${LOG_NAMESPACE}: mutation.setTrack.onSuccess`
      )
    },
    onError: (error, track) => {
      logger.error(
        { error, trackHandle: track?.config?.handle },
        `${LOG_NAMESPACE}: mutation.setTrack.onError`
      )
    }
  })
}
