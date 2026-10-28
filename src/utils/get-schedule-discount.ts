export type BookingDiscountRule = {
  id?: string
  title?: string | null
  discountType?: 'percentage' | 'fixed_amount' | string | null
  discountValue?: number | null
  timeWindow?: 'morning' | 'afternoon' | 'all_day' | 'custom' | string | null
  startTime?: string | null
  endTime?: string | null
  applyToAllEvents?: boolean | null
  events?: Array<{ id: string }> | null
  supercars?: Array<{ id: string }> | null
  packages?: Array<{ id: string }> | null
  addons?: Array<{ id: string }> | null
  excludedTracks?: Array<{ id: string; [key: string]: unknown }> | null
  daysOfWeek?: 'all' | 'weekdays' | 'monday_thursday' | 'weekends' | 'friday' | 'saturday' | 'sunday' | string | null
  targetType?: 'all' | 'supercars' | 'ride_along' | 'packages' | 'addons' | 'gift_cards' | string | null
  compareAtOverride?: number | null
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
  // 1. Explicit daysOfWeek field if configured
  if (rule.daysOfWeek && rule.daysOfWeek !== 'all') {
    if (rule.daysOfWeek === 'weekdays') {
      return (
        weekday === 'monday' ||
        weekday === 'tuesday' ||
        weekday === 'wednesday' ||
        weekday === 'thursday' ||
        weekday === 'friday'
      )
    }
    if (rule.daysOfWeek === 'monday_thursday') {
      return (
        weekday === 'monday' ||
        weekday === 'tuesday' ||
        weekday === 'wednesday' ||
        weekday === 'thursday'
      )
    }
    if (rule.daysOfWeek === 'weekends') {
      return weekday === 'saturday' || weekday === 'sunday'
    }
    if (rule.daysOfWeek.toLowerCase() === weekday) {
      return true
    }
    return false
  }

  const titleLower = rule.title?.toLowerCase() ?? ''
  const timeWindowLower = rule.timeWindow?.toLowerCase() ?? ''

  // 2. Weekend check in title
  if (titleLower.includes('weekend') || timeWindowLower === 'weekend') {
    return weekday === 'saturday' || weekday === 'sunday'
  }

  // 3. Weekday check in title
  if (titleLower.includes('weekday') || timeWindowLower === 'weekday') {
    return (
      weekday === 'monday' ||
      weekday === 'tuesday' ||
      weekday === 'wednesday' ||
      weekday === 'thursday' ||
      weekday === 'friday'
    )
  }

  // 4. Day of week check (full names and common abbreviations)
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

  // 5. Explicit date check
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
  trackId,
  supercarId,
  isRideAlong,
  isMulticar,
  rules
}: {
  date: string
  eventId?: string | null
  trackId?: string | null
  supercarId?: string | null
  isRideAlong?: boolean | null
  isMulticar?: boolean | null
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
    // 1. Excluded Tracks check (e.g. COTA, Sonoma)
    if (trackId && rule.excludedTracks && rule.excludedTracks.length > 0) {
      if (rule.excludedTracks.some((t) => t.id === trackId)) {
        continue
      }
    }

    // 2. Product targeting type
    if (rule.targetType === 'ride_along' && !isRideAlong) {
      continue
    }
    if (rule.targetType === 'supercars' && (isRideAlong || isMulticar)) {
      continue
    }
    if (rule.targetType === 'packages' && !isMulticar) {
      continue
    }
    if (rule.targetType === 'addons' || rule.targetType === 'gift_cards') {
      continue
    }

    // 3. Event filter
    if (rule.applyToAllEvents === false) {
      if (!eventId || !rule.events || !rule.events.some((e) => e.id === eventId)) {
        continue
      }
    }

    // 4. Car / Package filter
    if (isMulticar) {
      const packageList = (rule.packages && rule.packages.length > 0)
        ? rule.packages
        : (rule.targetType === 'packages' ? rule.supercars : null)
      if (packageList && packageList.length > 0) {
        if (!supercarId || !packageList.some((p) => p.id === supercarId)) {
          continue
        }
      }
    } else {
      if (supercarId && rule.supercars && rule.supercars.length > 0) {
        if (!rule.supercars.some((s) => s.id === supercarId)) {
          continue
        }
      }
    }

    // 5. Date / day-of-week match
    if (!checkRuleMatchesDate(rule, date, weekday)) {
      continue
    }

    // Determine badge label - only show if explicit non-empty badgeLabel is provided
    const badge = rule.badgeLabel && rule.badgeLabel.trim() ? rule.badgeLabel.trim() : undefined
    let percent: number | undefined
    if (rule.discountValue && rule.discountValue > 0 && rule.discountType === 'percentage') {
      percent = Math.round(rule.discountValue)
    }

    if (badge) {
      return { badgeLabel: badge, discountPercent: percent, rule }
    }
  }

  return null
}

/**
 * Evaluates whether any active Booking Discount Rules apply to a given schedule,
 * car, track, and event, and returns the calculated price, before/after compare-at price,
 * and optional badge.
 */
