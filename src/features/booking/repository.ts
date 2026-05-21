import type { EventDataFragment } from '../../core/dato/fragments/event-data.typegen'
import type { TrackDataFragment } from '../../core/dato/fragments/track-data.typegen'
import { logger } from '../../core/logger/logger'
import {
  BookingStateSchema,
  DatoEventDataFragmentSchema,
  DatoTrackDataFragmentSchema,
  PersistedBookingStateSchema
} from '../../io/schemas'
import type { BookingState, PersistedBookingState } from '../../io/types'
import { BOOKING_STORAGE_KEY, LOG_NAMESPACE } from './config'

export const initialBookingState: BookingState = {
  date_and_car: null,
  coverage_options: null,
  ride_along: null,
  media_packages: null,
  review: null,
  event: null,
  track: null,
  intendedPageId: null,
  currentPage: null,
  backNavigationFromPath: null,
  backNavigationRequestedAt: null,
  error: null,
  fieldErrors: null,
  isLoading: false
}

export type BookingRepository = {
  read: () => Promise<BookingState>
  write: (next: BookingState) => Promise<void>
  clear: () => Promise<void>
}

const safeParseJson = (raw: string): unknown => {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const isTrackDataFragment = (v: unknown): v is TrackDataFragment =>
  DatoTrackDataFragmentSchema.safeParse(v).success

const isEventDataFragment = (v: unknown): v is EventDataFragment =>
  DatoEventDataFragmentSchema.safeParse(v).success

const toPersistedState = (state: BookingState): PersistedBookingState => ({
  event: state.event,
  track: state.track,
  date_and_car: state.date_and_car,
  coverage_options: state.coverage_options,
  ride_along: state.ride_along,
  media_packages: state.media_packages,
  review: state.review,
  intendedPageId: state.intendedPageId
})

const readFromStorage = (): BookingState => {
  const raw = localStorage.getItem(BOOKING_STORAGE_KEY)

  if (!raw) {
    logger.info(
      {},
      `${LOG_NAMESPACE}: repo.read — no data in storage, returning initial state`
    )
    return initialBookingState
  }

  const parsed = safeParseJson(raw)
  const result = PersistedBookingStateSchema.safeParse(parsed)

  if (!result.success) {
    logger.warn(
      { issues: result.error.issues.map((i) => i.message) },
      `${LOG_NAMESPACE}: repo.read — invalid data in storage, resetting to initial state`
    )
    localStorage.setItem(
      BOOKING_STORAGE_KEY,
      JSON.stringify(toPersistedState(initialBookingState))
    )
    return initialBookingState
  }

  const rawTrack = result.data.track
  const rawEvent = result.data.event
  const track: TrackDataFragment | null =
    rawTrack !== null && isTrackDataFragment(rawTrack) ? rawTrack : null
  const event: EventDataFragment | null =
    rawEvent !== null && isEventDataFragment(rawEvent) ? rawEvent : null

  return {
    ...result.data,
    track,
    event,
    currentPage: null,
    backNavigationFromPath: null,
    backNavigationRequestedAt: null,
    error: null,
    fieldErrors: null,
    isLoading: false
  }
}

const writeToStorage = (state: BookingState): void => {
  const persisted = toPersistedState(state)
  const result = PersistedBookingStateSchema.safeParse(persisted)

  if (!result.success) {
    logger.warn(
      { issues: result.error.issues.map((i) => i.message) },
      `${LOG_NAMESPACE}: repo.write — validation failed, skipping write`
    )
    return
  }

  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(result.data))
  logger.info(
    { currentPage: state.currentPage },
    `${LOG_NAMESPACE}: repo.write — state persisted`
  )
}

export const bookingRepository: BookingRepository = {
  read: async () => {
    const data = readFromStorage()
    logger.info(
      { currentPage: data.currentPage },
      `${LOG_NAMESPACE}: repo.read`
    )
    return data
  },
  write: async (next) => {
    logger.info(
      { currentPage: next.currentPage },
      `${LOG_NAMESPACE}: repo.write`
    )
    writeToStorage(next)
  },
  clear: async () => {
    logger.info({}, `${LOG_NAMESPACE}: repo.clear`)
    localStorage.removeItem(BOOKING_STORAGE_KEY)
    logger.info({}, `${LOG_NAMESPACE}: repo.clear — storage removed`)
  }
}

export const validateBookingState = (state: unknown): BookingState | null => {
  const result = BookingStateSchema.safeParse(state)
  if (!result.success) {
    return null
  }

  const rawTrack = result.data.track
  const rawEvent = result.data.event
  const track: TrackDataFragment | null =
    rawTrack !== null && isTrackDataFragment(rawTrack) ? rawTrack : null
  const event: EventDataFragment | null =
    rawEvent !== null && isEventDataFragment(rawEvent) ? rawEvent : null

  return { ...result.data, track, event }
}
