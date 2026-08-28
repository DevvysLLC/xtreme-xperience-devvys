'use client'

import clsx from 'clsx'
import { type FC, useMemo } from 'react'
import type {
  CartLineItemMetadata,
  RocketRezLineItem
} from '../../../../io/types'
import { getCartLineItemReadMetadataKey } from '../../../../utils/get-cart-line-item-metadata-key'
import { useCartState } from '../../../../features/cart'
import { CartLineItem } from '../item'
import styles from './style.module.scss'

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

type Props = {
  lineItems: RocketRezLineItem[]
  compact?: boolean
  readOnly?: boolean
  metadata?: CartLineItemMetadata[]
}

export const CartLineItems: FC<Props> = ({
  lineItems,
  compact: _compact = false,
  readOnly: _readOnly = false,
  metadata: propMetadata
}) => {
  const { data: cartState } = useCartState()
  const metadata = useMemo(() => propMetadata ?? cartState?.metadata ?? [], [propMetadata, cartState?.metadata])
  const reversedLineItems = useMemo(() => [...lineItems].reverse(), [lineItems])

  const getMetadataForLineItem = (
    lineItem: RocketRezLineItem
  ): CartLineItemMetadata | null | undefined => {
    const key = getCartLineItemReadMetadataKey({ lineItem })

    return (
      metadata.find((m) => m.key === key) ??
      metadata.find((m) => {
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
      }) ??
      null
    )
  }

  const visibleLineItems = useMemo(() => {
    return reversedLineItems.filter((lineItem) => {
      const itemMetadata = getMetadataForLineItem(lineItem)
      if (itemMetadata?.isMulticar && lineItem.price === 0) {
        return false
      }
      return true
    })
  }, [reversedLineItems, metadata])

  return (
    <div
      className={clsx(
        styles.CartLineItems,
        _compact && styles['CartLineItems--compact']
      )}
    >
      {visibleLineItems.map((lineItem) => (
        <CartLineItem
          key={lineItem.id}
          lineItem={lineItem}
          compact={_compact}
          readOnly={_readOnly}
          metadata={getMetadataForLineItem(lineItem)}
        />
      ))}
    </div>
  )
}
