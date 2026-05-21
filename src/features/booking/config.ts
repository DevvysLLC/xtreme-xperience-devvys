import type { BookingConfigFragment } from '../../core/dato/fragments/booking-config.typegen'

export const LOG_NAMESPACE = 'booking'

export const BOOKING_STORAGE_KEY = 'booking-store'

export const BOOKING_STEPS = [
  'location',
  'choose_date_and_car',
  'coverage_options',
  'ride_along',
  'media_packages',
  'review'
] as const

export type EventsQueryParams = {
  location?: string
  name?: string
  startDate?: string
  endDate?: string
  pageSize?: number
  pageIndex?: number
}

export type RetailProductsQueryParams = {
  pageSize?: number
  pageIndex?: number
}

export type AddonsQueryParams = {
  pageSize?: number
  pageIndex?: number
  type?: string
}

export const BOOKING_QUERY_KEYS = {
  all: ['booking'] as const,

  config: {
    all: ['booking', 'config'] as const
  },

  events: {
    all: ['booking', 'events'] as const,
    list: (params?: EventsQueryParams) =>
      ['booking', 'events', 'list', params ?? {}] as const,
    byLocation: (
      location: string,
      params?: Omit<EventsQueryParams, 'location'>
    ) => ['booking', 'events', 'location', location, params ?? {}] as const,
    byGroupNames: (
      groupNames: string[],
      params?: Omit<EventsQueryParams, 'name'>
    ) =>
      [
        'booking',
        'events',
        'groups',
        groupNames.join(','),
        params ?? {}
      ] as const,
    detail: (id: number) => ['booking', 'events', 'detail', id] as const,
    schedules: (id: number) => ['booking', 'events', 'schedules', id] as const
  },

  insurance: {
    all: ['booking', 'insurance'] as const,
    list: (params?: RetailProductsQueryParams) =>
      ['booking', 'insurance', 'list', params ?? {}] as const
  },

  addons: {
    all: ['booking', 'addons'] as const,
    list: (params?: AddonsQueryParams) =>
      ['booking', 'addons', 'list', params ?? {}] as const
  },

  media: {
    all: ['booking', 'media'] as const,
    list: (params?: RetailProductsQueryParams) =>
      ['booking', 'media', 'list', params ?? {}] as const
  },

  rideAlong: {
    all: ['booking', 'ride-along'] as const,
    list: (params?: RetailProductsQueryParams) =>
      ['booking', 'ride-along', 'list', params ?? {}] as const
  },

  tracks: {
    all: ['booking', 'tracks'] as const,
    detail: (handle: string) => ['booking', 'tracks', 'detail', handle] as const
  }
} as const

export const BOOKING_ERRORS = {
  FETCH_ADDONS: 'Failed to fetch addons',
  FETCH_CONFIG: 'Failed to fetch booking config',
  FETCH_INSURANCE: 'Failed to fetch insurance products',
  FETCH_MEDIA: 'Failed to fetch media products',
  FETCH_RIDE_ALONG: 'Failed to fetch ride-along products',
  FETCH_EVENTS: 'Failed to fetch events',
  FETCH_EVENT_DETAIL: 'Failed to fetch event details',
  FETCH_EVENT_SCHEDULES: 'Failed to fetch event schedules',
  FETCH_EVENTS_BY_LOCATION: 'Failed to fetch events by location',
  FETCH_EVENTS_BY_GROUP_NAMES: 'Failed to fetch events by group names',
  INVALID_RESPONSE: 'Invalid response format'
} as const

export const DEFAULT_RETRY_CONFIG = {
  retry: 3,
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000)
} as const

export const hasBookingConfig = (
  data: unknown
): data is BookingConfigFragment | { config: BookingConfigFragment } => {
  if (!data || typeof data !== 'object') {
    return false
  }

  if ('pages' in data || 'supercars' in data) {
    return true
  }

  if ('config' in data && data.config && typeof data.config === 'object') {
    return true
  }

  return false
}
