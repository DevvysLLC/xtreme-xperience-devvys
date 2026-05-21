import type { BookingPageFragment } from '../io/types'

/**
 * Finds matching page metadata from booking config pages based on the current path.
 * Compares the pathname to the page key to find a match.
 *
 * @param pages - Array of booking config pages
 * @param pathname - Current pathname (e.g., "/booking/date-and-car")
 * @returns Matching page metadata or null if no match found
 */
export const getBookingPageMetadata = (
  pages: BookingPageFragment[] | null | undefined,
  pathname: string
): BookingPageFragment | null => {
  if (!pages || pages.length === 0) {
    return null
  }

  // Normalize pathname by removing leading/trailing slashes
  const normalizedPath = pathname.replace(/^\/+|\/+$/g, '')

  for (const page of pages) {
    if (!page.key) {
      continue
    }

    // Normalize the key the same way
    const normalizedKey = page.key.replace(/^\/+|\/+$/g, '')

    // Check for exact match or if pathname ends with the key (for nested routes)
    if (
      normalizedPath === normalizedKey ||
      normalizedPath.endsWith(normalizedKey)
    ) {
      return page
    }
  }

  return null
}
