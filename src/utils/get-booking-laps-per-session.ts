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
