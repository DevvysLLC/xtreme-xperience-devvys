export type BookingDiscountRule = {
  id?: string
  title?: string | null
  discountType?: 'percentage' | 'fixed_amount' | string | null
  discountValue?: number | null
  timeWindow?: 'morning' | 'afternoon' | 'all_day' | string | null
  startTime?: string | null
  endTime?: string | null
  applyToAllEvents?: boolean | null
  events?: Array<{ id: string }> | null
  supercars?: Array<{ id: string }> | null
  badgeLabel?: string | null
}

const parseTimeToMinutes = (timeStr?: string | null): number | null => {
  if (!timeStr) {
    return null
  }
  const parts = timeStr.trim().split(':')
  if (parts.length < 2) {
    return null
  }
  const hours = Number(parts[0])
  const minutes = Number(parts[1])
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null
  }
  return hours * 60 + minutes
}

const basePathPrice = (val: number | null): number => val ?? 0

export type ScheduleDiscountResult = {
  price: number
  compareAtPrice: number | null
  badgeLabel?: string | null
  isDiscounted: boolean
}

/**
 * Evaluates whether any active Booking Discount Rules apply to a given schedule,
 * car, and event, and returns the calculated price, before/after compare-at price,
 * and optional badge.
 */
export const getScheduleDiscount = ({
  scheduleStartTime,
  basePrice,
  existingCompareAtPrice,
  eventId,
  supercarId,
  rules
}: {
  scheduleStartTime?: string | null
  basePrice: number | null
  existingCompareAtPrice?: number | null
  eventId?: string | null
  supercarId?: string | null
  rules?: BookingDiscountRule[] | null
}): ScheduleDiscountResult => {
  if (basePrice === null || !rules || rules.length === 0) {
    return {
      price: basePathPrice(basePrice),
      compareAtPrice: existingCompareAtPrice ?? null,
      isDiscounted: false
    }
  }

  const scheduleMinutes = parseTimeToMinutes(scheduleStartTime)

  for (const rule of rules) {
    // 1. Event filter
    if (rule.applyToAllEvents === false) {
      if (!eventId || !rule.events || !rule.events.some((e) => e.id === eventId)) {
        continue
      }
    }

    // 2. Car filter
    if (rule.supercars && rule.supercars.length > 0) {
      if (!supercarId || !rule.supercars.some((s) => s.id === supercarId)) {
        continue
      }
    }

    // 3. Time filter
    if (scheduleMinutes !== null) {
      if (rule.timeWindow === 'morning') {
        // Morning: 8:00 AM (480) - 10:00 AM (600)
        if (scheduleMinutes < 480 || scheduleMinutes > 600) {
          continue
        }
      } else if (rule.timeWindow === 'afternoon') {
        // Afternoon: 10:30 AM (630) - 5:30 PM (1050)
        if (scheduleMinutes < 630 || scheduleMinutes > 1050) {
          continue
        }
      } else if (rule.timeWindow !== 'all_day') {
        const ruleStart = parseTimeToMinutes(rule.startTime)
        const ruleEnd = parseTimeToMinutes(rule.endTime)
        if (ruleStart !== null && scheduleMinutes < ruleStart) {
          continue
        }
        if (ruleEnd !== null && scheduleMinutes > ruleEnd) {
          continue
        }
      }
    }

    // 4. Calculate discount
    const discountVal = rule.discountValue ?? 0
    if (discountVal <= 0) {
      continue
    }

    let calculatedPrice = basePathPrice(basePrice)
    if (rule.discountType === 'percentage') {
      const discountAmount = (calculatedPrice * discountVal) / 100
      calculatedPrice = Math.max(0, Math.round(calculatedPrice - discountAmount))
    } else {
      // Fixed dollar discount (handle value in cents or dollars)
      const dollarDiscount = discountVal > 1000 ? discountVal / 100 : discountVal
      calculatedPrice = Math.max(0, Math.round(calculatedPrice - dollarDiscount))
    }

    if (calculatedPrice < basePathPrice(basePrice)) {
      const compareAt = Math.max(
        basePathPrice(basePrice),
        existingCompareAtPrice ?? 0
      )
      return {
        price: calculatedPrice,
        compareAtPrice: compareAt,
        badgeLabel: rule.badgeLabel ?? null,
        isDiscounted: true
      }
    }
  }

  return {
    price: basePathPrice(basePrice),
    compareAtPrice: existingCompareAtPrice ?? null,
    isDiscounted: false
  }
}
