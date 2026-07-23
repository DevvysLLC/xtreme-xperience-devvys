import { RocketRezScheduleStatus } from '../io/schemas'
import type { RocketRezEventScheduleItem } from '../io/types'

/**
 * Checks if a schedule or schedules are sold out for a specific rate/seat type.
 *
 * A schedule is considered sold out if:
 * - Schedule status is not AVAILABLE, OR
 * - No valid price (> 0) is found for the matching rate (single rate mode only), OR
 * - Seat availability is 0 or null
 *
 * @param schedules - Single schedule item or array of schedule items
 * @param rocketRezSeatTypeId - The rate ID to match against (single) or array of rate IDs (package)
 *   When an array is passed (package mode), price check is skipped since package component rates have $0 price.
 * @returns For single schedule: true if sold out, false if available
 *          For array: true if ALL schedules are sold out (or array is empty), false if at least one is available
 */
export const isScheduleSoldOut = (
  schedules: RocketRezEventScheduleItem | RocketRezEventScheduleItem[],
  rocketRezSeatTypeId: number | number[]
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

  const isPackageMode = Array.isArray(rocketRezSeatTypeId)
  const rateIds = isPackageMode ? rocketRezSeatTypeId : [rocketRezSeatTypeId]

  if (rateIds.length === 0) {
    return true
  }

  // Validate that ALL required rate IDs are present in this schedule
  for (const rateId of rateIds) {
    let rateFoundAndAvailable = false

    for (const seatType of schedule.seatTypes ?? []) {
      if (!seatType) {
        continue
      }
      for (const rate of seatType.rates ?? []) {
        if (rate.id === rateId) {
          if (!isPackageMode) {
            // Single rate mode: also check price > 0
            const rateType = rate.rateTypes?.[0]
            // Check price: overridePrice > dynamicPrice > defaultPrice > price, default to 0 if all are null/undefined
            const ratePrice =
              rateType?.overridePrice ??
              rateType?.dynamicPrice ??
              rateType?.defaultPrice ??
              rateType?.price ??
              0

            // Must have valid price > 0
            if (ratePrice <= 0) {
              continue
            }
          }

          // Must have seat availability > 0 (only for physical seat types where capacity > 0)
          const seatTypeCapacity = seatType.capacity ?? 0
          const seatTypeAvailable = seatType.available ?? 0
          if (seatTypeCapacity > 0 && seatTypeAvailable <= 0) {
            continue
          }

          // Found a valid available rate/seat type for this rateId
          rateFoundAndAvailable = true
          break
        }
      }
      if (rateFoundAndAvailable) {
        break
      }
    }

    // If any of the required rates in the package is missing/sold out, the schedule is sold out
    if (!rateFoundAndAvailable) {
      return true
    }
  }

  return false
}
