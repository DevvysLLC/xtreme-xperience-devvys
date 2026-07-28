import type { BookingSupercarFragment } from '../core/dato/fragments/booking-config.typegen'
import { RocketRezScheduleStatus } from '../io/schemas'
import type { RocketRezEventScheduleItem } from '../io/types'
import { getRequiredRateIdsForSupercar } from '../features/booking/use-booking-supercar-schedule'
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
 * Checks if a supercar or package is assigned to the event (i.e. is present in at least one schedule of the event).
 */
export const isSupercarAssignedToEvent = (
  allEventSchedules: RocketRezEventScheduleItem[],
  rateId: number,
  isMulticar: boolean
): boolean => {
  if (!allEventSchedules || allEventSchedules.length === 0) {
    return false
  }

  const firstScheduleWithRate = allEventSchedules.find((schedule) =>
    (schedule.seatTypes ?? []).some((seatType) =>
      (seatType?.rates ?? []).some((rate) => rate.id === rateId)
    )
  )

  if (!firstScheduleWithRate) {
    return false
  }

  if (!isMulticar) {
    return true
  }

  const requiredRateIds = getRequiredRateIdsForSupercar(
    firstScheduleWithRate,
    rateId,
    true
  )

  return requiredRateIds.every((reqRateId) =>
    allEventSchedules.some((schedule) =>
      (schedule.seatTypes ?? []).some((seatType) =>
        (seatType?.rates ?? []).some((rate) => rate.id === reqRateId)
      )
    )
  )
}

/**
 * Filters supercars/packages to only include those built/assigned to the event.
 */
export const filterSupercarsByEventAssignment = (
  supercars: BookingSupercarFragment[],
  allEventSchedules: RocketRezEventScheduleItem[],
  getSeatTypeId: (supercar: BookingSupercarFragment) => number
): BookingSupercarFragment[] => {
  if (!allEventSchedules || allEventSchedules.length === 0) {
    return supercars
  }

  return supercars.filter((supercar) =>
    isSupercarAssignedToEvent(
      allEventSchedules,
      getSeatTypeId(supercar),
      supercar.isMulticar
    )
  )
}

/**
 * Filters out supercars that have 0 availability for the specified event schedules,
 * ensuring event-specific fleet filtering so unavailable cars are hidden when available options exist.
 */
export const filterSupercarsByAvailability = (
  supercars: BookingSupercarFragment[],
  schedules: RocketRezEventScheduleItem[],
  getSeatTypeId: (supercar: BookingSupercarFragment) => number = (supercar) =>
    Number(supercar.rocketRezSeatTypeId)
): BookingSupercarFragment[] => {
  if (!schedules || schedules.length === 0) {
    return supercars
  }

  const availableSupercars = supercars.filter(
    (supercar) => !isScheduleSoldOut(schedules, getSeatTypeId(supercar))
  )

  return availableSupercars.length > 0 ? availableSupercars : supercars
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
  const getRateIdsToCheck = (supercar: BookingSupercarFragment) => {
    const rateId = getSeatTypeId(supercar)
    if (!supercar.isMulticar || schedules.length === 0) {
      return rateId
    }
    const firstAvailableSchedule = schedules.find(
      (schedule) =>
        schedule.scheduleStatus === RocketRezScheduleStatus.AVAILABLE
    )
    if (!firstAvailableSchedule) {
      return rateId
    }
    return getRequiredRateIdsForSupercar(
      firstAvailableSchedule,
      rateId,
      true
    )
  }

  return [...supercars].sort((a, b) => {
    const aSoldOut = isScheduleSoldOut(schedules, getRateIdsToCheck(a))
    const bSoldOut = isScheduleSoldOut(schedules, getRateIdsToCheck(b))

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
  const getRateIdsToCheck = (supercar: BookingSupercarFragment) => {
    const rateId = getSeatTypeId(supercar)
    if (!supercar.isMulticar || schedules.length === 0) {
      return rateId
    }
    const firstAvailableSchedule = schedules.find(
      (schedule) =>
        schedule.scheduleStatus === RocketRezScheduleStatus.AVAILABLE
    )
    if (!firstAvailableSchedule) {
      return rateId
    }
    return getRequiredRateIdsForSupercar(
      firstAvailableSchedule,
      rateId,
      true
    )
  }

  return [...supercars]
    .map((supercar, index) => {
      const seatTypeId = getSeatTypeId(supercar)
      const rateIdsToCheck = getRateIdsToCheck(supercar)
      const soldOut = isScheduleSoldOut(schedules, rateIdsToCheck)
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
