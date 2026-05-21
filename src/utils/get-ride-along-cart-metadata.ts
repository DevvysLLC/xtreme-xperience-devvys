import type { BookingConfigFragment } from '../core/dato/fragments/booking-config.typegen'
import { logger } from '../core/logger/logger'
import type { CartLineItemMetadata, RocketRezAddLineItem } from '../io/types'
import { findBookingSupercarBySeatTypeId } from './find-booking-supercar-by-seat-type-id'
import { getBookingLapsPerSession } from './get-booking-laps-per-session'
import { getAddToCartLineItemWriteMetadataKey } from './get-cart-line-item-metadata-key'

/**
 * Builds cart line item metadata for a ride-along from booking config.
 * Looks up the matching supercar in config (via rocketRezSeatTypeId). For ride-alongs the config
 * typically stores the rate ID in rocketRezSeatTypeId, so pass lineItem.rateId as configLookupId.
 */
export const getRideAlongCartMetadata = (
  bookingConfig: BookingConfigFragment | null | undefined,
  selectedEventId: string | null,
  configLookupId: number,
  lineItem: RocketRezAddLineItem,
  date: string
): CartLineItemMetadata => {
  const findResult = findBookingSupercarBySeatTypeId(
    bookingConfig,
    configLookupId
  )
  const bookingSupercar = findResult?.bookingSupercar ?? null
  const supercar = bookingSupercar?.supercar

  // Fallback: ride-along seat types may not exist in config.supercars; use config.rideAlong addon matched by rateId
  const rideAlongAddon =
    !findResult && bookingConfig?.rideAlong?.length
      ? (bookingConfig.rideAlong.find(
          (option) =>
            option.model?.rocketRezId != null &&
            Number(option.model.rocketRezId) === lineItem.rateId
        ) ?? null)
      : null

  logger.info(
    {
      configLookupId,
      rateId: lineItem.rateId,
      findResult,
      bookingSupercar,
      supercar,
      rideAlongAddon: rideAlongAddon
        ? { id: rideAlongAddon.id, title: rideAlongAddon.model?.title }
        : null
    },
    'getRideAlongCartMetadata: supercar lookup'
  )

  const title = bookingSupercar?.titleOverride
    ? bookingSupercar.titleOverride
    : supercar?.model?.make && supercar?.model?.model
      ? `${supercar.model.make} <strong>${supercar.model.model}</strong>`
      : (supercar?.model?.title ?? null ?? rideAlongAddon?.model?.title ?? null)
  const image =
    bookingSupercar?.thumbnailOverride?.image?.url ??
    supercar?.model?.thumbnail?.image?.url ??
    rideAlongAddon?.model?.thumbnail?.image?.url ??
    null
  const subtitle = findResult?.groupTitle ?? null
  const label = bookingSupercar?.cartLineItemLabel ?? null
  const isMulticar = bookingSupercar?.isMulticar ?? null
  const multicarCount = bookingSupercar?.multicarCount ?? null
  const lapsPerSession = getBookingLapsPerSession({
    configData: bookingConfig,
    selectedEventId
  })

  const key = getAddToCartLineItemWriteMetadataKey({ lineItem })
  const metadata: CartLineItemMetadata = {
    key,
    type: 'car' as const,
    title: title ?? 'Ride Along',
    image: image ?? '',
    subtitle: subtitle ?? 'Ride Along',
    label,
    isMulticar,
    isRideAlong: true,
    multicarCount,
    properties: {
      date,
      lapsPerSession,
      laps: lapsPerSession
    }
  }

  logger.info({ key, metadata }, 'getRideAlongCartMetadata: metadata built')

  return metadata
}
