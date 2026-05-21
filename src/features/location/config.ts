export const LOCATION_ERRORS = {
  GEOLOCATION_NOT_SUPPORTED: 'Geolocation is not supported by this browser',
  PERMISSION_DENIED: 'Location permission denied',
  POSITION_UNAVAILABLE: 'Location information unavailable',
  TIMEOUT: 'Location request timed out',
  INVALID_DATA: 'Invalid location data',
  UNKNOWN: 'Unknown error'
} as const

export const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
} as const

export const LOCATION_STORAGE_KEY = 'location-store'
export const LOG_NAMESPACE = 'location'
