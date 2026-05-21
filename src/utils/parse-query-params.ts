/**
 * Safely parses a query parameter string to an integer.
 * Returns undefined if the value is null, empty, or cannot be parsed.
 *
 * @param value - The query parameter value to parse
 * @returns The parsed integer, or undefined if parsing fails
 */
export const parseInteger = (value: string | null): number | undefined => {
  if (!value) {
    return undefined
  }
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? undefined : parsed
}
