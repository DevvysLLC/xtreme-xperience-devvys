import type { EventDataFragment } from '../core/dato/fragments/event-data.typegen'
import type { TrackDataFragment } from '../core/dato/fragments/track-data.typegen'

/**
 * Find the track that contains a given event by matching event IDs
 */
export const findTrackForEvent = (
  event: EventDataFragment,
  tracks: TrackDataFragment[]
): TrackDataFragment | null => {
  const eventId = event.model?.id
  if (!eventId) {
    return null
  }

  return (
    tracks.find((track) =>
      track.model?.events?.some((e) => e.model?.id === eventId)
    ) ?? null
  )
}
