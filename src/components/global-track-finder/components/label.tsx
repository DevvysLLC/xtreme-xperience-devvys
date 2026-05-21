'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { DRAWER_REQUEST_OPEN_MESSAGE_NAME } from '../../../core/messaging/main/messages/open-drawer'
import { useMainBus } from '../../../core/messaging/main/react'
import { useLocation } from '../../../features/location'
import { CoreIcon } from '../../core-icon'
import styles from '../style.module.scss'

const DRAWER_ID = 'track-finder-drawer'

export const TrackFinderLabel = () => {
  const t = useTranslations('track_finder.label')
  const { data: location } = useLocation()
  const bus = useMainBus(DRAWER_REQUEST_OPEN_MESSAGE_NAME, () => {})

  const handleClick = () => {
    bus.send({
      name: DRAWER_REQUEST_OPEN_MESSAGE_NAME,
      details: { id: DRAWER_ID }
    })
  }

  const displayLabel = location?.track?.config?.title || t('fallback')
  const hasLocation = !!location?.track

  return (
    <button
      type="button"
      className={styles.label}
      onClick={handleClick}
      aria-label={t('aria.open_track_finder', { track: displayLabel })}
    >
      <span className={styles.label__icon} aria-hidden="true">
        <CoreIcon icon="location" />
      </span>

      <span className={styles.label__text}>
        <span className={styles.label__text__primary}>{displayLabel}</span>
        {hasLocation && (
          <span className={styles.label__text__secondary}>
            {t('change_location')}
          </span>
        )}
      </span>

      <span
        className={clsx(styles.label__icon, styles['label__icon--dropdown'])}
        aria-hidden="true"
      >
        <CoreIcon icon="chevron-down" />
      </span>
    </button>
  )
}
