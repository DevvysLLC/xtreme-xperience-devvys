'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import type { LocationState } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { LOCATION_QUERY_KEY } from './keys'
import {
  applyClearTrack,
  initialLocationState,
  locationRepository
} from './repository'

export const useLocationClearTrack = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      logger.info({}, `${LOG_NAMESPACE}: mutationFn [clearTrack]`)
      const base =
        qc.getQueryData<LocationState>(LOCATION_QUERY_KEY) ??
        initialLocationState
      const next = applyClearTrack(base)

      qc.setQueryData(LOCATION_QUERY_KEY, next)
      locationRepository.write(next)
    },
    onMutate: () => {
      logger.info({}, `${LOG_NAMESPACE}: mutation.onMutate [clearTrack]`)
    },
    onSuccess: () => {
      logger.info({}, `${LOG_NAMESPACE}: mutation.onSuccess [clearTrack]`)
    },
    onError: (error) => {
      logger.error({ error }, `${LOG_NAMESPACE}: mutation.onError [clearTrack]`)
    }
  })
}
