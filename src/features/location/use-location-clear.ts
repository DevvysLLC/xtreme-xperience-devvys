'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import { LOG_NAMESPACE } from './config'
import { LOCATION_CLEAR_MUTATION_KEY, LOCATION_QUERY_KEY } from './keys'
import { initialLocationState, locationRepository } from './repository'

export const useLocationClear = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: LOCATION_CLEAR_MUTATION_KEY,
    mutationFn: async () => {
      logger.info({}, `${LOG_NAMESPACE}: mutationFn [clear]`)
      qc.setQueryData(LOCATION_QUERY_KEY, initialLocationState)
      locationRepository.clear()
    },
    onMutate: () => {
      logger.info({}, `${LOG_NAMESPACE}: mutation.onMutate [clear]`)
    },
    onSuccess: () => {
      logger.info({}, `${LOG_NAMESPACE}: mutation.onSuccess [clear]`)
    },
    onError: (error) => {
      logger.error({ error }, `${LOG_NAMESPACE}: mutation.onError [clear]`)
    }
  })
}
