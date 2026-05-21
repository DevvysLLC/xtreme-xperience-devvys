import { logger } from '../core/logger/logger'
import { RocketRezScheduleStatus } from '../io/schemas'
import type {
  RocketRezEventScheduleDate,
  RocketRezEventScheduleItem
} from '../io/types'

export const findEventScheduleForRateId = (
  schedules: RocketRezEventScheduleDate[] | null | undefined,
  rateId: number
): RocketRezEventScheduleItem | null => {
  if (!schedules || schedules.length === 0) {
    logger.info({ rateId }, 'findEventScheduleForRateId: no schedules provided')
    return null
  }

  for (const scheduleDate of schedules) {
    for (const schedule of scheduleDate.schedules) {
      if (schedule.scheduleStatus !== RocketRezScheduleStatus.AVAILABLE) {
        continue
      }
      if (!schedule.id) {
        continue
      }

      for (const seatType of schedule.seatTypes ?? []) {
        if (!seatType) {
          continue
        }

        if ((seatType.available ?? 0) <= 0) {
          continue
        }

        for (const rate of seatType.rates ?? []) {
          if (rate.id !== rateId) {
            continue
          }

          const rateType = rate.rateTypes?.[0]
          if (!rateType) {
            continue
          }

          const effectivePrice =
            rateType.overridePrice ??
            rateType.dynamicPrice ??
            rateType.defaultPrice ??
            0
          if (effectivePrice <= 0) {
            continue
          }

          const result: RocketRezEventScheduleItem = {
            ...schedule,
            seatTypes: [{ ...seatType, rates: [rate] }]
          }

          logger.info(
            { rateId, result },
            'findEventScheduleForRateId: found match'
          )

          return result
        }
      }
    }
  }

  logger.info({ rateId }, 'findEventScheduleForRateId: no match found')
  return null
}
