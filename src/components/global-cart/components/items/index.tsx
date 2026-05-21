'use client'

import clsx from 'clsx'
import { type FC, useMemo } from 'react'
import type {
  CartLineItemMetadata,
  RocketRezLineItem
} from '../../../../io/types'
import { getCartLineItemReadMetadataKey } from '../../../../utils/get-cart-line-item-metadata-key'
import { CartLineItem } from '../item'
import styles from './style.module.scss'

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
  metadata
}) => {
  const reversedLineItems = useMemo(() => [...lineItems].reverse(), [lineItems])

  const getMetadataForLineItem = (
    lineItem: RocketRezLineItem
  ): CartLineItemMetadata | null | undefined => {
    if (metadata === undefined) {
      return undefined
    }
    const key = getCartLineItemReadMetadataKey({ lineItem })
    return metadata.find((m) => m.key === key) ?? null
  }

  return (
    <div
      className={clsx(
        styles.CartLineItems,
        _compact && styles['CartLineItems--compact']
      )}
    >
      {reversedLineItems.map((lineItem) => (
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
