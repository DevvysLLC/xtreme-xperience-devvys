'use client'

import type { CartLineItemMetadata, RocketRezLineItem } from '../../io/types'
import { getCartLineItemReadMetadataKey } from '../../utils/get-cart-line-item-metadata-key'
import { useCartState } from './use-cart-state'

type UseCartLineItemMetadataProps = {
  lineItem: RocketRezLineItem
}

type UseCartLineItemMetadataReturn = {
  metadata: CartLineItemMetadata | null
  isLoading: boolean
}

export const useCartLineItemMetadata = ({
  lineItem
}: UseCartLineItemMetadataProps): UseCartLineItemMetadataReturn => {
  const { data: cartState, isFetching } = useCartState()

  const key = getCartLineItemReadMetadataKey({ lineItem })
  const metadata = cartState.metadata.find((m) => m.key === key)

  return {
    metadata: metadata ?? null,
    isLoading: isFetching
  }
}
