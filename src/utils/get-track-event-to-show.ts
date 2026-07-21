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
// - Prefers available (non-sold-out) enabled events with a start date.
// - If featured event is enabled and NOT sold out, uses featured event.
// - Otherwise picks the soonest upcoming non-sold-out enabled event.
// - Fallback: if all events are sold out, uses the featured event or soonest upcoming event.
export const getTrackEventToShow = (
  featuredEvent: TrackModelFragment['featuredEvent'] | null | undefined,
  events: TrackModelFragment['events'] | null | undefined
): Result => {
  const enabledEvents = (events ?? []).filter(
    (event) => event.model?.enabled && event.model?.startDate != null
  )

  const availableEvents = enabledEvents.filter(
    (event) => !event.model?.soldOut
  )

  const getSoonestEvent = (list: typeof enabledEvents) => {
    if (list.length === 0) return null
    return list.reduce((soonest, current) => {
      const soonestDate = soonest.model?.startDate
      const currentDate = current.model?.startDate

      if (!soonestDate) return current
      if (!currentDate) return soonest

      return new Date(currentDate) < new Date(soonestDate) ? current : soonest
    })
  }

  // If there are available (non-sold-out) events, select from available pool
  if (availableEvents.length > 0) {
    const isFeaturedAvailable =
      featuredEvent?.model?.enabled &&
      featuredEvent.model?.startDate != null &&
      !featuredEvent.model?.soldOut

    if (isFeaturedAvailable && featuredEvent) {
      const isFeaturedInEvents = availableEvents.some(
        (event) => event.id === featuredEvent.id
      )
      return {
        eventToShow: featuredEvent,
        remainingCount: isFeaturedInEvents
          ? availableEvents.length - 1
          : availableEvents.length
      }
    }

    const soonestAvailable = getSoonestEvent(availableEvents)
    if (soonestAvailable) {
      return {
        eventToShow: soonestAvailable,
        remainingCount: availableEvents.length - 1
      }
    }
  }

  // Fallback: All events are sold out, surface featured/soonest event as fallback
  const hasValidFeaturedEvent =
    featuredEvent?.model?.enabled && featuredEvent.model?.startDate != null

  if (hasValidFeaturedEvent && featuredEvent) {
    const isFeaturedEventInEvents = enabledEvents.some(
      (event) => event.id === featuredEvent.id
    )

    return {
      eventToShow: featuredEvent,
      remainingCount: isFeaturedEventInEvents
        ? enabledEvents.length - 1
        : enabledEvents.length
    }
  }

  const soonestEvent = getSoonestEvent(enabledEvents)
  if (soonestEvent) {
    return {
      eventToShow: soonestEvent,
      remainingCount: enabledEvents.length - 1
    }
  }

  return { eventToShow: null, remainingCount: 0 }
}
