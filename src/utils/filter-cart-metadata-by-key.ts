import type { CartLineItemMetadata } from '../io/types'

/**
 * Filters out metadata entries with the specified key and returns a new array.
 * This is a pure function that creates a new array without mutating the input.
 *
 * @param metadata - The current metadata array
 * @param keyToRemove - The key of the metadata entry to remove
 * @returns A new array with metadata entries that don't match the key
 */
export const filterCartMetadataByKey = (
  metadata: CartLineItemMetadata[],
  keyToRemove: string
): CartLineItemMetadata[] => {
  return metadata.filter((m) => m.key !== keyToRemove)
}
