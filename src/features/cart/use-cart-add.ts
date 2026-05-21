'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import { useAnalyticsEcommerceEvent } from '../../features/analytics'
import type { ApiCartResponse, RocketRezAddLineItemRequest } from '../../io'
import type { CartLineItemMetadata, CartState } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY } from './keys'
import { cartRepository, initialCartState } from './repository'
import { useCartMutation } from './use-cart-mutation'

type AddToCartInput = {
  request: RocketRezAddLineItemRequest
  metadata?: CartLineItemMetadata
}

export const useCartAdd = (): UseMutationResult<
  ApiCartResponse,
  Error,
  AddToCartInput
> => {
  const qc = useQueryClient()
  const analytics = useAnalyticsEcommerceEvent()

  return useCartMutation<AddToCartInput>({
    endpoint: ROUTES.API.CART.ADD,
    method: 'POST',
    includeBody: true,
    getBody: (input) => input.request,
    requireCartKey: false,
    onSuccessExtra: (data, input) => {
      logger.info({ data, input }, `${LOG_NAMESPACE}: mutation.onSuccess [add]`)
      const { metadata } = input
      if (!metadata || data.cart.lineItems.length === 0) {
        return
      }
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
        `${LOG_NAMESPACE}: mutation.onSuccess [add] — metadata set`
      )
    },
    onError: (error, input) => {
      logger.error({ error, input }, `${LOG_NAMESPACE}: mutation.onError [add]`)
    }
  })
}
