import clsx from 'clsx'
import type { FC } from 'react'
import { CoreLoadingSpinner } from '../core-loading-spinner'
import styles from './style.module.scss'

type Props = {
  className?: string
}

export const CoreLoadingSection: FC<Props> = ({ className }) => (
  <div className={clsx(styles.section, className)} aria-busy="true">
    <CoreLoadingSpinner showLabel={false} aspectRatio="1/1" />
  </div>
)
