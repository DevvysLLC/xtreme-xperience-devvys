'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import styles from './style.module.scss'

type AspectRatio = '1/1' | '16/9' | '2/1' | '4/1'

type Props = {
  label?: string
  showLabel?: boolean
  aspectRatio?: AspectRatio
  className?: string
}

export const CoreLoadingSpinner: FC<Props> = ({
  label,
  showLabel = true,
  aspectRatio = '16/9',
  className
}) => {
  const t = useTranslations('core_loading_spinner')
  const displayLabel = label ?? t('label')

  return (
    <div
      className={clsx(
        styles.spinner,
        styles[`spinner--${aspectRatio.replace('/', '-')}`],
        className
      )}
    >
      <div className={styles.spinner__icon} />
      {showLabel && (
        <span className={styles.spinner__label}>{displayLabel}</span>
      )}
    </div>
  )
}
