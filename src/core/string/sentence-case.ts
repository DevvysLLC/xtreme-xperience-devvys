/**
 * Converts a snake_case string to sentence case.
 * Example: "ride_along" => "Ride Along"
 *
 * @param str - The snake_case string to convert
 * @returns The sentence case string
 */
export const sentenceCase = (str: string): string => {
  if (!str) {
    return str
  }

  return str
    .split('_')
    .map((word) => {
      if (!word) {
        return word
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}
