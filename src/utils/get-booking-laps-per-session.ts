import { BOOKING_LAPS_PER_SESSION } from '../config/settings'
import type { BookingConfigFragment } from '../core/dato/fragments/booking-config.typegen'

type GetBookingLapsPerSessionParams = {
  configData: BookingConfigFragment | null | undefined
  selectedEventId: string | null | undefined
}

export const getBookingLapsPerSession = ({
  configData,
  selectedEventId
}: GetBookingLapsPerSessionParams): number => {
  const overrideLapsPerSession =
    configData?.eventOverrides.find(
      (override) => override.event?.id === selectedEventId
    )?.lapsPerSession ?? null

  return typeof overrideLapsPerSession === 'number' &&
    overrideLapsPerSession > 0
    ? overrideLapsPerSession
    : BOOKING_LAPS_PER_SESSION
}

type GetBookingLapQuantityDiscountParams = {
  quantity: number
  configData: BookingConfigFragment | null | undefined
  selectedEventId: string | null | undefined
  isMulticar?: boolean | null
  isRideAlong?: boolean | null
  hideLapSelection?: boolean | null
}

const DOLLAR_AMOUNT_REGEX = /\$\s*(\d+(?:\.\d+)?)/

export const getBookingLapQuantityDiscount = ({
  quantity,
  configData,
  selectedEventId,
  isMulticar,
  isRideAlong,
  hideLapSelection
}: GetBookingLapQuantityDiscountParams): number => {
  if (quantity <= 1 || isMulticar || isRideAlong || hideLapSelection) {
    return 0
  }

  const eventOverride = configData?.eventOverrides.find(
    (override) => override.event?.id === selectedEventId
  )

  const label =
    quantity === 2
      ? eventOverride?.quantityLabelSixLaps || configData?.quantityLabelSixLaps
      : quantity === 3
        ? eventOverride?.quantityLabelNineLaps ||
          configData?.quantityLabelNineLaps
        : null

  if (typeof label === 'string') {
    const match = DOLLAR_AMOUNT_REGEX.exec(label)
    if (match?.[1]) {
      const parsed = Number(match[1])
      if (Number.isFinite(parsed) && parsed >= 0) {
        return parsed
      }
    }
  }

  if (quantity === 2) {
    return 50
  }
  if (quantity === 3) {
    return 100
  }
  return 0
}
