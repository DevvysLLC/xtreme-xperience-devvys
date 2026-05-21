'use client'

import { useMemo } from 'react'
import type {
  BookingSupercarGroup,
  BookingSupercarMetadata,
  RocketRezEventWithSchedules
} from '../../io/types'
import { getBookingSupercarMetadata } from '../../utils/get-booking-supercar-metadata'

/**
 * Get supercar display metadata
 *
 * Options:
 * - supercar - RocketRez event data
 * - supercarGroups - Config groups from DatoCMS
 *
 * - Returns CMS metadata for the supercar
 * - Includes title, media, badges, etc
 */
export type UseBookingSupercarMetadataOptions = {
  supercar: RocketRezEventWithSchedules
  supercarGroups: BookingSupercarGroup[] | null | undefined
}

export const useBookingSupercarMetadata = (
  options: UseBookingSupercarMetadataOptions
): BookingSupercarMetadata | null => {
  const { supercar, supercarGroups } = options

  return useMemo(
    () => getBookingSupercarMetadata(supercar, supercarGroups),
    [supercar, supercarGroups]
  )
}
