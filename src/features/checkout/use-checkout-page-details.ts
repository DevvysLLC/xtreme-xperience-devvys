'use client'

import { useCallback, useMemo } from 'react'
import { RocketRezCartStatusSchema } from '../../io/schemas'
import type { CheckoutWizardPageDetailsInput } from '../../io/types'
import { useCart } from '../cart'
import { useCheckout } from './use-checkout'
import { useCheckoutSetDetails } from './use-checkout-set-details'

export const useCheckoutPageDetails = () => {
  const { data: checkout } = useCheckout()
  const { data } = useCart()
  const contents = data?.contents
  const cartData = data?.cartData
  const setDetails = useCheckoutSetDetails()
  const persisted = checkout?.details ?? null

  const save = useCallback(
    (input: CheckoutWizardPageDetailsInput) => setDetails.mutateAsync(input),
    [setDetails]
  )

  const isValid = useMemo(
    () =>
      (contents?.totalItems ?? 0) > 0 &&
      cartData?.status === RocketRezCartStatusSchema.enum.Active &&
      (cartData?.contacts?.length ?? 0) > 0 &&
      (cartData?.lineItems?.length ?? 0) > 0 &&
      (cartData?.total ?? 0) > 0,
    [
      cartData?.contacts?.length,
      cartData?.lineItems?.length,
      cartData?.status,
      cartData?.total,
      contents?.totalItems
    ]
  )

  return useMemo(
    () => ({ persisted, isValid, save }),
    [persisted, isValid, save]
  )
}

export type UseCheckoutPageDetailsReturn = ReturnType<
  typeof useCheckoutPageDetails
>
