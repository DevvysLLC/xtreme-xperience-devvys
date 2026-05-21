'use client'

import { useMemo } from 'react'
import statesData from '../../config/states.json'
import type { UsState } from '../../io/types'
import { hasAllTracks } from './config'
import { useTracks } from './use-tracks'

export const useTracksStates = (): UsState[] => {
  const { data: tracksData } = useTracks()

  const availableStates = useMemo(() => {
    if (!tracksData || !hasAllTracks(tracksData)) {
      return []
    }

    const trackStateNames = new Set<string>()
    tracksData.allTracks.forEach((track) => {
      const stateName = track.model?.state
      if (stateName && typeof stateName === 'string') {
        trackStateNames.add(stateName.trim())
      }
    })

    return statesData.filter((state) => {
      const normalizedStateLabel = state.label.trim()
      return Array.from(trackStateNames).some(
        (trackStateName) =>
          normalizedStateLabel.toLowerCase() === trackStateName.toLowerCase()
      )
    })
  }, [tracksData])

  return availableStates
}
