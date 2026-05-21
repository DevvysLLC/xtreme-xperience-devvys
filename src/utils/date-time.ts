/**
 * Date and time utility functions for combining and extracting
 * date/time components in ISO format.
 */

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

/**
 * Returns today's date as a YYYY-MM-DD string in UTC.
 * Useful for comparing against ISO date strings without timezone drift.
 */
export const getUtcTodayString = (): string => {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const day = String(now.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Validates that a string is in YYYY-MM-DD format
 * @param value - The string to validate
 * @returns true if the string matches YYYY-MM-DD format
 */
export const isValidDateFormat = (value: string): boolean => {
  return DATE_REGEX.test(value)
}

/**
 * Combines a date string (YYYY-MM-DD) with a time string (HH:mm) into an ISO datetime string
 * @param date - Date in YYYY-MM-DD format
 * @param time - Time in HH:mm format
 * @returns ISO datetime string in YYYY-MM-DDTHH:mm:00 format
 */
export const combineDateAndTime = (date: string, time: string): string => {
  return `${date}T${time}:00`
}

/**
 * Extracts just the time portion (HH:mm) from an ISO datetime or time-only string
 * @param dateTimeOrTime - Either an ISO datetime (YYYY-MM-DDTHH:mm:ss) or time string (HH:mm)
 * @returns Time in HH:mm format
 */
export const extractTimeFromDateTime = (dateTimeOrTime: string): string => {
  if (dateTimeOrTime.includes('T')) {
    const timePart = dateTimeOrTime.split('T')[1]
    if (timePart) {
      return timePart.substring(0, 5) // Get HH:mm
    }
  }
  return dateTimeOrTime
}

/**
 * Formats a date string to YYYY-MM-DD format
 * @param dateString - Date string (already in YYYY-MM-DD format or Date ISO string)
 * @returns Formatted date string in YYYY-MM-DD format, or null if invalid
 */
export const formatDateToYYYYMMDD = (
  dateString: string | null | undefined
): string | null => {
  if (!dateString) {
    return null
  }

  // If already in YYYY-MM-DD format, return as-is
  if (DATE_REGEX.test(dateString)) {
    return dateString
  }

  // Try to parse and format
  // Use UTC methods to avoid timezone issues when parsing ISO datetime strings
  // This ensures consistent date extraction regardless of server timezone
  try {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) {
      return null
    }
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch {
    return null
  }
}

/**
 * Formats an event date range with short month names (e.g., "Jan 4-5, 2026")
 * Uses UTC methods to avoid timezone hydration issues
 * @param startDate - Start date in ISO format (YYYY-MM-DD)
 * @param endDate - End date in ISO format (YYYY-MM-DD), optional
 * @returns Formatted date range string
 */
export const formatEventDateRangeShort = (
  startDate: string | null | undefined,
  endDate: string | null | undefined
): string => {
  if (!startDate) {
    return ''
  }

  // Parse ISO date string (YYYY-MM-DD) as UTC to avoid timezone hydration issues
  const start = new Date(startDate)
  if (Number.isNaN(start.getTime())) {
    return ''
  }

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  const startMonth = monthNames[start.getUTCMonth()]
  const startDay = start.getUTCDate()
  const startYear = start.getUTCFullYear()

  if (!endDate) {
    return `${startMonth} ${startDay}, ${startYear}`
  }

  const end = new Date(endDate)
  if (Number.isNaN(end.getTime())) {
    return `${startMonth} ${startDay}, ${startYear}`
  }

  const endMonth = monthNames[end.getUTCMonth()]
  const endDay = end.getUTCDate()
  const endYear = end.getUTCFullYear()

  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startDay}-${endDay}, ${startYear}`
  }

  if (startYear === endYear) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`
  }

  return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`
}

/**
 * Formats an event date range with long month names (e.g., "January 2026" or "August - September 2026")
 * Uses UTC methods to avoid timezone hydration issues
 * @param startDate - Start date in ISO format (YYYY-MM-DD)
 * @param endDate - End date in ISO format (YYYY-MM-DD), optional
 * @returns Formatted date range string
 */
export const formatEventDateRangeLong = (
  startDate: string | null | undefined,
  endDate: string | null | undefined
): string => {
  if (!startDate) {
    return ''
  }

  // Parse ISO date string (YYYY-MM-DD) as UTC to avoid timezone hydration issues
  const start = new Date(startDate)
  if (Number.isNaN(start.getTime())) {
    return ''
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const startMonth = monthNames[start.getUTCMonth()]
  const startYear = start.getUTCFullYear()

  if (!endDate) {
    return `${startMonth} ${startYear}`
  }

  const end = new Date(endDate)
  if (Number.isNaN(end.getTime())) {
    return `${startMonth} ${startYear}`
  }

  const endMonth = monthNames[end.getUTCMonth()]
  const endYear = end.getUTCFullYear()

  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startYear}`
  }

  if (startYear === endYear) {
    return `${startMonth} - ${endMonth} ${startYear}`
  }

  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`
}

/**
 * Generates an array of date strings (YYYY-MM-DD) for a date range
 * Uses UTC methods to avoid timezone hydration issues
 * @param startDate - Start date in ISO format (YYYY-MM-DD)
 * @param endDate - End date in ISO format (YYYY-MM-DD), optional (defaults to startDate)
 * @returns Array of date strings in YYYY-MM-DD format
 */
export const generateDateRange = (
  startDate: string | null | undefined,
  endDate: string | null | undefined
): string[] => {
  if (!startDate) {
    return []
  }

  // Parse ISO date string (YYYY-MM-DD) as UTC to avoid timezone hydration issues
  const start = new Date(startDate)
  if (Number.isNaN(start.getTime())) {
    return []
  }

  const end = endDate ? new Date(endDate) : start
  if (Number.isNaN(end.getTime())) {
    return []
  }

  // Set to UTC midnight to avoid timezone issues
  const startUTC = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
  )
  const endUTC = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate())
  )

  const dates: string[] = []
  const current = new Date(startUTC)

  while (current <= endUTC) {
    const year = current.getUTCFullYear()
    const month = String(current.getUTCMonth() + 1).padStart(2, '0')
    const day = String(current.getUTCDate()).padStart(2, '0')
    dates.push(`${year}-${month}-${day}`)
    current.setUTCDate(current.getUTCDate() + 1)
  }

  return dates
}

/**
 * Parses a date string (YYYY-MM-DD) as a local date to avoid timezone shift.
 * When parsing YYYY-MM-DD, JavaScript/date-fns treats it as UTC midnight,
 * which can shift to the previous day in timezones behind UTC.
 * This function creates a Date object in local time to prevent this issue.
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object in local time, or falls back to standard Date parsing if invalid
 */
export const parseLocalDate = (dateString: string): Date => {
  const dateParts = dateString.split('-')
  const year = Number(dateParts[0])
  const month = Number(dateParts[1])
  const dayNum = Number(dateParts[2])

  if (
    dateParts.length === 3 &&
    !Number.isNaN(year) &&
    !Number.isNaN(month) &&
    !Number.isNaN(dayNum)
  ) {
    return new Date(year, month - 1, dayNum)
  }

  // Fallback to standard parsing if format is invalid
  return new Date(dateString)
}
