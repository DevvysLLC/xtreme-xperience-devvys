import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { CoreIcon } from '../core-icon'
import styles from './style.module.scss'

export type Props = {
  rating: number
  sizeType?: 'default' | 'small'
  className?: string
}

const roundUpToQuarter = (value: number): number => {
  return Math.ceil(value * 4) / 4
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

export const CoreRating: FC<Props> = ({ rating, sizeType = 'default' }) => {
  const t = useTranslations('core_rating')
  const clampedRating = clamp(rating, 1, 5)
  const roundedRating = roundUpToQuarter(clampedRating)
  const stars = []

  for (let i = 1; i <= 5; i++) {
    const starValue = roundedRating - (i - 1)

    if (starValue >= 1) {
      stars.push(<CoreIcon key={i} icon="star-full" />)
    } else if (starValue >= 0.5) {
      stars.push(<CoreIcon key={i} icon="star-half" />)
    } else {
      stars.push(
        <span key={i} className={styles.emptyStar}>
          <CoreIcon icon="star-empty" />
        </span>
      )
    }
  }

  return (
    <div
      className={clsx(styles.rating, styles[`rating--${sizeType}`])}
      aria-label={t('rating', { rating: roundedRating })}
    >
      {stars}
    </div>
  )
}
