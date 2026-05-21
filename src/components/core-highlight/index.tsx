import type { FC } from 'react'
import { CoreCta } from '../core-cta'
import { CoreIcon } from '../core-icon'
import type { CoreHighlightFragment } from './core-highlight.typegen'
import styles from './style.module.scss'

export type Props = {
  data: CoreHighlightFragment
}

export const CoreHighlight: FC<Props> = ({ data }) => {
  const { icon, title, subtitle, body, ctas = [] } = data || {}
  const iconName = icon?.icon ?? ''
  const textClassName = iconName
    ? styles.text
    : `${styles.text} ${styles['text--full']}`
  return (
    <div className={styles.section}>
      {icon && (
        <span className={styles.icon}>
          <CoreIcon icon={iconName || ''} />
        </span>
      )}
      <div className={textClassName}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {subtitle && (
          <p
            className={`${styles.paragraph} ${styles['paragraph--uppercase']}`}
          >
            {subtitle}
          </p>
        )}
        {body && <p className={styles.paragraph}>{body}</p>}
        {ctas.length > 0 && (
          <div className={styles.ctas}>
            {ctas.map((cta) => {
              return <CoreCta data={cta} key={cta.id} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}
