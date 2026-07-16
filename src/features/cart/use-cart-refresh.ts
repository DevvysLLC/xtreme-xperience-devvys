'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import { BOOKING_QUERY_KEY } from '../../features/booking/keys'
import {
  bookingRepository,
  initialBookingState
} from '../../features/booking/repository'
import { CHECKOUT_QUERY_KEY } from '../../features/checkout/keys'
import {
  checkoutRepository,
  initialCheckoutState
} from '../../features/checkout/repository'
import {
  type ApiCartResponse,
  ApiCartResponseSchema,
  CartStatus
} from '../../io'
import type { CartState } from '../../io/types'
import { CartKeyHelpers } from '../../utils/cart-key'
import {
  clearTrackedCartSnapshots,
  rememberTrackedCartSnapshot
} from '../analytics/utils'
import { LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY, CART_REFRESH_QUERY_KEY } from './keys'
import { cartRepository, initialCartState } from './repository'
import { useCartState } from './use-cart-state'

const clearAllStores = (qc: ReturnType<typeof useQueryClient>) => {
  clearTrackedCartSnapshots()
  qc.setQueryData(CART_QUERY_KEY, initialCartState)
  cartRepository.clear()

  qc.setQueryData(BOOKING_QUERY_KEY, initialBookingState)
  void bookingRepository.clear()

  qc.setQueryData(CHECKOUT_QUERY_KEY, initialCheckoutState)
  checkoutRepository.clear()
}

export const useCartRefresh = () => {
  const qc = useQueryClient()
  const { data: cartState } = useCartState()
  const cartKey = cartState.cartKey ?? null

  useEffect(() => {
    logger.info(
      { hasCartKey: !!cartKey },
      `${LOG_NAMESPACE}: useCartRefresh.mount`
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    logger.info(
      { hasCartKey: !!cartKey },
      `${LOG_NAMESPACE}: useCartRefresh.cartKey`
    )
  }, [cartKey])

  const query = useQuery({
    queryKey: CART_REFRESH_QUERY_KEY,
    enabled: !!cartKey,
    refetchOnMount: true,
    retry: false,
    queryFn: async ({ signal }): Promise<ApiCartResponse | null> => {
      if (!cartKey) {
        return null
      }

      logger.info({ cartKey }, `${LOG_NAMESPACE}: refresh.start`)

      const res = await fetch(ROUTES.API.CART.GET, {
        headers: { 'x-cart-key': cartKey },
        signal
      })

      if (res.status === 401 || res.status === 404) {
        logger.info(
          { status: res.status },
          `${LOG_NAMESPACE}: refresh.expired-cart`
        )
        return null
      }

      if (!res.ok) {
        throw new Error('Failed to refresh cart')
      }

      const json: unknown = await res.json()
      const parseResult = ApiCartResponseSchema.safeParse(json)

      if (!parseResult.success) {
        throw new Error('Invalid response format')
      }

      if (parseResult.data.status !== 'success') {
        throw new Error(parseResult.data.message ?? 'Failed to refresh cart')
      }

      return parseResult.data
    }
  })

  useEffect(() => {
    if (!query.isFetched) {
      return
    }

    if (query.isError) {
      logger.warn({}, `${LOG_NAMESPACE}: refresh.error — not clearing cart`)
      return
    }

    const base = qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState

    if (base.isMutating) {
      logger.info({}, `${LOG_NAMESPACE}: refresh.skip — mutation in progress`)
      return
    }

    if (!query.data || query.data.status !== 'success') {
      logger.info({}, `${LOG_NAMESPACE}: refresh.invalid — clearing all stores`)
      clearAllStores(qc)
      return
    }

    const cartData = query.data.data

    const isExpired =
      cartData.cart.expiryDate &&
      new Date(cartData.cart.expiryDate).getTime() < Date.now()

    if (isExpired) {
      logger.info(
        { expiryDate: cartData.cart.expiryDate },
        `${LOG_NAMESPACE}: refresh.expired — clearing all stores`
      )
      clearAllStores(qc)
      return
    }

    if (cartData.cart.status !== CartStatus.ACTIVE) {
      logger.info(
        { status: cartData.cart.status },
        `${LOG_NAMESPACE}: refresh.inactive — clearing all stores`
      )
      clearAllStores(qc)
      return
    }

    let next = { ...base }

    if (cartData.cartToken && cartData.tokenExpiry && cartData.cart.id) {
      const newCartKey = CartKeyHelpers.create(
        cartData.cart.id,
        cartData.cartToken
      )
      next = { ...next, cartKey: newCartKey, tokenExpiry: cartData.tokenExpiry }
    }

    const hasItems = (cartData.cart.lineItems?.length ?? 0) > 0
    if (hasItems && !next.timerStartedAt) {
      next = { ...next, timerStartedAt: new Date().toISOString() }
    }

    next = { ...next, cartData: cartData.cart }

    rememberTrackedCartSnapshot(cartData.cart)
    qc.setQueryData(CART_QUERY_KEY, next)
    cartRepository.write(next)

    logger.info(
      { itemCount: cartData.cart.lineItems?.length ?? 0 },
      `${LOG_NAMESPACE}: refresh.complete`
    )
  }, [query.data, query.isError, query.isFetched, qc])

  return query
}
