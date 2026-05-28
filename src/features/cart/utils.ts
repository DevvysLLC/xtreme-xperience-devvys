import { BOOKING_LAPS_PER_SESSION } from '../../config/settings'
import type { CartLineItemMetadata, RocketRezCart } from '../../io/types'
import { getCartLineItemReadMetadataKey } from '../../utils/get-cart-line-item-metadata-key'

export type CartContents = {
  hasInsurance: boolean
  totalInsurance: number
  totalInsuranceQuantity: number
  hasCars: boolean
  totalCars: number
  totalLaps: number
  totalSessions: number
  insuranceSessions: number
  hasAddons: boolean
  totalAddons: number
  totalItems: number
  hasOnlyAddons: boolean
  cartHasValidInsurance: boolean
  canSkipBooking: boolean
  insuranceQuantityMatchesInsuranceSessions: boolean
  hasOnlyRideAlongs: boolean
}

export const computeContents = (
  cartData: RocketRezCart | null,
  metadataList: CartLineItemMetadata[],
  chooseOnDriveDay: boolean | null
): CartContents => {
  const lineItems = cartData?.lineItems ?? []
  let insuranceCount = 0
  let insuranceQuantity = 0
  let carCount = 0
  let addonCount = 0
  let totalLaps = 0
  let totalSessions = 0
  let insuranceSessions = 0
  const chooseOnDriveDayValue = chooseOnDriveDay ?? false

  let rideAlongCarCount = 0
  for (const lineItem of lineItems) {
    const key = getCartLineItemReadMetadataKey({ lineItem })
    const metadata = metadataList.find((m) => m.key === key)
    const normalizedLineItemType = String(lineItem.type ?? '').toLowerCase()
    const inferredType =
      normalizedLineItemType === 'event'
        ? 'car'
        : normalizedLineItemType === 'insurance'
          ? 'insurance'
          : normalizedLineItemType === 'retail'
            ? 'addon'
            : null
    const itemType = metadata?.type ?? inferredType
    if (itemType === 'insurance') {
      insuranceCount += 1
      insuranceQuantity += lineItem.quantity
    } else if (itemType === 'car') {
      carCount += 1
      const sessionsForItem =
        lineItem.quantity *
        (metadata?.isMulticar ? (metadata?.multicarCount ?? 1) : 1)
      totalSessions += sessionsForItem
      if (metadata?.isRideAlong !== true) {
        insuranceSessions += sessionsForItem
      }
      if (metadata?.isMulticar) {
        carCount -= 1
        carCount += metadata?.multicarCount ?? 1
      }
      const lapsPerSession = metadata?.properties?.lapsPerSession
      totalLaps +=
        sessionsForItem *
        (typeof lapsPerSession === 'number'
          ? lapsPerSession
          : BOOKING_LAPS_PER_SESSION)
      if (metadata?.isRideAlong === true) {
        rideAlongCarCount += 1
      }
    } else if (itemType === 'addon') {
      addonCount += lineItem.quantity
    }
  }

  const insuranceQuantityMatchesInsuranceSessions =
    insuranceQuantity === 0 || insuranceQuantity === insuranceSessions

  const hasOnlyRideAlongs = carCount > 0 && rideAlongCarCount === carCount

  const cartHasValidInsurance =
    insuranceQuantityMatchesInsuranceSessions || chooseOnDriveDayValue

  const hasOnlyAddons =
    lineItems.length > 0 &&
    addonCount > 0 &&
    carCount === 0 &&
    insuranceCount === 0

  const canSkipBooking = hasOnlyAddons

  return {
    hasInsurance: insuranceCount > 0,
    totalInsurance: insuranceCount,
    totalInsuranceQuantity: insuranceQuantity,
    hasCars: carCount > 0,
    totalCars: carCount,
    totalLaps,
    totalSessions,
    insuranceSessions,
    hasAddons: addonCount > 0,
    totalAddons: addonCount,
    totalItems: lineItems.length,
    hasOnlyAddons,
    insuranceQuantityMatchesInsuranceSessions,
    cartHasValidInsurance,
    hasOnlyRideAlongs,
    canSkipBooking
  }
}
