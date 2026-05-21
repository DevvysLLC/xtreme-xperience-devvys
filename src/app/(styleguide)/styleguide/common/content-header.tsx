'use client'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC, useMemo } from 'react'
import { useStyleguideLinks } from '../hooks/links'
import styles from '../style.module.scss'

export const ContentHeader: FC = () => {
  const pathname = usePathname()
  const t = useTranslations('styleguide')
  const { findLinkByPath } = useStyleguideLinks()

  const currentLink = useMemo(
    () => findLinkByPath(pathname),
    [pathname, findLinkByPath]
  )

  const subtitle = currentLink?.group || t('styles')
  const title = currentLink?.label || t('overview')

  return (
    <div className={styles.header}>
      <span className={styles.header__subtitle}>{subtitle}</span>
      <h1 className={styles.header__title}>{title}</h1>
    </div>
  )
}
