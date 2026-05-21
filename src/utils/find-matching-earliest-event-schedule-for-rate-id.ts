import { logger } from '../core/logger/logger'
import { RocketRezScheduleStatus } from '../io/schemas'
import type {
  CartLineItemMetadata,
  RocketRezEventScheduleDate,
  RocketRezEventScheduleItem
} from '../io/types'
import { findEventScheduleForRateId } from './find-event-schedules-for-rate-id'

export const getEarliestCarStartTimeFromMetadata = (
  metadata: CartLineItemMetadata[]
): string | null => {
  const carTimes = metadata
    .filter((m) => m.type === 'car' && m.isRideAlong !== true)
    .map((m) => m.properties?.date)
    .filter((d): d is string => typeof d === 'string' && d.includes('T'))
    .map((d) => d.split('T')[1])
    .filter((t): t is string => typeof t === 'string' && /^\d{2}:\d{2}/.test(t))
  if (carTimes.length === 0) {
    logger.info(
      { metadataCount: metadata.length },
      'getEarliestCarStartTimeFromMetadata: no car times'
    )
    return null
  }
  const earliest = carTimes.sort()[0]
  logger.info(
    { carTimes, earliest },
    'getEarliestCarStartTimeFromMetadata: result'
  )
  return earliest ?? null
}

export const findMatchingEarliestEventScheduleForRateId = (
  schedules: RocketRezEventScheduleDate[] | null | undefined,
  rateId: number,
  cartMetadata: CartLineItemMetadata[]
): RocketRezEventScheduleItem | null => {
  const preferredStartTime = getEarliestCarStartTimeFromMetadata(cartMetadata)
  if (!preferredStartTime) {
    logger.info(
      { rateId },
      'findMatchingEarliestEventScheduleForRateId: no preferred time, using default'
    )
    return findEventScheduleForRateId(schedules, rateId)
  }
  if (!schedules || schedules.length === 0) {
    logger.info(
      { rateId, preferredStartTime },
      'findMatchingEarliestEventScheduleForRateId: no schedules'
    )
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
      if (schedule.startTime !== preferredStartTime) {
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
            { rateId, preferredStartTime, result },
            'findMatchingEarliestEventScheduleForRateId: found match for preferred time'
          )
          return result
        }
      }
    }
  }
  logger.info(
    { rateId, preferredStartTime },
    'findMatchingEarliestEventScheduleForRateId: no match for preferred time, falling back'
  )
  return findEventScheduleForRateId(schedules, rateId)
}
