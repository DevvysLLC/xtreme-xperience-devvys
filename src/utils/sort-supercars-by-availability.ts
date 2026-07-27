import type { BookingSupercarFragment } from '../core/dato/fragments/booking-config.typegen'
import { RocketRezScheduleStatus } from '../io/schemas'
import type { RocketRezEventScheduleDate, RocketRezEventScheduleItem } from '../io/types'
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
 * Checks whether a rate ID appears anywhere in the event schedules,
 * regardless of availability. Used to determine if a car is actually
 * assigned to this event in RocketRez.
 *
 * @param allEventSchedules - All day-level schedule groups for the entire event
 * @param rateId - The rate ID to look for
 * @returns true if the rate appears in any seatType across all days and time slots
 */
export const isRateInEventSchedules = (
  allEventSchedules: RocketRezEventScheduleDate[],
  rateId: number
): boolean => {
  for (const dayGroup of allEventSchedules) {
    for (const schedule of dayGroup.schedules ?? []) {
      for (const seatType of schedule.seatTypes ?? []) {
        if (!seatType) continue
        const hasRate = (seatType.rates ?? []).some((rate) => rate.id === rateId)
        if (hasRate) return true
      }
    }
  }
  return false
}

/**
 * Filters out supercars that are not assigned to the given event at all.
 * A car is considered "not in event" if its rate ID never appears in any
 * seatType across any time slot across any day of the event.
 * Sold-out cars (rate exists but no availability) are kept — they appear
 * at the bottom via sortSupercarsByAvailability.
 *
 * @param supercars - Full list of supercars from global DatoCMS config
 * @param allEventSchedules - All day-level schedule groups for the entire event
 * @param getSeatTypeId - Resolves the effective rate ID for a supercar (with overrides)
 */
export const filterSupercarsByAvailability = (
  supercars: BookingSupercarFragment[],
  allEventSchedules: RocketRezEventScheduleDate[],
  getSeatTypeId: (supercar: BookingSupercarFragment) => number = (supercar) =>
    Number(supercar.rocketRezSeatTypeId)
): BookingSupercarFragment[] => {
  // If no event schedule data yet, show all cars (loading state)
  if (!allEventSchedules || allEventSchedules.length === 0) {
    return supercars
  }

  return supercars.filter((supercar) => {
    const rateId = getSeatTypeId(supercar)
    return isRateInEventSchedules(allEventSchedules, rateId)
  })
}

/**
 * Sorts supercars so that available ones appear first and sold-out ones appear last.
 * Maintains the original order within each group (available vs sold-out).
 *
 * @param supercars - List of supercars (already filtered to those in this event)
 * @param selectedDaySchedules - Time-slot schedules for the currently selected day
 * @param getSeatTypeId - Resolves the effective rate ID for a supercar (with overrides)
 */
export const sortSupercarsByAvailability = (
  supercars: BookingSupercarFragment[],
  selectedDaySchedules: RocketRezEventScheduleItem[],
  getSeatTypeId: (supercar: BookingSupercarFragment) => number = (supercar) =>
    Number(supercar.rocketRezSeatTypeId)
): BookingSupercarFragment[] => {
  return [...supercars].sort((a, b) => {
    const aSoldOut = isScheduleSoldOut(selectedDaySchedules, getSeatTypeId(a))
    const bSoldOut = isScheduleSoldOut(selectedDaySchedules, getSeatTypeId(b))

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
