/**
 * Caps the cart token expiry at 15 minutes maximum.
 * If the token expiry is greater than 15 minutes, returns 15 minutes from now.
 * If the token expiry is less than or equal to 15 minutes, returns the actual expiry.
 *
 * @param tokenExpiry - ISO 8601 date string (e.g., "2025-10-29T16:24:28.424Z") or null
 * @returns ISO 8601 date string capped at 15 minutes, or null if input is invalid
 */
export const getCartExpiry = (tokenExpiry: string | null): string | null => {
  if (!tokenExpiry) {
    return null
  }

  const expiryDate = new Date(tokenExpiry)
  if (Number.isNaN(expiryDate.getTime())) {
    return null
  }

  const now = new Date()
  const diffMs = expiryDate.getTime() - now.getTime()
  const diffMinutes = diffMs / (1000 * 60)
  const maxMinutes = 15

  // If token expiry is greater than 15 minutes, cap it at 15 minutes
  // If token expiry is less than or equal to 15 minutes, use the actual expiry
  if (diffMinutes > maxMinutes) {
    const cappedDate = new Date(now.getTime() + maxMinutes * 60 * 1000)
    return cappedDate.toISOString()
  }

  return tokenExpiry
}
