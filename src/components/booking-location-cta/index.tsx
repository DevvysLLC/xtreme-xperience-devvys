'use client'

import { useIsMutating } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { logger } from '../../core/logger/logger'
import { BOOKING_CLEAR_MUTATION_KEY } from '../../features/booking'
import {
  LOCATION_CLEAR_MUTATION_KEY,
  useLocation,
  useLocationClear,
  useLocationSetBrowser
} from '../../features/location'
import { CoreIcon } from '../core-icon'
import styles from './style.module.scss'

type Props = {
  className?: string
}

export const BookingLocationCta: FC<Props> = ({ className }) => {
  const t = useTranslations('booking_location_cta')
  const { data: location } = useLocation()
  const browserLocation = useLocationSetBrowser()
  const clearLocation = useLocationClear()
  const hasLocation = Boolean(location?.latitude && location?.longitude)
  const isClearingLocation = useIsMutating({
    mutationKey: LOCATION_CLEAR_MUTATION_KEY
  })
  const isClearingBooking = useIsMutating({
    mutationKey: BOOKING_CLEAR_MUTATION_KEY
  })
  const isPending =
    browserLocation.isPending ||
    clearLocation.isPending ||
    isClearingLocation > 0 ||
    isClearingBooking > 0

  const handleClick = async () => {
    try {
      if (hasLocation) {
        await clearLocation.mutateAsync()
      } else {
        await browserLocation.mutateAsync()
      }
    } catch (error) {
      logger.error(
        { error, hasLocation },
        'booking-location-cta.handleClick.error'
      )
    }
  }

  return (
    <button
      type="button"
      className={className ?? styles.action}
      onClick={handleClick}
      disabled={isPending}
    >
      <span className={styles.action__icon}>
        <CoreIcon icon="location-solid" />
      </span>
      <span className={styles.action__label}>
        {hasLocation ? t('clear_my_location') : t('find_my_location')}
      </span>
    </button>
  )
}
