'use client'

import { useCallback } from 'react'
import { useLocation, useLocationSearchLabel } from '../../../features/location'
import { useTrackFinderDrawer } from '../context/drawer-context'
import styles from '../style.module.scss'
import { CurrentLocation } from './current-location'
import { StatesList } from './states-list'
import { TracksList } from './tracks-list'

export const TrackFinderDrawerContent = () => {
  const { data: location } = useLocation()
  const { searchQuery, setSearchQuery } = useTrackFinderDrawer()

  // Sync drawer search query when the derived location label changes
  const handleLabelChange = useCallback(
    (label: string) => {
      setSearchQuery(label)
    },
    [setSearchQuery]
  )
  useLocationSearchLabel(handleLabelChange)

  const hasCoordinates = Boolean(location?.latitude && location?.longitude)
  const hasHomeTrack = Boolean(location?.track)
  const hasSearchQuery = Boolean(searchQuery.trim())
  const showTracksList = hasCoordinates || hasHomeTrack || hasSearchQuery

  if (showTracksList) {
    return (
      <>
        {location?.label && (
          <div className={styles.drawer__location}>
            <CurrentLocation />
          </div>
        )}

        <div className={styles.drawer__tracks}>
          <TracksList />
        </div>
      </>
    )
  }

  return (
    <div className={styles.drawer__states}>
      <StatesList />
    </div>
  )
}
