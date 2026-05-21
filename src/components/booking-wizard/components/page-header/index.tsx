'use client'
import clsx from 'clsx'
import type { FC, ReactNode } from 'react'
import { CoreTextMarkdown } from '../../../core-text-markdown'
import styles from './style.module.scss'

type Props = {
  title: string
  description?: ReactNode
  centeredDesktop?: boolean
}

export const PageHeader: FC<Props> = ({
  title,
  description,
  centeredDesktop
}) => {
  return (
    <header
      className={clsx(
        styles.header,
        centeredDesktop && styles['header--centered-desktop']
      )}
    >
      <h1 className={styles.title}>{title}</h1>
      {description &&
        (typeof description === 'string' ? (
          <CoreTextMarkdown type="rte" className={styles.description}>
            {description}
          </CoreTextMarkdown>
        ) : (
          <p className={styles.description}>{description}</p>
        ))}
    </header>
  )
}
