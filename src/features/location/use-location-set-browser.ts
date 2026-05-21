'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import type { LocationState } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { LOCATION_QUERY_KEY } from './keys'
import {
  applyLocationInput,
  initialLocationState,
  locationRepository
} from './repository'
import { getBrowserLocation } from './utils'

export const useLocationSetBrowser = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      logger.info({}, `${LOG_NAMESPACE}: mutationFn [setBrowser]`)
      const base =
        qc.getQueryData<LocationState>(LOCATION_QUERY_KEY) ??
        initialLocationState

      qc.setQueryData(LOCATION_QUERY_KEY, {
        ...base,
        isLoading: true,
        error: null
      })

      try {
        const input = await getBrowserLocation()
        const next = applyLocationInput(base, input)

        if (next.error) {
          throw new Error(next.error)
        }

        const final: LocationState = { ...next, isLoading: false }
        qc.setQueryData(LOCATION_QUERY_KEY, final)
        locationRepository.write(final)
        return final
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        qc.setQueryData(LOCATION_QUERY_KEY, {
          ...base,
          isLoading: false,
          error: errorMessage
        })
        throw error
      }
    },
    onMutate: () => {
      logger.info({}, `${LOG_NAMESPACE}: mutation.onMutate [setBrowser]`)
    },
    onSuccess: (data) => {
      logger.info({ data }, `${LOG_NAMESPACE}: mutation.onSuccess [setBrowser]`)
    },
    onError: (error) => {
      logger.error({ error }, `${LOG_NAMESPACE}: mutation.onError [setBrowser]`)
    }
  })
}
