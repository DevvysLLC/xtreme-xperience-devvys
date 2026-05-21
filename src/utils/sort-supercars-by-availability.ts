import type { BookingSupercarFragment } from '../core/dato/fragments/booking-config.typegen'
import { RocketRezScheduleStatus } from '../io/schemas'
import type { RocketRezEventScheduleItem } from '../io/types'
import { getRateTypePrice } from './get-rate-type-price'
import { isScheduleSoldOut } from './is-schedule-sold-out'

const getLowestSchedulePriceForRateId = (
  schedules: RocketRezEventScheduleItem[],
  rateId: number
): number | null => {
  const prices = schedules
    .filter(
      (schedule) =>
        schedule.scheduleStatus === RocketRezScheduleStatus.AVAILABLE
    )
    .flatMap((schedule) =>
      (schedule.seatTypes ?? []).flatMap((seatType) => {
        if ((seatType?.available ?? 0) <= 0) {
          return []
        }

        return (seatType?.rates ?? [])
          .filter((rate) => rate.id === rateId)
          .flatMap((rate) =>
            (rate.rateTypes ?? [])
              .map((rateType) => getRateTypePrice(rateType)?.price ?? null)
              .filter((price): price is number => price != null)
          )
      })
    )

  if (prices.length === 0) {
    return null
  }

  return Math.min(...prices)
}

/**
 * Sorts supercars so that available ones appear first and sold-out ones appear last.
 * Maintains the original order within each group (available vs sold-out).
 */
export const sortSupercarsByAvailability = (
  supercars: BookingSupercarFragment[],
  schedules: RocketRezEventScheduleItem[],
  getSeatTypeId: (supercar: BookingSupercarFragment) => number = (supercar) =>
    Number(supercar.rocketRezSeatTypeId)
): BookingSupercarFragment[] => {
  return [...supercars].sort((a, b) => {
    const aSoldOut = isScheduleSoldOut(schedules, getSeatTypeId(a))
    const bSoldOut = isScheduleSoldOut(schedules, getSeatTypeId(b))

    if (aSoldOut === bSoldOut) {
      return 0
    }

    return aSoldOut ? 1 : -1
  })
}

/**
 * Sorts supercars by:
 * 1) availability (available first)
 * 2) lowest price (ascending) within the same availability group.
 */
export const sortSupercarsByAvailabilityAndPrice = (
  supercars: BookingSupercarFragment[],
  schedules: RocketRezEventScheduleItem[],
  getSeatTypeId: (supercar: BookingSupercarFragment) => number = (supercar) =>
    Number(supercar.rocketRezSeatTypeId)
): BookingSupercarFragment[] => {
  return [...supercars]
    .map((supercar, index) => {
      const seatTypeId = getSeatTypeId(supercar)
      const soldOut = isScheduleSoldOut(schedules, seatTypeId)
      const lowestSchedulePrice = getLowestSchedulePriceForRateId(
        schedules,
        seatTypeId
      )
      const fallbackPrice =
        supercar.priceOverride?.price ??
        supercar.supercar.model?.displayPrice?.price ??
        Number.POSITIVE_INFINITY
      const sortPrice = lowestSchedulePrice ?? fallbackPrice

      return { supercar, soldOut, sortPrice, index }
    })
    .sort((a, b) => {
      if (a.soldOut !== b.soldOut) {
        return a.soldOut ? 1 : -1
      }

      if (a.sortPrice !== b.sortPrice) {
        return a.sortPrice - b.sortPrice
      }

      return a.index - b.index
    })
    .map(({ supercar }) => supercar)
}
