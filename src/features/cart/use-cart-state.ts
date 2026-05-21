'use client'

/**
 * Raw TanStack Query hook for the cart cache entry.
 *
 * Returns `UseQueryResult<CartState>` directly — no derived fields, no
 * computed contents.  Use this when you only need the plain cache value
 * (e.g. reading `cartKey`, `timerStartedAt`) or when you must avoid the
 * circular dependency that would arise from calling `useCart` inside
 * `useCartRefresh` (which `useCart` itself observes).
 *
 * For everything else, prefer `useCart`.
 */
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { logger } from '../../core/logger/logger'
import { LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY } from './keys'
import { cartRepository, initialCartState } from './repository'

export const useCartState = () => {
  const query = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: () => {
      logger.info({}, `${LOG_NAMESPACE}: query.start`)
      const data = cartRepository.read()
      logger.info(
        {
          hasCartKey: !!data.cartKey,
          itemCount: data.cartData?.lineItems?.length ?? 0
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
        hasCartKey: !!query.data?.cartKey,
        itemCount: query.data?.cartData?.lineItems?.length ?? 0
      },
      `${LOG_NAMESPACE}: useCartState.mount`
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    logger.info(
      {
        hasCartKey: !!query.data?.cartKey,
        itemCount: query.data?.cartData?.lineItems?.length ?? 0,
        isInitializing: query.data?.isInitializing,
        isMutating: query.data?.isMutating
      },
      `${LOG_NAMESPACE}: useCartState.data`
    )
  }, [query.data])

  return { ...query, data: query.data ?? initialCartState }
}
