'use client'
import { type PropsWithChildren, useState } from 'react'
import { CoreBrand } from '../../../components/core-brand'
import { ContentHeader } from './common/content-header'
import { MenuIcon } from './common/icon-menu'
import { Navigation } from './common/navigation'
import styles from './style.module.scss'

export default function StyleguideLayout({ children }: PropsWithChildren) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className={styles.container}>
      <aside className={`${styles.sidebar} ${isMenuOpen ? styles.isOpen : ''}`}>
        <div className={styles.sidebar__header}>
          <div className={styles.sidebar__logo}>
            <CoreBrand />
          </div>
          <button className={styles.sidebar__menu} onClick={handleMenuClick}>
            <MenuIcon />
          </button>
        </div>
        <div className={styles.sidebar__content}>
          <Navigation />
        </div>
      </aside>
      <main className={styles.main}>
        <ContentHeader />
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}
