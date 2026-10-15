'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import type { TrackDataFragment } from '../../../../core/dato/fragments/track-data.typegen'
import styles from './style.module.scss'

type TrackLike = {
  config?: { title?: string | null } | null
  model?: {
    nickname?: string | null
    title?: string | null
    state?: string | null
    city?: string | null
    region?: string | null
  } | null
}

type Props = {
  className?: string
  track: TrackDataFragment | TrackLike | null | undefined
}

export const CartLocation: FC<Props> = ({ className, track }) => {
  const t = useTranslations('global_cart')

  if (!track) {
    return null
  }

  const trackName =
    track.model?.nickname || track.model?.title || track.config?.title || ''
  const state = track.model?.state
  const city = track.model?.city
  const locationSub =
    state && city
      ? `${state} (${city})`
      : [state, city].filter(Boolean).join(', ') || track.model?.region || ''

  if (!trackName && !locationSub) {
    return null
  }

  return (
    <div className={clsx(styles.location, className)}>
      <h3 className={styles.location__title}>{t('location.title')}:</h3>

      <div className={styles.location__description}>
        {trackName && (
          <strong className={styles.location__name}>{trackName}</strong>
        )}
        {locationSub && (
          <span className={styles.location__sub}>{locationSub}</span>
        )}
      </div>
    </div>
  )
}
