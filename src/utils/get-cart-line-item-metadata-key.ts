import type {
  CartLineItemMetadataKey,
  RocketRezAddLineItem,
  RocketRezAddLineItemAddon,
  RocketRezAddLineItemCar,
  RocketRezAddLineItemInsurance,
  RocketRezLineItem
} from '../io/types'

type LineItem =
  | RocketRezAddLineItem
  | RocketRezAddLineItemCar
  | RocketRezAddLineItemAddon
  | RocketRezAddLineItemInsurance

type GetAddToCartLineItemKeyProps = {
  lineItem: LineItem
}

type GetCartLineItemResponseMetadataKeyProps = {
  lineItem: RocketRezLineItem
}

export const getAddToCartLineItemWriteMetadataKey = ({
  lineItem
}: GetAddToCartLineItemKeyProps): CartLineItemMetadataKey => {
  const sortedData: Record<string, unknown> = {}

  // Explicitly handle known keys to avoid type assertions
  const entries: [string, number | string | null | undefined][] = [
    ['id', lineItem.id],
    ['type', lineItem.type],
    ['quantity', lineItem.quantity]
  ]

  // Add optional fields if they exist
  if ('scheduleId' in lineItem) {
    entries.push(['scheduleId', lineItem.scheduleId])
  }
  if ('rateId' in lineItem) {
    entries.push(['rateId', lineItem.rateId])
  }
  if ('rateType' in lineItem) {
    entries.push(['rateType', lineItem.rateType])
  }

  // Sort and filter
  entries.sort(([a], [b]) => a.localeCompare(b))
  entries.forEach(([key, value]) => {
    if (value != null) {
      sortedData[key] = value
    }
  })

  const jsonString = JSON.stringify(sortedData)
  const base64 = Buffer.from(jsonString).toString('base64')

  return base64
}

export const getCartLineItemReadMetadataKey = ({
  lineItem
}: GetCartLineItemResponseMetadataKeyProps): CartLineItemMetadataKey => {
  const sortedData: Record<string, unknown> = {}

  // Explicitly handle known keys to avoid type assertions
  // Map productId -> id to match the input key format
  const entries: [string, number | string | null | undefined][] = [
    ['id', lineItem.productId],
    ['type', lineItem.type],
    ['quantity', lineItem.quantity]
  ]

  if (lineItem.scheduleId != null) {
    entries.push(['scheduleId', lineItem.scheduleId])
  }
  if (lineItem.rateId != null) {
    entries.push(['rateId', lineItem.rateId])
  }
  if (lineItem.rateType != null) {
    entries.push(['rateType', lineItem.rateType])
  }

  entries.sort(([a], [b]) => a.localeCompare(b))
  entries.forEach(([key, value]) => {
    if (value != null) {
      sortedData[key] = value
    }
  })

  const jsonString = JSON.stringify(sortedData)
  const base64 = Buffer.from(jsonString).toString('base64')

  return base64
}
