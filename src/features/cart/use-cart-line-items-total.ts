import { useMemo } from 'react'
import type { RocketRezLineItem } from '../../io/types'

export const useCartLineItemsTotal = (
  lineItems?: RocketRezLineItem[] | null
): number =>
  useMemo(
    () =>
      (lineItems ?? []).reduce(
        (accumulator, lineItem) =>
          accumulator + lineItem.price * lineItem.quantity,
        0
      ),
    [lineItems]
  )
