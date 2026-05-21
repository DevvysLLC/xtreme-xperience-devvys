'use client'

import { logger } from '../../../core/logger/logger'
import { useLocationSetLocation } from '../../../features/location'
import { useTracksStates } from '../../../features/tracks'
import type { UsState } from '../../../io/types'
import { useTrackFinderDrawer } from '../context/drawer-context'
import styles from '../style.module.scss'

export const StatesList = () => {
  const { setHasSelectedLocation } = useTrackFinderDrawer()
  const updateLocation = useLocationSetLocation()
  const states = useTracksStates()

  const handleStateClick = async (state: UsState) => {
    try {
      await updateLocation.mutateAsync({
        latitude: state.lat,
        longitude: state.long,
        label: state.label
      })
      setHasSelectedLocation(true)
    } catch (error) {
      logger.error({ error, state }, 'states-list.handleStateClick.error')
    }
  }

  return (
    <div className={styles.states}>
      <ul className={styles.states__list}>
        {states.map((state) => (
          <li key={state.id} className={styles.states__item}>
            <button
              type="button"
              onClick={() => handleStateClick(state)}
              className={styles.states__button}
            >
              {state.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
