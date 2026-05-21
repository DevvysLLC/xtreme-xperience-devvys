import type {
  CartLineItemMetadata,
  RocketRezCart,
  RocketRezLineItem
} from '../../io/types'
import { getCartLineItemReadMetadataKey } from '../../utils/get-cart-line-item-metadata-key'

/** Map common currency display names to ISO 4217 codes */
const CURRENCY_NAME_TO_ISO: Record<string, string> = {
  'us dollars': 'USD',
  'us dollar': 'USD',
  'canadian dollars': 'CAD',
  'canadian dollar': 'CAD',
  euros: 'EUR',
  euro: 'EUR',
  'british pounds': 'GBP',
  'british pound': 'GBP',
  pounds: 'GBP',
  pound: 'GBP'
} as const

type ParsedMetadataKey = {
  id?: number | string
  type?: string
  scheduleId?: number | string
  rateId?: number | string
  rateType?: string
}

const isParsedMetadataKey = (value: unknown): value is ParsedMetadataKey => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return true
}

const decodeMetadataKey = (key?: string): ParsedMetadataKey | null => {
  if (!key) {
    return null
  }

  try {
    const decoded = Buffer.from(key, 'base64').toString('utf8')
    const parsed = JSON.parse(decoded)

    if (!isParsedMetadataKey(parsed)) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

const matchesMetadataKey = (
  lineItem: RocketRezLineItem,
  key: ParsedMetadataKey
): boolean => {
  const toComparableOptionalId = (
    value: number | string | null | undefined
  ) => {
    return value == null ? null : String(value)
  }

  return (
    String(key.id) === String(lineItem.productId) &&
    key.type === lineItem.type &&
    toComparableOptionalId(key.scheduleId) ===
      toComparableOptionalId(lineItem.scheduleId) &&
    toComparableOptionalId(key.rateId) ===
      toComparableOptionalId(lineItem.rateId) &&
    (key.rateType ?? null) === (lineItem.rateType ?? null)
  )
}

/**
 * Normalise a currency value to an ISO 4217 code.
 * RocketRez returns display names like "US Dollars" rather than "USD".
 */
export const normaliseCurrency = (currency: string): string => {
  if (/^[A-Z]{3}$/.test(currency)) {
    return currency
  }

  return CURRENCY_NAME_TO_ISO[currency.toLowerCase()] ?? 'USD'
}

export const findCartLineItemMetadata = (
  lineItem: RocketRezLineItem,
  metadata: CartLineItemMetadata[]
): CartLineItemMetadata | undefined => {
  const directMatch = metadata.find(
    (item) => item.key === getCartLineItemReadMetadataKey({ lineItem })
  )

  if (directMatch) {
    return directMatch
  }

  return metadata.find((item) => {
    const parsedKey = decodeMetadataKey(item.key)

    return parsedKey ? matchesMetadataKey(lineItem, parsedKey) : false
  })
}

export const createQuantityAdjustedLineItem = (
  lineItem: RocketRezLineItem,
  quantity: number
): RocketRezLineItem => {
  const originalQuantity = lineItem.quantity || 1
  const ratio = quantity / originalQuantity

  return {
    ...lineItem,
    quantity,
    subTotal: lineItem.subTotal * ratio,
    discountAmount:
      lineItem.discountAmount != null
        ? lineItem.discountAmount * ratio
        : undefined,
    taxTotal: lineItem.taxTotal != null ? lineItem.taxTotal * ratio : undefined,
    houseServiceChargeTotal:
      lineItem.houseServiceChargeTotal != null
        ? lineItem.houseServiceChargeTotal * ratio
        : undefined
  }
}

export const getLineItemsValue = (lineItems: RocketRezLineItem[]): number => {
  return lineItems.reduce((sum, lineItem) => sum + lineItem.subTotal, 0)
}

const trackedCartSnapshots = new Map<string, RocketRezCart>()

export const getTrackedCartSnapshot = (
  cartId: string
): RocketRezCart | undefined => {
  return trackedCartSnapshots.get(cartId)
}

export const rememberTrackedCartSnapshot = (cart: RocketRezCart): void => {
  trackedCartSnapshots.set(cart.id, cart)
}

export const clearTrackedCartSnapshots = (): void => {
  trackedCartSnapshots.clear()
}

export const getAddedLineItemsDelta = (
  previousCart: RocketRezCart | undefined,
  cart: RocketRezCart
): RocketRezLineItem[] => {
  if (!previousCart) {
    return cart.lineItems
  }

  return cart.lineItems.flatMap((lineItem) => {
    const previousLineItem = previousCart.lineItems.find(
      (item) => item.id === lineItem.id
    )
    const quantityDelta =
      (lineItem.quantity ?? 0) - (previousLineItem?.quantity ?? 0)

    if (quantityDelta <= 0) {
      return []
    }

    return [createQuantityAdjustedLineItem(lineItem, quantityDelta)]
  })
}

export const getRemovedLineItemDelta = (
  cart: RocketRezCart,
  removedItem: RocketRezLineItem
): RocketRezLineItem | undefined => {
  const currentLineItem = cart.lineItems.find(
    (item) => item.id === removedItem.id
  )
  const removedQuantity =
    (removedItem.quantity ?? 0) - (currentLineItem?.quantity ?? 0)

  if (removedQuantity <= 0) {
    return undefined
  }

  return createQuantityAdjustedLineItem(removedItem, removedQuantity)
}
