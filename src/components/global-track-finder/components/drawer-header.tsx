'use client'

import styles from '../style.module.scss'
import { TrackFinderDrawerActions } from './drawer-actions'
import { TrackFinderDrawerSearchBar } from './drawer-search-bar'

export const TrackFinderDrawerHeader = () => {
  return (
    <div className={styles.drawer__header}>
      <TrackFinderDrawerSearchBar />
      <TrackFinderDrawerActions />
    </div>
  )
}
