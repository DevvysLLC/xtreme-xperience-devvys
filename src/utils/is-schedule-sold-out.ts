import { RocketRezScheduleStatus } from '../io/schemas'
import type { RocketRezEventScheduleItem } from '../io/types'

/**
 * Checks if a schedule or schedules are sold out for a specific rate/seat type.
 *
 * A schedule is considered sold out if:
 * - Schedule status is not AVAILABLE, OR
 * - No valid price (> 0) is found for the matching rate, OR
 * - Seat availability is 0 or null
 *
 * @param schedules - Single schedule item or array of schedule items
 * @param rocketRezSeatTypeId - The rate ID to match against (note: despite the name, this is actually a rate ID)
 * @returns For single schedule: true if sold out, false if available
 *          For array: true if ALL schedules are sold out (or array is empty), false if at least one is available
 */
export const isScheduleSoldOut = (
  schedules: RocketRezEventScheduleItem | RocketRezEventScheduleItem[],
  rocketRezSeatTypeId: number
): boolean => {
  // Handle array case
  if (Array.isArray(schedules)) {
    if (schedules.length === 0) {
      return true
    }

    // Check if at least one schedule is available
    const hasAvailableSchedule = schedules.some(
      (schedule) => !isScheduleSoldOut(schedule, rocketRezSeatTypeId)
    )

    return !hasAvailableSchedule
  }

  // Handle single schedule case
  const schedule = schedules

  // Must be available
  if (schedule.scheduleStatus !== RocketRezScheduleStatus.AVAILABLE) {
    return true
  }

  // Find matching rate for this supercar's seatTypeId (which is actually a rate ID)
  for (const seatType of schedule.seatTypes ?? []) {
    if (!seatType) {
      continue
    }
    for (const rate of seatType.rates ?? []) {
      if (rate.id === rocketRezSeatTypeId) {
        const rateType = rate.rateTypes?.[0]
        // Check price: overridePrice > dynamicPrice > defaultPrice > price, default to 0 if all are null/undefined
        const ratePrice =
          rateType?.overridePrice ??
          rateType?.dynamicPrice ??
          rateType?.defaultPrice ??
          rateType?.price ??
          0

        // Must have valid price > 0
        // Handles: null/undefined prices, price = 0, or rateType missing entirely
        if (ratePrice <= 0) {
          return true
        }

        // Must have seat availability > 0
        const seatTypeAvailable = seatType.available ?? 0
        if (seatTypeAvailable <= 0) {
          return true
        }

        // Found a valid available schedule with price and availability
        return false
      }
    }
  }

  // No matching rate found - consider sold out
  return true
}
