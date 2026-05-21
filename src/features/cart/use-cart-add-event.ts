'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import type { SupercarBaseFragment } from '../../core/dato/fragments/supercar-base.typegen'
import { logger } from '../../core/logger/logger'
import { useAnalyticsEcommerceEvent } from '../../features/analytics'
import type {
  ApiCartResponse,
  BookingUserSelectionState,
  CartState,
  RocketRezAddLineItem
} from '../../io/types'
import { getAddToCartLineItemCarMetadata } from '../../utils/get-add-to-cart-line-item-car-metadata'
import { LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY } from './keys'
import { cartRepository, initialCartState } from './repository'
import { useCartMutation } from './use-cart-mutation'

export type UseCartAddEventRequest = {
  supercar: SupercarBaseFragment
  lineItem: RocketRezAddLineItem
  userSelectionState: BookingUserSelectionState
}

export const useCartAddEvent = (): UseMutationResult<
  ApiCartResponse,
  Error,
  UseCartAddEventRequest
> => {
  const qc = useQueryClient()
  const analytics = useAnalyticsEcommerceEvent()

  return useCartMutation<UseCartAddEventRequest>({
    endpoint: ROUTES.API.CART.ADD,
    method: 'POST',
    includeBody: true,
    getBody: (input) => ({ lineItems: [input.lineItem] }),
    requireCartKey: false,
    onSuccessExtra: (data, input) => {
      logger.info(
        { data, input },
        `${LOG_NAMESPACE}: mutation.onSuccess [addEvent]`
      )
      if (data.cart.lineItems.length === 0) {
        return
      }
      const metadata = getAddToCartLineItemCarMetadata({
        supercar: input.supercar,
        lineItem: input.lineItem,
        userSelectionState: input.userSelectionState
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
        `${LOG_NAMESPACE}: mutation.onSuccess [addEvent] — metadata set`
      )
    },
    onError: (error, input) => {
      logger.error(
        { error, input },
        `${LOG_NAMESPACE}: mutation.onError [addEvent]`
      )
    }
  })
}
