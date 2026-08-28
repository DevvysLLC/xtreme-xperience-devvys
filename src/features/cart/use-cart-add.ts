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
  metadata?: CartLineItemMetadata | CartLineItemMetadata[]
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
      const newMetadatas = Array.isArray(metadata) ? metadata : [metadata]
      const current =
        qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
      
      const nextMetadataList = [...current.metadata]
      let hasChanges = false
      for (const item of newMetadatas) {
        const exists = nextMetadataList.some((m) => m.key === item.key)
        if (!exists) {
          nextMetadataList.push(item)
          hasChanges = true
        }
      }

      if (hasChanges) {
        const next = {
          ...current,
          metadata: nextMetadataList
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
