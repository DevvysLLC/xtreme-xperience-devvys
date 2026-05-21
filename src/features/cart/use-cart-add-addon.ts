'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import type { AddonFragment } from '../../core/dato/fragments/addon.typegen'
import { logger } from '../../core/logger/logger'
import { useAnalyticsEcommerceEvent } from '../../features/analytics'
import type {
  ApiCartResponse,
  CartState,
  RocketRezAddLineItemAddon
} from '../../io/types'
import { getAddToCartLineItemAddonMetadata } from '../../utils/get-add-to-cart-line-item-addon-metadata'
import { LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY } from './keys'
import { cartRepository, initialCartState } from './repository'
import { useCartMutation } from './use-cart-mutation'

export type UseCartAddAddonInput = {
  addon: AddonFragment
  lineItem: RocketRezAddLineItemAddon
}

export const useCartAddAddon = (): UseMutationResult<
  ApiCartResponse,
  Error,
  UseCartAddAddonInput
> => {
  const qc = useQueryClient()
  const analytics = useAnalyticsEcommerceEvent()

  return useCartMutation<UseCartAddAddonInput>({
    endpoint: ROUTES.API.CART.ADD,
    method: 'POST',
    includeBody: true,
    getBody: (input) => ({ lineItems: [input.lineItem] }),
    requireCartKey: false,
    onSuccessExtra: (data, input) => {
      logger.info(
        { data, input },
        `${LOG_NAMESPACE}: mutation.onSuccess [addAddon]`
      )
      if (data.cart.lineItems.length === 0) {
        return
      }
      const metadata = getAddToCartLineItemAddonMetadata({
        addon: input.addon,
        lineItem: input.lineItem
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
        `${LOG_NAMESPACE}: mutation.onSuccess [addAddon] — metadata set`
      )
    },
    onError: (error, input) => {
      logger.error(
        { error, input },
        `${LOG_NAMESPACE}: mutation.onError [addAddon]`
      )
    }
  })
}
