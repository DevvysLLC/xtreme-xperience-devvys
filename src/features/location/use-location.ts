'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { logger } from '../../core/logger/logger'
import { LOG_NAMESPACE } from './config'
import { LOCATION_QUERY_KEY } from './keys'
import { initialLocationState, locationRepository } from './repository'

export const useLocation = () => {
  const query = useQuery({
    queryKey: LOCATION_QUERY_KEY,
    queryFn: () => {
      logger.info({}, `${LOG_NAMESPACE}: query.start`)
      const data = locationRepository.read()
      logger.info(
        {
          hasCoordinates: !!(data.latitude && data.longitude),
          hasTrack: !!data.track
        },
        `${LOG_NAMESPACE}: query.complete`
      )
      return data
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY
  })

  useEffect(() => {
    logger.info(
      {
        hasCoordinates: !!(query.data?.latitude && query.data?.longitude),
        hasTrack: !!query.data?.track
      },
      `${LOG_NAMESPACE}: useLocation.mount`
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    logger.info(
      {
        hasCoordinates: !!(query.data?.latitude && query.data?.longitude),
        hasTrack: !!query.data?.track
      },
      `${LOG_NAMESPACE}: useLocation.data [changed]`
    )
  }, [query.data])

  return { ...query, data: query.data ?? initialLocationState }
}
