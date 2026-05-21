'use client'

import { useMemo } from 'react'
import type { TrackDataFragment } from '../../core/dato/fragments/track-data.typegen'

type Track = TrackDataFragment
type Event = NonNullable<NonNullable<Track['model']>['events']>[number]

type UseTrackNextEventReturn = {
  nextEvent: Event | null
  remainingCount: number
}

export const useTrackNextEvent = (
  track: Track | null
): UseTrackNextEventReturn => {
  return useMemo(() => {
    if (!track?.model?.events || track.model.events.length === 0) {
      return {
        nextEvent: null,
        remainingCount: 0
      }
    }

    const now = new Date()
    const nowTime = now.getTime()
    const events = track.model.events

    const futureEvents = events.filter((event) => {
      if (!event?.model?.enabled) {
        return false
      }

      const eventDate = event.model?.startDate
      if (!eventDate) {
        return false
      }

      const eventDateObj = new Date(eventDate)
      if (Number.isNaN(eventDateObj.getTime())) {
        return false
      }

      return eventDateObj.getTime() > nowTime
    })

    if (futureEvents.length === 0) {
      return {
        nextEvent: null,
        remainingCount: 0
      }
    }

    const sortedEvents = [...futureEvents].sort((a, b) => {
      const dateA = a.model?.startDate
        ? new Date(a.model.startDate).getTime()
        : Number.POSITIVE_INFINITY
      const dateB = b.model?.startDate
        ? new Date(b.model.startDate).getTime()
        : Number.POSITIVE_INFINITY
      return dateA - dateB
    })

    const nextEvent = sortedEvents[0] ?? null
    const remainingCount = sortedEvents.length - 1

    return {
      nextEvent,
      remainingCount
    }
  }, [track])
}
