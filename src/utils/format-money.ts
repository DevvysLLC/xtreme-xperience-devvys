/**
 * Format money values with flexible display options
 *
 * @param value - The monetary value (in cents by default, or dollars if valueInCents is false)
 * @param options - Formatting options
 * @returns Formatted money string
 *
 * @example
 * // Value in cents (default)
 * formatMoney(10000) // "$100.00"
 * formatMoney(10000, { showCents: false }) // "$100"
 * formatMoney(10000, { showDollarSign: false }) // "100.00"
 * formatMoney(10000, { showDollarSign: false, showCents: false }) // "100"
 *
 * // Value in dollars
 * formatMoney(100, { valueInCents: false }) // "$100.00"
 * formatMoney(100, { valueInCents: false, showCents: false }) // "$100"
 */
export const formatMoney = (
  value: number,
  options: {
    showDollarSign?: boolean
    showCents?: boolean
    valueInCents?: boolean
  } = {}
): string => {
  const {
    showDollarSign = true,
    showCents = true,
    valueInCents = true
  } = options

  // Convert cents to dollars if needed
  const dollars = valueInCents ? value / 100 : value

  // Format the number
  const formattedNumber = showCents
    ? dollars.toFixed(2)
    : Math.round(dollars).toString()

  // Add dollar sign if requested
  return showDollarSign ? `$${formattedNumber}` : formattedNumber
}

/**
 * Format money value as cents string (e.g., "10000" for $100.00)
 *
 * @param value - The monetary value in dollars
 * @returns Value in cents as a number
 *
 * @example
 * dollarsToCents(100) // 10000
 * dollarsToCents(100.50) // 10050
 */
export const dollarsToCents = (value: number): number => {
  return Math.round(value * 100)
}

/**
 * Format money value from cents to dollars
 *
 * @param value - The monetary value in cents
 * @returns Value in dollars as a number
 *
 * @example
 * centsToDollars(10000) // 100
 * centsToDollars(10050) // 100.50
 */
export const centsToDollars = (value: number): number => {
  return value / 100
}
