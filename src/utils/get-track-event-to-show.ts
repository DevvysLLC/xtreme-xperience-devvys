import type { TrackModelFragment } from '../core/dato/fragments/track-model.typegen'

type ResolvedEvent =
  | TrackModelFragment['featuredEvent']
  | TrackModelFragment['events'][number]
  | null

type Result = {
  eventToShow: ResolvedEvent
  remainingCount: number
}

// Selects the single event to surface in track UI:
// - the featured event when it is enabled and has a start date
// - otherwise the next upcoming (soonest) enabled event with a start date
export const getTrackEventToShow = (
  featuredEvent: TrackModelFragment['featuredEvent'] | null | undefined,
  events: TrackModelFragment['events'] | null | undefined
): Result => {
  const enabledEvents = (events ?? []).filter((event) => event.model?.enabled)

  const eventsWithDates = enabledEvents.filter(
    (event) => event.model?.startDate != null
  )

  const soonestEvent =
    eventsWithDates.length > 0
      ? eventsWithDates.reduce((soonest, current) => {
          const soonestDate = soonest.model?.startDate
          const currentDate = current.model?.startDate

          if (!soonestDate) {
            return current
          }
          if (!currentDate) {
            return soonest
          }

          return new Date(currentDate) < new Date(soonestDate)
            ? current
            : soonest
        })
      : null

  const hasValidFeaturedEvent =
    featuredEvent?.model?.enabled && featuredEvent.model?.startDate != null

  if (hasValidFeaturedEvent) {
    const isFeaturedEventInEvents = eventsWithDates.some(
      (event) => event.id === featuredEvent.id
    )

    return {
      eventToShow: featuredEvent,
      remainingCount: isFeaturedEventInEvents
        ? eventsWithDates.length - 1
        : eventsWithDates.length
    }
  }

  if (soonestEvent) {
    return {
      eventToShow: soonestEvent,
      remainingCount: eventsWithDates.length - 1
    }
  }

  return { eventToShow: null, remainingCount: 0 }
}
