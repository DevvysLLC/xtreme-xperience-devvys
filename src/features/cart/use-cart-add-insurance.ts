'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import type { InsuranceFragment } from '../../core/dato/fragments/insurance.typegen'
import { logger } from '../../core/logger/logger'
import { useAnalyticsEcommerceEvent } from '../../features/analytics'
import type {
  ApiCartResponse,
  CartState,
  RocketRezAddLineItemAddon
} from '../../io/types'
import { getAddToCartLineItemInsuranceMetadata } from '../../utils/get-add-to-cart-line-item-insurance-metadata'
import { LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY } from './keys'
import { cartRepository, initialCartState } from './repository'
import { useCartMutation } from './use-cart-mutation'

export type UseCartAddInsuranceInput = {
  insurance: InsuranceFragment
  lineItem: RocketRezAddLineItemAddon
  totalSessions?: number
}

export const useCartAddInsurance = (): UseMutationResult<
  ApiCartResponse,
  Error,
  UseCartAddInsuranceInput
> => {
  const qc = useQueryClient()
  const analytics = useAnalyticsEcommerceEvent()

  return useCartMutation<UseCartAddInsuranceInput>({
    endpoint: ROUTES.API.CART.ADD,
    method: 'POST',
    includeBody: true,
    getBody: (input) => ({ lineItems: [input.lineItem] }),
    requireCartKey: false,
    onSuccessExtra: (data, input) => {
      logger.info(
        { data, input },
        `${LOG_NAMESPACE}: mutation.onSuccess [addInsurance]`
      )
      if (data.cart.lineItems.length === 0) {
        return
      }
      const metadata = getAddToCartLineItemInsuranceMetadata({
        insurance: input.insurance,
        lineItem: input.lineItem,
        totalSessions: input.totalSessions
      })
      const current =
        qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
      const existingMetadata = current.metadata.find(
        (meta) => meta.key === metadata.key
      )
      if (!existingMetadata) {
        const next = {
          ...current,
          metadata: [...current.metadata, metadata]
        }
        qc.setQueryData<CartState>(CART_QUERY_KEY, next)
        cartRepository.write(next)
      }
      const updated =
        qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
      analytics.trackAddToCart(data.cart, updated.metadata)
      logger.info(
        { metadata },
        `${LOG_NAMESPACE}: mutation.onSuccess [addInsurance] — metadata set`
      )
    },
    onError: (error, input) => {
      logger.error(
        { error, input },
        `${LOG_NAMESPACE}: mutation.onError [addInsurance]`
      )
    }
  })
}
