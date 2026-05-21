'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ROUTES } from '../../../config/routes'
import { BookingLocationCta } from '../../booking-location-cta'
import { CoreIcon } from '../../core-icon'
import styles from '../style.module.scss'

export const TrackFinderDrawerActions = () => {
  const t = useTranslations('track_finder.drawer')

  return (
    <div className={styles.drawer__actions}>
      <BookingLocationCta className={styles.action} />

      <Link href={ROUTES.BOOKING.LOCATION} className={styles.action}>
        <span className={styles.action__icon}>
          <CoreIcon icon="map" />
        </span>
        <span className={styles.action__label}>{t('view_map')}</span>
      </Link>
    </div>
  )
}
