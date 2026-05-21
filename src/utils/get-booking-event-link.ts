import { ROUTES } from '../config/routes'
import type { EventDataFragment } from '../core/dato/fragments/event-data.typegen'
import { locationRepository } from '../features/location'

const formatDateString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getTomorrowDate = (): string => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return formatDateString(tomorrow)
}

const getTrackTitle = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const state = locationRepository.read()
    return state.track?.model?.title ?? null
  } catch {
    // Silently fail if repository access fails
  }

  return null
}

export type BookingLinkEventModel = {
  rocketRezId?: string | null
  rocketRezType?: string | null
  rocketRezRootId?: string | null
  startDate?: string | null
  endDate?: string | null
  track?: {
    model?: {
      title?: string | null
      nickname?: string | null
      location?: {
        latitude?: number | null
        longitude?: number | null
      } | null
    } | null
  } | null
}

export type BookingLinkTrackModel = {
  nickname?: string | null
  title?: string | null
  startDate?: string | null
  endDate?: string | null
}

export type BookingLinkSupercarModel = {
  rocketRezId?: string | null
}

export const getBookingLink = (): string => {
  const queryParams = new URLSearchParams()
  const trackTitle = getTrackTitle()
  if (trackTitle) {
    queryParams.set('track', trackTitle)
  }
  queryParams.set('startDate', getTomorrowDate())
  const queryString = queryParams.toString()
  return `${ROUTES.BOOKING.HOME}${queryString ? `?${queryString}` : ''}`
}

export const getEventBookingLink = (
  event: BookingLinkEventModel | null
): string => {
  if (!event) {
    return getBookingLink()
  }

  const queryParams = new URLSearchParams()
  if (event.rocketRezId) {
    queryParams.set('id', event.rocketRezId)
  }

  if (event.track?.model?.nickname) {
    queryParams.set('track', event.track.model.nickname)
  }

  const effectiveStartDate = event.startDate ?? getTomorrowDate()
  queryParams.set('startDate', effectiveStartDate)

  if (event.endDate) {
    queryParams.set('endDate', event.endDate)
  }

  const queryString = queryParams.toString()
  return `${ROUTES.BOOKING.HOME}${queryString ? `?${queryString}` : ''}`
}

export const getTrackBookingLink = (
  track: BookingLinkTrackModel | null
): string => {
  if (!track) {
    return getBookingLink()
  }

  const queryParams = new URLSearchParams()

  if (track.nickname) {
    queryParams.set('track', track.nickname)
  }

  const effectiveStartDate = track.startDate ?? getTomorrowDate()
  queryParams.set('startDate', effectiveStartDate)

  if (track.endDate) {
    queryParams.set('endDate', track.endDate)
  }

  const queryString = queryParams.toString()
  return `${ROUTES.BOOKING.HOME}${queryString ? `?${queryString}` : ''}`
}

export const getSupercarBookingLink = (
  supercar: BookingLinkSupercarModel | null
): string => {
  if (!supercar) {
    return getBookingLink()
  }

  const queryParams = new URLSearchParams()

  if (supercar.rocketRezId) {
    queryParams.set('supercar', supercar.rocketRezId)
  }

  queryParams.set('startDate', getTomorrowDate())

  const queryString = queryParams.toString()
  return `${ROUTES.BOOKING.HOME}${queryString ? `?${queryString}` : ''}`
}

export const getLegacyEventBookingLink = (
  event: EventDataFragment | null
): string => {
  const rocketRezRootId = event?.model?.rocketRezRootId
  const startDate = event?.model?.startDate
  const endDate = event?.model?.endDate

  if (!rocketRezRootId || !startDate || !endDate) {
    return ROUTES.FRONTEND.EVENTS.LISTING
  }

  const queryParams = new URLSearchParams()
  queryParams.set('root', rocketRezRootId)
  queryParams.set('startDate', startDate)
  queryParams.set('endDate', endDate)
  const queryString = queryParams.toString()

  return `${ROUTES.BOOKING.LEGACY}${queryString ? `?${queryString}` : ''}`
}
