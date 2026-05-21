'use client'

import { useMemo } from 'react'
import { useCart } from '../cart'
import { useCheckout } from './use-checkout'

export type UseCheckoutWithCartReturn = {
  isLoading: boolean
  isUpdating: boolean
  checkout: ReturnType<typeof useCheckout>['data'] | undefined
  cart: ReturnType<typeof useCart>['data'] & {
    cartData: ReturnType<typeof useCart>['data']['cartData']
    contents: ReturnType<typeof useCart>['data']['contents']
  }
}

export const useCheckoutWithCart = (): UseCheckoutWithCartReturn => {
  const checkoutQuery = useCheckout()
  const cart = useCart()

  const isLoading = useMemo(
    () => checkoutQuery.isLoading || cart.isLoading,
    [checkoutQuery.isLoading, cart.isLoading]
  )

  const isUpdating = useMemo(() => cart.isUpdating, [cart.isUpdating])

  return {
    isLoading,
    isUpdating,
    checkout: checkoutQuery.data,
    cart: {
      ...cart.data,
      cartData: cart.data.cartData,
      contents: cart.data.contents
    }
  }
}
