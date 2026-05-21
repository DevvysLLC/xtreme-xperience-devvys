'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { logger } from '../../core/logger/logger'
import { LOG_NAMESPACE } from './config'
import { CHECKOUT_QUERY_KEY } from './keys'
import { checkoutRepository, initialCheckoutState } from './repository'

export const useCheckout = () => {
  const query = useQuery({
    queryKey: CHECKOUT_QUERY_KEY,
    queryFn: () => {
      logger.info({}, `${LOG_NAMESPACE}: query.start`)
      const data = checkoutRepository.read()
      logger.info(
        { hasDetails: !!data.details, hasPayment: !!data.payment },
        `${LOG_NAMESPACE}: query.complete`
      )
      return data
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    initialData: initialCheckoutState
  })

  useEffect(() => {
    logger.info(
      {
        hasDetails: !!query.data.details,
        hasPayment: !!query.data.payment
      },
      `${LOG_NAMESPACE}: useCheckout.mount`
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    logger.info(
      {
        hasDetails: !!query.data.details,
        hasPayment: !!query.data.payment
      },
      `${LOG_NAMESPACE}: useCheckout.data`
    )
  }, [query.data])

  return query
}
