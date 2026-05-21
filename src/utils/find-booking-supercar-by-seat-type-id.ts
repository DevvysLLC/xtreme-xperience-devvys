import type {
  BookingConfigFragment,
  BookingSupercarFragment
} from '../core/dato/fragments/booking-config.typegen'
import { logger } from '../core/logger/logger'

export type FindBookingSupercarResult = {
  bookingSupercar: BookingSupercarFragment
  groupTitle: string | null
}

/**
 * Finds the booking supercar in config that matches the given RocketRez seat type ID.
 * Used to resolve ride-along (and other) line items to the correct supercar for metadata (title, image, subtitle, label, isMulticar).
 */
export const findBookingSupercarBySeatTypeId = (
  config: BookingConfigFragment | null | undefined,
  seatTypeId: number
): FindBookingSupercarResult | null => {
  if (!config?.supercars?.length) {
    logger.info(
      { seatTypeId },
      'findBookingSupercarBySeatTypeId: no config or supercars'
    )
    return null
  }
  const seatTypeIdStr = String(seatTypeId)
  for (const group of config.supercars) {
    const match = group.supercars?.find(
      (s) => s.rocketRezSeatTypeId === seatTypeIdStr
    )
    if (match) {
      logger.info(
        {
          seatTypeId,
          groupTitle: group.title,
          rocketRezSeatTypeId: match.rocketRezSeatTypeId
        },
        'findBookingSupercarBySeatTypeId: found match'
      )
      return {
        bookingSupercar: match,
        groupTitle: group.title ?? null
      }
    }
  }
  logger.info(
    { seatTypeId, seatTypeIdStr },
    'findBookingSupercarBySeatTypeId: no match'
  )
  return null
}
