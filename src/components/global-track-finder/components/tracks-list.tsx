'use client'

import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { useTracksSortedByDistance } from '../../../features/tracks'
import { CoreLoadingSpinner } from '../../core-loading-spinner'
import { useTrackFinderDrawer } from '../context/drawer-context'
import styles from '../style.module.scss'
import { TrackCard } from './track-card'

export const TracksList: FC = () => {
  const t = useTranslations('track_finder.tracks_list')
  const { searchQuery } = useTrackFinderDrawer()
  const {
    data: tracksSortedByDistance,
    isLoading,
    isError,
    isGeocoding
  } = useTracksSortedByDistance({ searchQuery })

  if (isLoading || isGeocoding) {
    return (
      <div className={styles.tracksList}>
        <CoreLoadingSpinner />
      </div>
    )
  }

  if (isError) {
    return <div className={styles.tracksList}>{t('error')}</div>
  }

  if (!tracksSortedByDistance?.length || tracksSortedByDistance.length === 0) {
    return <div className={styles.tracksList}>{t('no_tracks')}</div>
  }

  return (
    <div className={styles.tracks}>
      {isLoading ? (
        <CoreLoadingSpinner />
      ) : (
        <ul className={styles.tracks__list}>
          {tracksSortedByDistance.map((track) => (
            <li key={track.track.id} className={styles.tracks__item}>
              <TrackCard
                data={track.track}
                isNearestTrack={track.isNearestTrack ?? false}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
