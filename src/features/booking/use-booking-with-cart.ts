'use client'

import { useMemo } from 'react'
import { useCart } from '../cart'
import { useBooking } from './use-booking'

/**
 * Combined booking and cart state
 *
 * - Merges booking query with cart data
 * - Provides unified loading states
 * - Main hook for wizard pages
 */
export type UseBookingWithCartReturn = {
  isLoading: boolean
  isUpdating: boolean
  booking: ReturnType<typeof useBooking>['data'] | undefined
  cart: ReturnType<typeof useCart>['data'] & {
    cartData: ReturnType<typeof useCart>['data']['cartData']
    contents: ReturnType<typeof useCart>['data']['contents']
  }
}

export const useBookingWithCart = (): UseBookingWithCartReturn => {
  const bookingQuery = useBooking()
  const cart = useCart()

  const isLoading = useMemo(
    () => bookingQuery.isLoading || cart.isLoading,
    [bookingQuery.isLoading, cart.isLoading]
  )

  const isUpdating = useMemo(() => cart.isUpdating, [cart.isUpdating])

  return {
    isLoading,
    isUpdating,
    booking: bookingQuery.data,
    cart: {
      ...cart.data,
      cartData: cart.data.cartData,
      contents: cart.data.contents
    }
  }
}

export type UseBookingWithCartReturnType = ReturnType<typeof useBookingWithCart>
