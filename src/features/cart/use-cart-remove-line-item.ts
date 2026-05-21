'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import { useAnalyticsEcommerceEvent } from '../../features/analytics'
import type { ApiCartResponse } from '../../io'
import type {
  CartState,
  RocketRezCart,
  RocketRezLineItem
} from '../../io/types'
import { getCartLineItemReadMetadataKey } from '../../utils/get-cart-line-item-metadata-key'
import { getMetadataKeyToRemove } from '../../utils/remove-cart-line-item-metadata'
import { LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY } from './keys'
import { cartRepository, initialCartState } from './repository'
import { useCartMutation } from './use-cart-mutation'
import { computeContents } from './utils'

export type UseCartRemoveLineItemInput = {
  lineItem: RocketRezLineItem
}

const removeInsuranceIfNeeded = async (
  cart: RocketRezCart,
  metadataList: CartState['metadata'],
  chooseOnDriveDay: boolean,
  removeLineItemMutation: (
    input: UseCartRemoveLineItemInput
  ) => Promise<ApiCartResponse>
): Promise<void> => {
  const contents = computeContents(cart, metadataList, chooseOnDriveDay)

  const shouldRemoveNoCars = !contents.hasCars && contents.hasInsurance
  const shouldRemoveQuantityMismatch =
    contents.hasCars &&
    contents.hasInsurance &&
    !contents.insuranceQuantityMatchesInsuranceSessions

  const shouldRemoveInsurance =
    shouldRemoveNoCars || shouldRemoveQuantityMismatch

  if (!shouldRemoveInsurance) {
    return
  }

  const remainingLineItems = cart.lineItems ?? []
  const insuranceLineItems = remainingLineItems.filter(
    (lineItem: RocketRezLineItem) => {
      const key = getCartLineItemReadMetadataKey({ lineItem })
      const metadata = metadataList.find((m) => m.key === key)
      return metadata?.type === 'insurance'
    }
  )

  if (insuranceLineItems.length === 0) {
    return
  }

  const reason = shouldRemoveNoCars ? 'no cars in cart' : 'quantity mismatch'
  logger.info(
    {
      insuranceLineItemsCount: insuranceLineItems.length,
      reason,
      hasCars: contents.hasCars,
      hasInsurance: contents.hasInsurance,
      insuranceQuantityMatchesInsuranceSessions:
        contents.insuranceQuantityMatchesInsuranceSessions
    },
    `${LOG_NAMESPACE}: removeInsuranceIfNeeded — removing insurance items`
  )

  for (const lineItem of insuranceLineItems) {
    try {
      await removeLineItemMutation({ lineItem })
      logger.debug(
        { lineItemId: lineItem.id },
        `${LOG_NAMESPACE}: removeInsuranceIfNeeded — removed insurance line item`
      )
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('operation already in progress')
      ) {
        logger.debug(
          { lineItem },
          `${LOG_NAMESPACE}: removeInsuranceIfNeeded — insurance item already being removed`
        )
        continue
      }
      logger.error(
        { error, lineItem },
        `${LOG_NAMESPACE}: removeInsuranceIfNeeded — failed to remove insurance line item`
      )
    }
  }

  logger.info(
    {
      removedCount: insuranceLineItems.length,
      reason,
      finalCartItems: cart.lineItems?.length ?? 0
    },
    `${LOG_NAMESPACE}: removeInsuranceIfNeeded — complete`
  )
}

export const useCartRemoveLineItem = (): UseMutationResult<
  ApiCartResponse,
  Error,
  UseCartRemoveLineItemInput
> => {
  const qc = useQueryClient()
  const analytics = useAnalyticsEcommerceEvent()

  type MutationFunction = (
    input: UseCartRemoveLineItemInput
  ) => Promise<ApiCartResponse>
  const mutationRef: { mutateAsync: MutationFunction | null } = {
    mutateAsync: null
  }

  const mutation = useCartMutation<UseCartRemoveLineItemInput>({
    endpoint: (input) =>
      `${ROUTES.API.CART.REMOVE}?lineItemId=${input.lineItem.id}`,
    method: 'DELETE',
    requireCartKey: true,
    onSuccessExtra: async (data, input) => {
      logger.info(
        { data, input },
        `${LOG_NAMESPACE}: mutation.onSuccess [removeLineItem]`
      )

      const current =
        qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
      const metadataKeyToRemove = getMetadataKeyToRemove(
        data.cart,
        input.lineItem
      )

      if (metadataKeyToRemove) {
        const next = {
          ...current,
          metadata: current.metadata.filter(
            (m) => m.key !== metadataKeyToRemove
          )
        }
        qc.setQueryData<CartState>(CART_QUERY_KEY, next)
        cartRepository.write(next)
      }

      analytics.trackRemoveFromCart(data.cart, input.lineItem, current.metadata)

      if (mutationRef.mutateAsync) {
        const state =
          qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
        await removeInsuranceIfNeeded(
          data.cart,
          state.metadata,
          state.chooseOnDriveDay,
          mutationRef.mutateAsync
        )
      }

      logger.info(
        { data, input },
        `${LOG_NAMESPACE}: mutation.onSuccess [removeLineItem] — complete`
      )
    },
    onError: (error, input) => {
      logger.error(
        { error, input },
        `${LOG_NAMESPACE}: mutation.onError [removeLineItem]`
      )
    }
  })

  mutationRef.mutateAsync = mutation.mutateAsync

  return mutation
}
