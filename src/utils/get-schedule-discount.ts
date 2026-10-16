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

const checkRuleMatchesDate = (
  rule: BookingDiscountRule,
  dateStr: string,
  weekday: string
): boolean => {
  const titleLower = rule.title?.toLowerCase() ?? ''
  const timeWindowLower = rule.timeWindow?.toLowerCase() ?? ''

  // 1. Weekend check
  if (titleLower.includes('weekend') || timeWindowLower === 'weekend') {
    return weekday === 'saturday' || weekday === 'sunday'
  }

  // 2. Weekday check
  if (titleLower.includes('weekday') || timeWindowLower === 'weekday') {
    return (
      weekday === 'monday' ||
      weekday === 'tuesday' ||
      weekday === 'wednesday' ||
      weekday === 'thursday' ||
      weekday === 'friday'
    )
  }

  // 3. Day of week check (full names and common abbreviations)
  const dayPatterns: Array<{ name: string; regex: RegExp }> = [
    { name: 'sunday', regex: /\b(sunday|sun)\b/i },
    { name: 'monday', regex: /\b(monday|mon)\b/i },
    { name: 'tuesday', regex: /\b(tuesday|tue|tues)\b/i },
    { name: 'wednesday', regex: /\b(wednesday|wed)\b/i },
    { name: 'thursday', regex: /\b(thursday|thu|thur|thurs)\b/i },
    { name: 'friday', regex: /\b(friday|fri)\b/i },
    { name: 'saturday', regex: /\b(saturday|sat)\b/i }
  ]

  const ruleMentionsAnyDay = dayPatterns.some(
    (p) => p.regex.test(titleLower) || timeWindowLower === p.name
  )
  if (ruleMentionsAnyDay) {
    const patternForToday = dayPatterns.find((p) => p.name === weekday)
    const matchesToday = Boolean(
      (patternForToday && patternForToday.regex.test(titleLower)) ||
        timeWindowLower === weekday
    )
    return matchesToday
  }

  // 4. Explicit date check
  const hasDatePattern =
    titleLower.match(/\d{4}-\d{2}-\d{2}/) ||
    titleLower.match(/\d{1,2}\/\d{1,2}/) ||
    titleLower.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i)

  if (hasDatePattern) {
    if (
      titleLower.includes(dateStr.toLowerCase()) ||
      Boolean(rule.startTime?.includes(dateStr)) ||
      Boolean(rule.endTime?.includes(dateStr))
    ) {
      return true
    }

    const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`)
    const monthNames = [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ]
    const mName = monthNames[d.getMonth()]
    const dayNum = d.getDate()
    if (mName && new RegExp(`\\b${mName}[a-z]*\\s*${dayNum}\\b`, 'i').test(titleLower)) {
      return true
    }

    return false
  }

  return true
}

export const getDateDiscountRule = ({
  date,
  eventId,
  rules
}: {
  date: string
  eventId?: string | null
  rules?: BookingDiscountRule[] | null
}): { badgeLabel: string; discountPercent?: number; rule: BookingDiscountRule } | null => {
  if (!rules || rules.length === 0) {
    return null
  }

  const dateObj = new Date(date.includes('T') ? date : `${date}T00:00:00`)
  const weekdayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ]
  const weekday = weekdayNames[dateObj.getDay()] ?? ''

  for (const rule of rules) {
    // 1. Event filter
    if (rule.applyToAllEvents === false) {
      if (!eventId || !rule.events || !rule.events.some((e) => e.id === eventId)) {
        continue
      }
    }

    // 2. Date / day-of-week match
    if (!checkRuleMatchesDate(rule, date, weekday)) {
      continue
    }

    // Determine badge label
    let badge = rule.badgeLabel ?? undefined
    let percent: number | undefined
    if (rule.discountValue && rule.discountValue > 0) {
      if (rule.discountType === 'percentage') {
        percent = Math.round(rule.discountValue)
        if (!badge) {
          badge = `${percent}% OFF`
        }
      } else if (!badge) {
        badge = `$${Math.round(rule.discountValue)} OFF`
      }
    }

    if (badge) {
      return { badgeLabel: badge, discountPercent: percent, rule }
    }
  }

  return null
}

/**
 * Evaluates whether any active Booking Discount Rules apply to a given schedule,
 * car, and event, and returns the calculated price, before/after compare-at price,
 * and optional badge.
 */
export const getScheduleDiscount = ({
  scheduleStartTime,
  scheduleDate,
  basePrice,
  existingCompareAtPrice,
  eventId,
  supercarId,
  rules
}: {
  scheduleStartTime?: string | null
  scheduleDate?: string | null
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
  const weekdayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ]
  const weekday = scheduleDate
    ? weekdayNames[
        new Date(
          scheduleDate.includes('T') ? scheduleDate : `${scheduleDate}T00:00:00`
        ).getDay()
      ] ?? ''
    : ''

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

    // 3. Date / day-of-week filter
    if (scheduleDate && !checkRuleMatchesDate(rule, scheduleDate, weekday)) {
      continue
    }

    // 4. Time filter
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
      } else if (
        rule.timeWindow !== 'all_day' &&
        !weekdayNames.includes(rule.timeWindow?.toLowerCase() ?? '')
      ) {
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

    // 5. Calculate discount
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
