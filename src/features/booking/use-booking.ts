'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { logger } from '../../core/logger/logger'
import { LOG_NAMESPACE } from './config'
import { BOOKING_QUERY_KEY } from './keys'
import { bookingRepository } from './repository'

export const useBooking = () => {
  const query = useQuery({
    queryKey: BOOKING_QUERY_KEY,
    queryFn: async () => {
      logger.info({}, `${LOG_NAMESPACE}: query.start`)
      const data = await bookingRepository.read()
      logger.info(
        { currentPage: data.currentPage },
        `${LOG_NAMESPACE}: query.complete`
      )
      return data
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY
  })

  useEffect(() => {
    logger.info(
      { hasData: !!query.data, currentPage: query.data?.currentPage ?? null },
      `${LOG_NAMESPACE}: useBooking.mount`
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    logger.info(
      { hasData: !!query.data, currentPage: query.data?.currentPage ?? null },
      `${LOG_NAMESPACE}: useBooking.data`
    )
  }, [query.data])

  return query
}
