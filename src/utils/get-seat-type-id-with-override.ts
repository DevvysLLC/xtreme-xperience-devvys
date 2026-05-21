type SeatTypeIdOverride = {
  event?: {
    model?: {
      rocketRezId?: string | null
    } | null
  } | null
  rocketRezSeatTypeId?: string | null
}

type GetSeatTypeIdWithOverrideParams = {
  defaultSeatTypeId: string
  overrides: SeatTypeIdOverride[] | null
  selectedEventId: string | null
}

export const getSeatTypeIdWithOverride = ({
  defaultSeatTypeId,
  overrides,
  selectedEventId
}: GetSeatTypeIdWithOverrideParams): number => {
  const matchingOverride = overrides?.find(
    (override) => override.event?.model?.rocketRezId === selectedEventId
  )

  if (!matchingOverride?.rocketRezSeatTypeId) {
    return Number(defaultSeatTypeId)
  }

  const overriddenSeatTypeId = Number(matchingOverride.rocketRezSeatTypeId)
  return Number.isNaN(overriddenSeatTypeId)
    ? Number(defaultSeatTypeId)
    : overriddenSeatTypeId
}
