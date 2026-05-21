'use client'

import { useMemo } from 'react'
import type { EventDataFragment } from '../../core/dato/fragments/event-data.typegen'
import { hasAllTracks } from './config'
import { useTracks } from './use-tracks'

type UseTrackEventsReturn = {
  events: EventDataFragment[]
  isLoading: boolean
  error: Error | null
}

export const useTrackEvents = (
  trackNickname: string | null | undefined
): UseTrackEventsReturn => {
  const { data, isLoading, error } = useTracks()

  const events = useMemo(() => {
    if (!data || !trackNickname) {
      return []
    }

    if (!hasAllTracks(data)) {
      return []
    }

    // Find the track by nickname
    const track = data.allTracks.find(
      (t) => t.model?.nickname === trackNickname
    )

    if (!track?.model?.events) {
      return []
    }

    // Filter to only enabled events and sort by start date
    return track.model.events
      .filter((event) => event.model?.enabled)
      .sort((a, b) => {
        if (!a.model?.startDate) {
          return 1
        }
        if (!b.model?.startDate) {
          return -1
        }
        return (
          new Date(a.model.startDate).getTime() -
          new Date(b.model.startDate).getTime()
        )
      })
  }, [data, trackNickname])

  return {
    events,
    isLoading,
    error: error ?? null
  }
}
