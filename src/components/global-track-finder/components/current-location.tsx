'use client'

import { logger } from '../../../core/logger/logger'
import { useBookingClear } from '../../../features/booking'
import { useLocation, useLocationClear } from '../../../features/location'
import { CoreIcon } from '../../core-icon'
import { useTrackFinderDrawer } from '../context/drawer-context'
import styles from '../style.module.scss'

export const CurrentLocation = () => {
  const { data: location } = useLocation()
  const clearLocation = useLocationClear()
  const clearBooking = useBookingClear()
  const { setSearchQuery } = useTrackFinderDrawer()

  const isPending = clearLocation.isPending || clearBooking.isPending

  const handleClearLocation = async () => {
    try {
      await clearLocation.mutateAsync()
      await clearBooking.mutateAsync()
      setSearchQuery('')
    } catch (error) {
      logger.error({ error }, 'current-location.handleClearLocation.error')
    }
  }

  if (!location?.label) {
    return null
  }

  return (
    <div className={styles.currentLocation}>
      <span className={styles.currentLocation__label}>{location.label}</span>
      <button
        type="button"
        className={styles.currentLocation__action}
        onClick={handleClearLocation}
        disabled={isPending}
      >
        <CoreIcon icon="close" />
      </button>
    </div>
  )
}
