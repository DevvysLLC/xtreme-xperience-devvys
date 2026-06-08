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

type DecodedMetadataKey = {
  id?: string | number
  type?: string
  scheduleId?: string | number
  rateId?: string | number
}

const isDecodedMetadataKey = (value: unknown): value is DecodedMetadataKey => {
  if (value == null || typeof value !== 'object') {
    return false
  }

  const id = Reflect.get(value, 'id')
  if (id != null) {
    return true
  }

  const type = Reflect.get(value, 'type')
  if (typeof type === 'string') {
    return true
  }

  const scheduleId = Reflect.get(value, 'scheduleId')
  if (scheduleId != null) {
    return true
  }

  const rateId = Reflect.get(value, 'rateId')
  if (rateId != null) {
    return true
  }

  return false
}

const decodeMetadataKey = (
  key: string | undefined
): DecodedMetadataKey | null => {
  if (!key) {
    return null
  }

  try {
    const decoded = atob(key)
    const parsed = JSON.parse(decoded)
    return isDecodedMetadataKey(parsed) ? parsed : null
  } catch {
    return null
  }
}

const toComparable = (value: string | number | null | undefined): string => {
  if (value == null) {
    return ''
  }
  return String(value)
}

export const useCartLineItemMetadata = ({
  lineItem
}: UseCartLineItemMetadataProps): UseCartLineItemMetadataReturn => {
  const { data: cartState, isFetching } = useCartState()

  const key = getCartLineItemReadMetadataKey({ lineItem })
  const metadata =
    cartState.metadata.find((m) => m.key === key) ??
    cartState.metadata.find((m) => {
      const decoded = decodeMetadataKey(m.key)
      if (!decoded) {
        return false
      }

      const sameId =
        toComparable(decoded.id) === toComparable(lineItem.productId)
      const sameType =
        toComparable(decoded.type).toLowerCase() ===
        toComparable(lineItem.type).toLowerCase()

      if (!sameId || !sameType) {
        return false
      }

      if (
        decoded.scheduleId != null &&
        lineItem.scheduleId != null &&
        toComparable(decoded.scheduleId) !== toComparable(lineItem.scheduleId)
      ) {
        return false
      }

      if (
        decoded.rateId != null &&
        lineItem.rateId != null &&
        toComparable(decoded.rateId) !== toComparable(lineItem.rateId)
      ) {
        return false
      }

      return true
    })

  return {
    metadata: metadata ?? null,
    isLoading: isFetching
  }
}
