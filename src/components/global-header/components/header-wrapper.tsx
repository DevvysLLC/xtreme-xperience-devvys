'use client'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useHeader } from '../context/header-context'
import styles from '../style.module.scss'

type Props = {
  children: ReactNode
}

export const HeaderWrapper = ({ children }: Props) => {
  const {
    isAnnouncementBarOpen,
    isScrolled,
    isOffscreen,
    isHeaderTransparent,
    isSearchDrawerOpen,
    isMegaMenuOpen
  } = useHeader()

  const headerClassName = clsx(
    styles.header,
    isHeaderTransparent && styles['header--transparent'],
    isScrolled && styles['header--scrolled'],
    (isOffscreen || isSearchDrawerOpen) && styles['header--offscreen']
  )

  return (
    <>
      <div
        className={clsx(
          styles.header__spacer,
          isHeaderTransparent && styles['header__spacer--transparent'],
          !isAnnouncementBarOpen && styles['header__spacer--noAnnouncementBar']
        )}
      />
      <div
        className={clsx(
          styles.header__overlay,
          isMegaMenuOpen && styles['header__overlay--open']
        )}
      />
      <header className={headerClassName}>{children}</header>
    </>
  )
}
