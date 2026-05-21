import type {
  BookingSupercarGroup,
  BookingSupercarMetadata,
  RocketRezEventWithSchedules
} from '../io/types'

/**
 * Finds matching supercar metadata from booking config supercars based on the seat type ID.
 * Iterates through supercar groups and matches the supercar.id to the rocketRezSeatTypeId.
 *
 * @param supercar - The seat type with schedules from the API
 * @param supercarGroups - Array of supercar groups from booking config
 * @returns Matching supercar metadata or null if no match found
 */
export const getBookingSupercarMetadata = (
  supercar: RocketRezEventWithSchedules,
  supercarGroups: BookingSupercarGroup[] | null | undefined
): BookingSupercarMetadata | null => {
  if (!supercarGroups || supercarGroups.length === 0) {
    return null
  }

  // supercar.id is number | null | undefined
  const supercarId = supercar.id
  if (supercarId === null || supercarId === undefined) {
    return null
  }

  const supercarIdString = String(supercarId)

  // Iterate through groups to find matching supercar
  for (const group of supercarGroups) {
    for (const entry of group.supercars) {
      if (entry.rocketRezSeatTypeId === supercarIdString) {
        const model = entry.supercar?.model
        return {
          id: entry.supercar?.id ?? '',
          title: model?.title ?? null,
          thumbnail: model?.thumbnail ?? null,
          displayPrice: model?.displayPrice ?? null
        }
      }
    }
  }

  return null
}
