'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
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
import { LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY } from './keys'
import { cartRepository, initialCartState } from './repository'

/**
 * Clears all client-side stores (cart, booking, checkout) and their React
 * Query caches.
 *
 * This is intentionally separated from `useCartComplete` to avoid a race
 * condition: the wizard guard watches `cart.contents.totalItems` and would
 * redirect to HOME if the cart state were cleared while the pathname is still
 * `/checkout/payment` (before the router navigates to the complete page). By
 * deferring store cleanup to the complete page — which is already bypassed by
 * the guard — the redirect never fires.
 *
 * @see useCartComplete — completes the cart order server-side
 */
export const useCartClearAfterComplete = () => {
  const qc = useQueryClient()

  return useCallback(() => {
    logger.info(
      {},
      `${LOG_NAMESPACE}: clearAfterComplete — clearing all stores`
    )

    qc.setQueryData(CART_QUERY_KEY, initialCartState)
    cartRepository.clear()

    qc.setQueryData(BOOKING_QUERY_KEY, initialBookingState)
    void bookingRepository.clear()

    qc.setQueryData(CHECKOUT_QUERY_KEY, initialCheckoutState)
    checkoutRepository.clear()

    logger.info({}, `${LOG_NAMESPACE}: clearAfterComplete — complete`)
  }, [qc])
}
