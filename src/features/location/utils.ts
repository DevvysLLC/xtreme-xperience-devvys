import { logger } from '../../core/logger/logger'
import { LocationInputSchema } from '../../io/schemas'
import type { LocationInput, LocationState } from '../../io/types'
import { getClosestState } from '../../utils/get-closest-state'
import { GEOLOCATION_OPTIONS, LOCATION_ERRORS } from './config'

export const getBrowserLocation = (): Promise<LocationInput> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      const error = new Error(LOCATION_ERRORS.GEOLOCATION_NOT_SUPPORTED)
      logger.error({ error }, 'location: getBrowserLocation.notSupported')
      reject(error)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const result = LocationInputSchema.safeParse({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        })

        if (!result.success) {
          const error = new Error(
            `${LOCATION_ERRORS.INVALID_DATA}: ${result.error.issues.map((issue) => issue.message).join(', ')}`
          )
          logger.error(
            { error, position },
            'location: getBrowserLocation.invalidData'
          )
          reject(error)
          return
        }

        logger.info(
          { location: result.data },
          'location: getBrowserLocation.success'
        )
        resolve(result.data)
      },
      (error) => {
        let errorMessage: string
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = LOCATION_ERRORS.PERMISSION_DENIED
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = LOCATION_ERRORS.POSITION_UNAVAILABLE
            break
          case error.TIMEOUT:
            errorMessage = LOCATION_ERRORS.TIMEOUT
            break
          default:
            errorMessage = LOCATION_ERRORS.UNKNOWN
        }
        const locationError = new Error(errorMessage)
        logger.error(
          { error: locationError, geolocationError: error },
          'location: getBrowserLocation.error'
        )
        reject(locationError)
      },
      GEOLOCATION_OPTIONS
    )
  })
}

export const deriveSearchLabel = (
  location: LocationState | undefined
): string => {
  const trackName = location?.track?.model?.nickname
  if (trackName) {
    return trackName
  }

  const lat = location?.latitude
  const lng = location?.longitude
  if (lat && lng) {
    return getClosestState(lat, lng)?.label ?? ''
  }

  return ''
}
