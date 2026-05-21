import type { EventDataFragment } from '../core/dato/fragments/event-data.typegen'
import type { TrackFragment } from '../core/dato/fragments/track.typegen'
import type { TrackDataFragment } from '../core/dato/fragments/track-data.typegen'

type Track = TrackFragment | TrackDataFragment | null
type Event = EventDataFragment | null

export const getBookingLinkParams = (
  track: Track,
  event: Event,
  setHomeTrack?: boolean
): URLSearchParams => {
  const params = new URLSearchParams()
  if (track?.config?.handle) {
    params.set('track', track.config.handle)
  }
  if (event?.model?.rocketRezId) {
    params.set('event', event.model.rocketRezId)
  }
  if (setHomeTrack) {
    params.set('setHomeTrack', 'true')
  }
  return params
}
