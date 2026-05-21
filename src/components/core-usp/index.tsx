import clsx from 'clsx'
import type { FC } from 'react'
import { CoreIcon } from '../core-icon'
import type { CoreUspFragment } from './core-usp.typegen'
import styles from './style.module.scss'

export type Props = {
  data: CoreUspFragment
}

export const CoreUsp: FC<Props> = ({ data }) => {
  const { icon, title, subtitle, description, horizontalAlignment } = data

  if (!title && !subtitle && !description && !icon) {
    return null
  }

  return (
    <div
      className={clsx(
        styles.card,
        styles[`card--${horizontalAlignment || 'left'}`]
      )}
    >
      {icon?.__typename === 'CoreIconRecord' && <CoreIcon data={icon} />}
      <div className={styles.card__content}>
        {title && <h3 className={styles.card__title}>{title}</h3>}
        {subtitle && <p className={styles.card__subtitle}>{subtitle}</p>}
        {description && (
          <p className={styles.card__description}>{description}</p>
        )}
      </div>
    </div>
  )
}
