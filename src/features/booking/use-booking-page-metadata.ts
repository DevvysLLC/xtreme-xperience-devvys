'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import type { BookingPageFragment } from '../../io/types'
import { getBookingPageMetadata } from '../../utils/get-booking-page-metadata'

/**
 * Get current page metadata
 *
 * Options:
 * - pages - Array of page metadata from config
 *
 * - Matches current pathname to page config
 * - Returns metadata for SEO, titles, etc
 */
export type UseBookingPageMetadataOptions = {
  pages: BookingPageFragment[] | null | undefined
}

export const useBookingPageMetadata = (
  options: UseBookingPageMetadataOptions
): BookingPageFragment | null => {
  const { pages } = options
  const pathname = usePathname()

  return useMemo(
    () => getBookingPageMetadata(pages, pathname),
    [pages, pathname]
  )
}
