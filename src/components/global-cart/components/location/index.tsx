'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import type { TrackDataFragment } from '../../../../core/dato/fragments/track-data.typegen'
import styles from './style.module.scss'

type Props = {
  className?: string
  track: TrackDataFragment | null
}

export const CartLocation: FC<Props> = ({ className, track }) => {
  const t = useTranslations('global_cart')

  return (
    <div className={clsx(styles.location, className)}>
      <h3 className={styles.location__title}>{t('location.title')}</h3>

      <p className={styles.location__description}>
        {track?.model?.nickname && (
          <>
            {track?.model?.nickname}
            <br />
          </>
        )}
        {track?.model?.title}
      </p>
    </div>
  )
}
