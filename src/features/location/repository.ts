import type { TrackDataFragment } from '../../core/dato/fragments/track-data.typegen'
import { logger } from '../../core/logger/logger'
import {
  DatoTrackDataFragmentSchema,
  LocationInputSchema,
  PersistedLocationStateSchema
} from '../../io/schemas'
import type {
  LocationInput,
  LocationState,
  PersistedLocationState
} from '../../io/types'
import { LOCATION_STORAGE_KEY, LOG_NAMESPACE } from './config'

const isTrackDataFragment = (v: unknown): v is TrackDataFragment =>
  DatoTrackDataFragmentSchema.safeParse(v).success

export const initialLocationState: LocationState = {
  latitude: null,
  longitude: null,
  accuracy: null,
  timestamp: null,
  label: null,
  track: null,
  error: null,
  isLoading: false
}

const safeParseJson = (raw: string): unknown => {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const toPersistedState = (state: LocationState): PersistedLocationState => ({
  latitude: state.latitude,
  longitude: state.longitude,
  accuracy: state.accuracy,
  timestamp: state.timestamp,
  label: state.label,
  track: state.track
})

const readFromStorage = (): LocationState => {
  const raw = localStorage.getItem(LOCATION_STORAGE_KEY)

  if (!raw) {
    logger.info(
      {},
      `${LOG_NAMESPACE}: repo.read — no data in storage, returning initial state`
    )
    return initialLocationState
  }

  const parsed = safeParseJson(raw)
  const result = PersistedLocationStateSchema.safeParse(parsed)

  if (!result.success) {
    logger.warn(
      { issues: result.error.issues },
      `${LOG_NAMESPACE}: repo.read — invalid data in storage, resetting to initial state`
    )
    localStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify(toPersistedState(initialLocationState))
    )
    return initialLocationState
  }

  const rawTrack = result.data.track
  const track: TrackDataFragment | null =
    rawTrack !== null && isTrackDataFragment(rawTrack) ? rawTrack : null

  return {
    ...result.data,
    track,
    error: null,
    isLoading: false
  }
}

const writeToStorage = (state: LocationState): void => {
  const persisted = toPersistedState(state)
  const result = PersistedLocationStateSchema.safeParse(persisted)

  if (!result.success) {
    logger.warn(
      { issues: result.error.issues },
      `${LOG_NAMESPACE}: repo.write — validation failed, skipping write`
    )
    return
  }

  localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(result.data))
  logger.info(
    {
      hasCoordinates: !!(result.data.latitude && result.data.longitude),
      hasTrack: !!result.data.track,
      label: result.data.label
    },
    `${LOG_NAMESPACE}: repo.write — state persisted`
  )
}

export type LocationRepository = {
  read: () => LocationState
  write: (next: LocationState) => void
  clear: () => void
}

export const locationRepository: LocationRepository = {
  read: () => {
    const data = readFromStorage()
    logger.info(
      {
        hasCoordinates: !!(data.latitude && data.longitude),
        hasTrack: !!data.track,
        label: data.label
      },
      `${LOG_NAMESPACE}: repo.read`
    )
    return data
  },
  write: (next) => {
    logger.info(
      {
        hasCoordinates: !!(next.latitude && next.longitude),
        hasTrack: !!next.track,
        label: next.label
      },
      `${LOG_NAMESPACE}: repo.write`
    )
    writeToStorage(next)
  },
  clear: () => {
    logger.info({}, `${LOG_NAMESPACE}: repo.clear`)
    localStorage.removeItem(LOCATION_STORAGE_KEY)
    logger.info({}, `${LOG_NAMESPACE}: repo.clear — storage removed`)
  }
}

export const applyLocationInput = (
  base: LocationState,
  input: LocationInput
): LocationState => {
  const result = LocationInputSchema.safeParse(input)
  if (!result.success) {
    logger.warn(
      { issues: result.error.issues },
      `${LOG_NAMESPACE}: applyLocationInput — validation failed`
    )
    return {
      ...base,
      error: `Invalid location data: ${result.error.issues.map((i) => i.message).join(', ')}`
    }
  }

  return {
    ...base,
    latitude: result.data.latitude,
    longitude: result.data.longitude,
    accuracy: result.data.accuracy ?? null,
    timestamp: Date.now(),
    label: result.data.label ?? null,
    error: null
  }
}

export const applyTrack = (
  base: LocationState,
  track: TrackDataFragment
): LocationState => ({
  ...base,
  track,
  label: track.model?.state ?? null
})

export const applyClearTrack = (base: LocationState): LocationState => ({
  ...base,
  track: null
})
