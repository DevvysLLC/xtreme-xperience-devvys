'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import { useAnalyticsEcommerceEvent } from '../../features/analytics'
import type { ApiCartResponse } from '../../io'
import type { CartState, RocketRezLineItem } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY } from './keys'
import { initialCartState } from './repository'
import { useCartMutation } from './use-cart-mutation'

export type UseCartUpdateLineItemInput = {
  lineItem: RocketRezLineItem
  quantity: number
}

export const useCartUpdateLineItem = (): UseMutationResult<
  ApiCartResponse,
  Error,
  UseCartUpdateLineItemInput
> => {
  const qc = useQueryClient()
  const analytics = useAnalyticsEcommerceEvent()

  return useCartMutation<UseCartUpdateLineItemInput>({
    endpoint: (input) =>
      `${ROUTES.API.CART.UPDATE}?lineItemId=${input.lineItem.id}`,
    method: 'PATCH',
    includeBody: true,
    getBody: (input) => ({ quantity: input.quantity }),
    requireCartKey: true,
    onSuccessExtra: (data, input) => {
      logger.info(
        { data, input },
        `${LOG_NAMESPACE}: mutation.onSuccess [updateLineItem]`
      )

      const current =
        qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
      if (input.quantity > (input.lineItem.quantity ?? 0)) {
        analytics.trackAddToCart(data.cart, current.metadata)
      } else if (input.quantity < (input.lineItem.quantity ?? 0)) {
        analytics.trackRemoveFromCart(
          data.cart,
          input.lineItem,
          current.metadata
        )
      }
      logger.info(
        { data, input },
        `${LOG_NAMESPACE}: mutation.onSuccess [updateLineItem] — complete`
      )
    },
    onError: (error, input) => {
      logger.error(
        { error, input },
        `${LOG_NAMESPACE}: mutation.onError [updateLineItem]`
      )
    }
  })
}
