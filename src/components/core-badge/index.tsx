import clsx from 'clsx'
import type { FC } from 'react'
import type { CoreBadgeFragment } from './core-badge.typegen'
import styles from './style.module.scss'

export type Props = {
  data?: CoreBadgeFragment
  label?: string
  backgroundColor?: string
  color?: string
  className?: string
}

export const CoreBadge: FC<Props> = ({
  data,
  label,
  backgroundColor,
  color,
  className
}) => {
  return (
    <span
      className={clsx(styles.root, className)}
      style={{
        backgroundColor: backgroundColor || data?.backgroundColor?.hex,
        color: color || data?.color?.hex
      }}
    >
      <span
        className={styles.label}
        style={{ color: color || data?.color?.hex }}
      >
        {label || data?.label}
      </span>
    </span>
  )
}
