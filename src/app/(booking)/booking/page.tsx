import { redirect } from 'next/navigation'
import { BookingInitializer } from '../../../components/booking-wizard/components/booking-initializer'
import { ROUTES } from '../../../config/routes'
import type { TrackDataFragment } from '../../../core/dato/fragments/track-data.typegen'
import { initDatoSdk } from '../../../core/dato/sdk'
import { initLogger } from '../../../core/logger'
import { getUtcTodayString } from '../../../utils/date-time'

const logger = initLogger().child({ name: 'booking-home-page' })

const fetchTrackByHandle = async (
  handle: string
): Promise<TrackDataFragment | null> => {
  const sdk = initDatoSdk()
  const data = await sdk.getAllTracksData()
  return data.allTracks.find((t) => t.config?.handle === handle) ?? null
}

/**
 * Returns a copy of the track with past events removed.
 * An event is considered past when its end date (or start date if no end date)
 * is before today (UTC).
 */
const filterFutureEvents = (track: TrackDataFragment): TrackDataFragment => {
  if (!track.model) {
    return track
  }
  const today = getUtcTodayString()
  return {
    ...track,
    model: {
      ...track.model,
      events: track.model.events.filter((event) => {
        const endDate = event.model?.endDate ?? event.model?.startDate
        if (!endDate) {
          return true
        }
        return endDate >= today
      })
    }
  }
}

type Props = {
  searchParams: Promise<{
    track?: string
    event?: string
    setHomeTrack?: string
  }>
}

export default async function BookingHomePage({ searchParams }: Props) {
  const params = await searchParams
  const { track: trackHandle, event: eventRocketRezId, setHomeTrack } = params
  const shouldSetHomeTrack = setHomeTrack === 'true'

  if (!trackHandle) {
    redirect(ROUTES.BOOKING.LOCATION)
  }

  logger.info(
    { trackHandle, eventRocketRezId },
    'BookingHomePage: processing query params'
  )

  const rawTrack = await fetchTrackByHandle(trackHandle)

  if (!rawTrack) {
    logger.warn(
      { trackHandle },
      'BookingHomePage: track not found, redirecting to events'
    )
    redirect(ROUTES.BOOKING.LOCATION)
  }

  // Remove past events so the client only sees bookable (future) events
  const track = filterFutureEvents(rawTrack)
  const events = track.model?.events ?? []
  let event = events[0] ?? null

  if (eventRocketRezId) {
    const matchedEvent = events.find(
      (e) => e.model?.rocketRezId === eventRocketRezId
    )
    if (matchedEvent) {
      event = matchedEvent
      logger.info(
        { eventRocketRezId, eventId: matchedEvent.id },
        'BookingHomePage: matched event'
      )
    } else {
      logger.warn(
        { eventRocketRezId, availableEvents: events.length },
        'BookingHomePage: event not found, using first event'
      )
    }
  }

  logger.info(
    { trackHandle: track.config?.handle, eventId: event?.id },
    'BookingHomePage: rendering initializer'
  )

  return (
    <BookingInitializer
      track={track}
      event={event}
      setHomeTrack={shouldSetHomeTrack}
    />
  )
}
