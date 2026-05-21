import type { RocketRezCart, RocketRezLineItem } from '../io/types'
import { getCartLineItemReadMetadataKey } from './get-cart-line-item-metadata-key'

/**
 * Determines if metadata should be removed when a line item is removed from the cart.
 * Metadata is only removed if there are no line items with the same metadata key remaining.
 * Since metadata can apply to multiple items, we keep it as long as at least one matching item exists.
 *
 * @param updatedCart - The cart data after the line item has been removed
 * @param removedLineItem - The line item that was removed
 * @returns The metadata key to remove, or null if metadata should be kept
 */
export const getMetadataKeyToRemove = (
  updatedCart: RocketRezCart,
  removedLineItem: RocketRezLineItem
): string | null => {
  // Get the metadata key for the removed line item
  const removedKey = getCartLineItemReadMetadataKey({
    lineItem: removedLineItem
  })

  // Count how many line items in the updated cart have the same metadata key
  const remainingLineItems = updatedCart.lineItems ?? []
  const matchingKeyCount = remainingLineItems.filter((item) => {
    const itemKey = getCartLineItemReadMetadataKey({ lineItem: item })
    return itemKey === removedKey
  }).length

  // Only remove metadata if there are no matching items remaining
  // If there are any matching items, keep metadata (other items still need it)
  if (matchingKeyCount === 0) {
    return removedKey
  }

  return null
}
