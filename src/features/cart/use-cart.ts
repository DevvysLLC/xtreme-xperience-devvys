'use client'

/**
 * Rich cart hook for use in components.
 *
 * Wraps `useCartState` and adds:
 * - `data.contents`   — computed cart summary (item counts, totals, flags)
 *                       derived from `cartData`, `metadata`, and `chooseOnDriveDay`
 * - `isRefreshing`    — true while `useCartRefresh` is fetching from the API
 * - `isLoading`       — true while any loading/initialising/refreshing is in progress
 * - `isReady`         — true once initialisation and loading have settled
 * - `isUpdating`      — true while a mutation is in flight
 * - `clear()`         — resets the cart and checkout cache entries and clears localStorage
 *
 * This is the hook all components should reach for.  `useCartState` is an
 * internal primitive used by `useCartRefresh` to avoid a circular dependency.
 */
import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'
import { logger } from '../../core/logger/logger'
import type { CartLineItemMetadata, RocketRezCart } from '../../io/types'
import { CHECKOUT_QUERY_KEY } from '../checkout/keys'
import {
  checkoutRepository,
  initialCheckoutState
} from '../checkout/repository'
import { LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY, CART_REFRESH_QUERY_KEY } from './keys'
import { cartRepository, initialCartState } from './repository'
import { useCartState } from './use-cart-state'
import { type CartContents, computeContents } from './utils'

export type CartData = {
  isOpen: boolean
  isLoading: boolean
  error: string | null
  cartData: RocketRezCart | null
  metadata: CartLineItemMetadata[]
  contents: CartContents
}

export type UseCartReturn = {
  data: CartData
  isRefreshing: boolean
  isReady: boolean
  isUpdating: boolean
  isLoading: boolean
  clear: () => void
}

export const useCart = (): UseCartReturn => {
  const qc = useQueryClient()
  const { data: state, isFetched } = useCartState()
  const isRefreshing = useIsFetching({ queryKey: CART_REFRESH_QUERY_KEY }) > 0

  const contents = useMemo<CartContents>(
    () =>
      computeContents(
        state.cartData ?? null,
        state.metadata,
        state.chooseOnDriveDay
      ),
    [state.cartData, state.metadata, state.chooseOnDriveDay]
  )

  const data = useMemo<CartData>(
    () => ({
      isOpen: state.isOpen,
      isLoading: state.isLoading,
      error: state.error,
      cartData: state.cartData ?? null,
      metadata: state.metadata,
      contents
    }),
    [
      state.isOpen,
      state.isLoading,
      state.error,
      state.cartData,
      state.metadata,
      contents
    ]
  )

  const isReady = !state.isInitializing && !state.isLoading && isFetched
  const isUpdating = state.isMutating
  const isLoading = state.isLoading || state.isInitializing || isRefreshing

  const clear = useCallback(() => {
    qc.setQueryData(CART_QUERY_KEY, initialCartState)
    cartRepository.clear()
    qc.setQueryData(CHECKOUT_QUERY_KEY, initialCheckoutState)
    checkoutRepository.clear()
  }, [qc])

  useEffect(() => {
    logger.info(
      {
        hasCartData: !!data.cartData,
        totalItems: data.contents.totalItems,
        isLoading,
        isRefreshing
      },
      `${LOG_NAMESPACE}: useCart.mount`
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    logger.info(
      {
        hasCartData: !!data.cartData,
        totalItems: data.contents.totalItems,
        isLoading,
        isRefreshing,
        isReady,
        isUpdating
      },
      `${LOG_NAMESPACE}: useCart.state`
    )
  }, [data, isLoading, isRefreshing, isReady, isUpdating])

  return { data, isRefreshing, isReady, isUpdating, isLoading, clear }
}
