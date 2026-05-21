'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { TrackDataFragment } from '../../core/dato/fragments/track-data.typegen'
import { logger } from '../../core/logger/logger'
import type { LocationState } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { LOCATION_QUERY_KEY } from './keys'
import {
  applyTrack,
  initialLocationState,
  locationRepository
} from './repository'

export const useLocationSetTrack = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (track: TrackDataFragment) => {
      logger.info(
        { trackId: track.id },
        `${LOG_NAMESPACE}: mutationFn [setTrack]`
      )
      const base =
        qc.getQueryData<LocationState>(LOCATION_QUERY_KEY) ??
        initialLocationState
      const next = applyTrack(base, track)

      qc.setQueryData(LOCATION_QUERY_KEY, next)
      locationRepository.write(next)
      return next
    },
    onMutate: (track) => {
      logger.info(
        { trackId: track.id },
        `${LOG_NAMESPACE}: mutation.onMutate [setTrack]`
      )
    },
    onSuccess: (data) => {
      logger.info({ data }, `${LOG_NAMESPACE}: mutation.onSuccess [setTrack]`)
    },
    onError: (error) => {
      logger.error({ error }, `${LOG_NAMESPACE}: mutation.onError [setTrack]`)
    }
  })
}
