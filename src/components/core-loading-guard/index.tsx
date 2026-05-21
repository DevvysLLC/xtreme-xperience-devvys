'use client'

import type { FC } from 'react'
import { CoreLoadingSpinner } from '../core-loading-spinner'
import styles from './style.module.scss'

export const CoreLoadingGuard: FC = () => {
  return (
    <div className={styles.overlay}>
      <CoreLoadingSpinner />
    </div>
  )
}
