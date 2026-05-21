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
        backgroundColor: data?.backgroundColor?.hex || backgroundColor,
        color: data?.color?.hex || color
      }}
    >
      <span
        className={styles.label}
        style={{ color: data?.color?.hex || color }}
      >
        {data?.label || label}
      </span>
    </span>
  )
}
