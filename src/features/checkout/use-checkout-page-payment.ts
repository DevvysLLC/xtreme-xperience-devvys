'use client'

import { useCallback, useMemo } from 'react'
import { RocketRezCartStatusSchema } from '../../io/schemas'
import type { CheckoutWizardPagePaymentInput } from '../../io/types'
import { useCart } from '../cart'
import { useCheckout } from './use-checkout'
import { useCheckoutSetPayment } from './use-checkout-set-payment'

export const useCheckoutPagePayment = () => {
  const { data: checkout } = useCheckout()
  const { data: cart } = useCart()
  const contents = cart?.contents
  const cartData = cart?.cartData
  const setPayment = useCheckoutSetPayment()
  const persisted = checkout?.payment ?? null

  const save = useCallback(
    (input: CheckoutWizardPagePaymentInput) => setPayment.mutateAsync(input),
    [setPayment]
  )
  const isValid = useMemo(
    () =>
      Boolean(
        (contents?.totalItems ?? 0) > 0 &&
          cartData?.status === RocketRezCartStatusSchema.enum.Active &&
          (cartData?.contacts?.length ?? 0) > 0 &&
          (cartData?.lineItems?.length ?? 0) > 0 &&
          (cartData?.total ?? 0) > 0
      ),
    [
      cartData?.contacts?.length,
      cartData?.lineItems?.length,
      cartData?.status,
      cartData?.total,
      contents?.totalItems
    ]
  )

  return useMemo(
    () => ({
      persisted,
      save,
      isValid
    }),
    [persisted, save, isValid]
  )
}

export type UseCheckoutPagePaymentReturn = ReturnType<
  typeof useCheckoutPagePayment
>
