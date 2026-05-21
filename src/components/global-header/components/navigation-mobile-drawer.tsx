'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { useRouteChange } from '../../../features/route'
import { getHref } from '../../../utils/get-href'
import { CoreIcon } from '../../core-icon'
import { CoreTextMarkdown } from '../../core-text-markdown'
import { GlobalTrackFinderWidget } from '../../global-track-finder'
import type { GetHeaderQuery } from '../get-header.typegen'
import styles from '../style.module.scss'
import { NavigationSupercarsGrid } from './navigation-supercars-grid'

type HeaderConfig = NonNullable<NonNullable<GetHeaderQuery['header']>['config']>

type Props = {
  items?: HeaderConfig['navigation']
  featuredMobileNavigation?: HeaderConfig['featuredMobileNavigation']
  contactPhoneNumber?: string | null
  workingHours?: string | null
  isOpen: boolean
  onClose?: () => void
}

export const NavigationMobileDrawer = ({
  items,
  featuredMobileNavigation,
  contactPhoneNumber,
  workingHours,
  isOpen,
  onClose
}: Props) => {
  const t = useTranslations('global_header')
  const [isDrawerOpen, setIsDrawerOpen] = useState(isOpen)
  const [openSubNavigationId, setOpenSubNavigationId] = useState<string | null>(
    null
  )
  const [openFeaturedNavigation, setOpenFeaturedNavigation] = useState(false)

  const handleClose = useCallback(() => {
    setIsDrawerOpen(false)
    setOpenSubNavigationId(null)
    onClose?.()
  }, [onClose])

  useEffect(() => {
    setIsDrawerOpen(isOpen)
  }, [isOpen])

  useRouteChange(() => {
    handleClose()
  })

  const handleSubNavigationOpen = (itemId: string) => {
    setOpenSubNavigationId((prevId) => (prevId === itemId ? null : itemId))
  }

  const handleCloseSubNavigation = () => {
    setOpenSubNavigationId(null)
  }

  return (
    <div
      className={clsx(
        styles.navigationMobileDrawer,
        isDrawerOpen && styles['navigationMobileDrawer--open'],
        openSubNavigationId &&
          styles['navigationMobileDrawer--subNavigationOpen']
      )}
    >
      <div className={styles.navigationMobileDrawer__header}>
        {openSubNavigationId ? (
          <button
            className={styles.navigationMobileDrawer__back}
            onClick={handleCloseSubNavigation}
          >
            <CoreIcon icon="chevron-left" />
            {t('back')}
          </button>
        ) : (
          <span className={styles.navigationMobileDrawer__title}>
            {t('menu')}
          </span>
        )}
        <button
          className={styles.navigationMobileDrawer__close}
          onClick={handleClose}
        >
          <CoreIcon icon="close" />
        </button>
      </div>

      <div
        className={clsx(
          styles.navigationMobileDrawer__content,
          openSubNavigationId &&
            styles['navigationMobileDrawer__content--subNavigationOpen']
        )}
      >
        <nav className={styles.navigationMobileDrawer__navigation}>
          <ul className={styles.navigationMobileDrawer__list}>
            {items?.map((item) => {
              const isSubNavigationOpen = openSubNavigationId === item.id

              return (
                <li
                  key={item.id}
                  className={styles.navigationMobileDrawer__item}
                >
                  {item.children && item.children.length > 0 ? (
                    <button
                      className={styles.navigationMobileDrawer__button}
                      onClick={() => {
                        handleSubNavigationOpen(item.id)
                      }}
                    >
                      <span
                        className={styles.navigationMobileDrawer__button__label}
                      >
                        {item.label}
                      </span>
                      <span
                        className={styles.navigationMobileDrawer__button__icon}
                      >
                        <CoreIcon icon="chevron-right" />
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={getHref(item)}
                      className={styles.navigationMobileDrawer__link}
                    >
                      {item.label}
                    </Link>
                  )}
                  {item.children && item.children.length > 0 && (
                    <div
                      className={clsx(
                        styles.navigationMobileDrawer__subNavigation,
                        isSubNavigationOpen &&
                          styles['navigationMobileDrawer__subNavigation--open']
                      )}
                    >
                      {item.children.length > 0 &&
                      item.children.every(
                        (child) => child.link?.__typename === 'SupercarRecord'
                      ) ? (
                        <NavigationSupercarsGrid items={item.children} />
                      ) : (
                        <ul className={styles.navigationMobileDrawer__list}>
                          {item.children.map((child) => (
                            <li
                              key={child.id}
                              className={styles.navigationMobileDrawer__item}
                            >
                              <Link
                                href={getHref(child)}
                                className={styles.navigationMobileDrawer__link}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
          {featuredMobileNavigation && (
            <div className={styles.featuredNavigation}>
              <button
                onClick={() => {
                  setOpenFeaturedNavigation(!openFeaturedNavigation)
                }}
                aria-expanded={openFeaturedNavigation}
                aria-controls={`featured-navigation`}
                className={styles.featuredNavigation__toggle}
              >
                <span className={styles.featuredNavigation__label}>
                  {featuredMobileNavigation.label}
                </span>
                <span
                  className={clsx(
                    styles.featuredNavigation__icon,
                    openFeaturedNavigation &&
                      styles['featuredNavigation__icon--isOpen']
                  )}
                >
                  <CoreIcon icon="plus" />
                </span>
              </button>

              <div
                className={clsx(
                  styles.featuredNavigation__list__wrapper,
                  openFeaturedNavigation &&
                    styles['featuredNavigation__list__wrapper--isOpen']
                )}
              >
                <ul
                  id={`featured-navigation`}
                  className={styles.featuredNavigation__list}
                >
                  {featuredMobileNavigation.children.map((child) => (
                    <li
                      key={child.id}
                      className={styles.featuredNavigation__item}
                    >
                      <Link
                        href={getHref(child)}
                        target={child.target || '_self'}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {(contactPhoneNumber || workingHours) && (
            <div className={styles.contacts}>
              {contactPhoneNumber && (
                <div className={styles.contacts__content}>
                  <a href={`tel:${contactPhoneNumber}`}>{contactPhoneNumber}</a>
                </div>
              )}
              {workingHours && (
                <div className={styles.contacts__hours}>
                  <CoreTextMarkdown>{workingHours ?? ''}</CoreTextMarkdown>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      <div className={styles.navigationMobileDrawer__footer}>
        <GlobalTrackFinderWidget layout="navigation-mobile-drawer" />
      </div>
    </div>
  )
}
