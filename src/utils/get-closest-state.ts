import { distance } from '@turf/distance'
import statesData from '../config/states.json'
import type { UsState } from '../io/types'

/**
 * Find the closest US state to a given latitude/longitude coordinate.
 * Uses Turf.js distance calculation for accuracy.
 */
export const getClosestState = (
  latitude: number,
  longitude: number
): UsState | null => {
  if (!statesData.length) {
    return null
  }

  let closestState: UsState | null = null
  let closestDistance = Number.POSITIVE_INFINITY

  const userCoords: [number, number] = [longitude, latitude]

  for (const state of statesData) {
    const stateCoords: [number, number] = [state.long, state.lat]
    const dist = distance(userCoords, stateCoords, { units: 'kilometers' })

    if (dist < closestDistance) {
      closestDistance = dist
      closestState = state
    }
  }

  return closestState
}