export const getScheduleDiscount = ({
  scheduleStartTime,
  scheduleDate,
  basePrice,
  existingCompareAtPrice,
  eventId,
  trackId,
  supercarId,
  isRideAlong,
  isMulticar,
  rules
}: {
  scheduleStartTime?: string | null
  scheduleDate?: string | null
  basePrice: number | null
  existingCompareAtPrice?: number | null
  eventId?: string | null
  trackId?: string | null
  supercarId?: string | null
  isRideAlong?: boolean | null
  isMulticar?: boolean | null
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
    // 1. Excluded Tracks filter (e.g. COTA, Sonoma)
    if (trackId && rule.excludedTracks && rule.excludedTracks.length > 0) {
      if (rule.excludedTracks.some((t) => t.id === trackId)) {
        continue
      }
    }

    // 2. Product targeting type
    if (rule.targetType === 'ride_along' && !isRideAlong) {
      continue
    }
    if (rule.targetType === 'supercars' && (isRideAlong || isMulticar)) {
      continue
    }
    if (rule.targetType === 'packages' && !isMulticar) {
      continue
    }
    if (rule.targetType === 'addons' || rule.targetType === 'gift_cards') {
      continue
    }

    // 3. Event filter
    if (rule.applyToAllEvents === false) {
      if (!eventId || !rule.events || !rule.events.some((e) => e.id === eventId)) {
        continue
      }
    }

    // 4. Car / Package filter
    if (isMulticar) {
      const packageList = (rule.packages && rule.packages.length > 0)
        ? rule.packages
        : (rule.targetType === 'packages' ? rule.supercars : null)
      if (packageList && packageList.length > 0) {
        if (!supercarId || !packageList.some((p) => p.id === supercarId)) {
          continue
        }
      }
    } else {
      if (rule.supercars && rule.supercars.length > 0) {
        if (!supercarId || !rule.supercars.some((s) => s.id === supercarId)) {
          continue
        }
      }
    }

    // 5. Date / day-of-week filter
    if (scheduleDate && !checkRuleMatchesDate(rule, scheduleDate, weekday)) {
      continue
    }

    // 6. Time filter
    if (scheduleMinutes !== null) {
      if (rule.timeWindow === 'morning') {
        // Morning: 8:00 AM (480) - 9:30 AM / 10:00 AM (600)
        if (scheduleMinutes < 480 || scheduleMinutes > 600) {
          continue
        }
      } else if (rule.timeWindow === 'afternoon') {
        // Afternoon: 10:00 AM (600) - 5:30 PM (1050)
        if (scheduleMinutes < 600 || scheduleMinutes > 1050) {
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

    // 7. Calculate discount
    const discountVal = rule.discountValue ?? 0
    if (discountVal <= 0 && !rule.compareAtOverride) {
      continue
    }

    let calculatedPrice = basePathPrice(basePrice)
    if (rule.discountType === 'percentage' && discountVal > 0) {
      const discountAmount = (calculatedPrice * discountVal) / 100
      calculatedPrice = Math.max(0, Math.round(calculatedPrice - discountAmount))
    } else if (discountVal > 0) {
      // Fixed dollar discount (handle value in cents or dollars)
      const dollarDiscount = discountVal > 1000 ? discountVal / 100 : discountVal
      calculatedPrice = Math.max(0, Math.round(calculatedPrice - dollarDiscount))
    }

    const hasPriceDiscount = calculatedPrice < basePathPrice(basePrice)
    const hasCompareAtOverride = rule.compareAtOverride != null && rule.compareAtOverride > calculatedPrice

    if (hasPriceDiscount || hasCompareAtOverride) {
      const compareAt =
        rule.compareAtOverride != null
          ? rule.compareAtOverride
          : Math.max(basePathPrice(basePrice), existingCompareAtPrice ?? 0)

      return {
        price: calculatedPrice,
        compareAtPrice: compareAt,
        badgeLabel: rule.badgeLabel && rule.badgeLabel.trim() ? rule.badgeLabel.trim() : null,
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


export type AddonDiscountResult = {
  price: number
  compareAtPrice: number | null
  badgeLabel?: string | null
  isDiscounted: boolean
}

export const getAddonDiscount = ({
  addonId,
  basePrice,
  rules
}: {
  addonId?: string | null
  basePrice: number | null
  rules?: BookingDiscountRule[] | null
}): AddonDiscountResult => {
  if (basePrice === null || !rules || rules.length === 0) {
    return {
      price: basePrice ?? 0,
      compareAtPrice: null,
      badgeLabel: null,
      isDiscounted: false
    }
  }

  for (const rule of rules) {
    if (rule.targetType && rule.targetType !== 'all' && rule.targetType !== 'addons') {
      continue
    }

    if (rule.addons && rule.addons.length > 0) {
      if (!addonId || !rule.addons.some((a) => a.id === addonId)) {
        continue
      }
    }

    const discountVal = rule.discountValue ?? 0
    if (discountVal <= 0 && !rule.compareAtOverride) {
      continue
    }

    let calculatedPrice = basePrice
    if (rule.discountType === 'percentage' && discountVal > 0) {
      const discountAmount = (calculatedPrice * discountVal) / 100
      calculatedPrice = Math.max(0, Math.round(calculatedPrice - discountAmount))
    } else if (discountVal > 0) {
      const dollarDiscount = discountVal > 1000 ? discountVal / 100 : discountVal
      calculatedPrice = Math.max(0, Math.round(calculatedPrice - dollarDiscount))
    }

    const hasDiscount = calculatedPrice < basePrice
    const hasOverride = rule.compareAtOverride != null && rule.compareAtOverride > calculatedPrice

    if (hasDiscount || hasOverride) {
      return {
        price: calculatedPrice,
        compareAtPrice: rule.compareAtOverride != null ? rule.compareAtOverride : basePrice,
        badgeLabel: rule.badgeLabel && rule.badgeLabel.trim() ? rule.badgeLabel.trim() : null,
        isDiscounted: true
      }
    }
  }

  return {
    price: basePrice ?? 0,
    compareAtPrice: null,
    badgeLabel: null,
    isDiscounted: false
  }
}
