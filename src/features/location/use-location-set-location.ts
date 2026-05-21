'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import type { LocationInput, LocationState } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { LOCATION_QUERY_KEY } from './keys'
import {
  applyLocationInput,
  initialLocationState,
  locationRepository
} from './repository'

export const useLocationSetLocation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: LocationInput) => {
      logger.info({ input }, `${LOG_NAMESPACE}: mutationFn [setLocation]`)
      const base =
        qc.getQueryData<LocationState>(LOCATION_QUERY_KEY) ??
        initialLocationState
      const next = applyLocationInput(base, input)

      if (next.error) {
        throw new Error(next.error)
      }

      qc.setQueryData(LOCATION_QUERY_KEY, next)
      locationRepository.write(next)
      return next
    },
    onMutate: (input) => {
      logger.info(
        { input },
        `${LOG_NAMESPACE}: mutation.onMutate [setLocation]`
      )
    },
    onSuccess: (data) => {
      logger.info(
        { data },
        `${LOG_NAMESPACE}: mutation.onSuccess [setLocation]`
      )
    },
    onError: (error) => {
      logger.error(
        { error },
        `${LOG_NAMESPACE}: mutation.onError [setLocation]`
      )
    }
  })
}
