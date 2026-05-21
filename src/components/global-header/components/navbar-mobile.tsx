'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { ROUTES } from '../../../config/routes'
import { DRAWER_REQUEST_OPEN_MESSAGE_NAME } from '../../../core/messaging/main/messages/open-drawer'
import { useMainBus } from '../../../core/messaging/main/react'
import { useMediaQuery } from '../../../core/viewport/use-media-query'
import { CoreBrand } from '../../core-brand'
import { CoreIcon } from '../../core-icon'
import { CART_DRAWER_ID, CartIcon } from '../../global-cart'
import { TrackFinderLabel } from '../../global-track-finder/components/label'
import type { GetHeaderQuery } from '../get-header.typegen'
import styles from '../style.module.scss'
import { NavigationMobileDrawer } from './navigation-mobile-drawer'

type HeaderConfig = NonNullable<NonNullable<GetHeaderQuery['header']>['config']>

type Props = {
  navigation?: HeaderConfig['navigation']
  showCart?: HeaderConfig['showCart']
  showSearch?: HeaderConfig['showSearch']
  showTrackFinder?: HeaderConfig['showTrackFinder']
  featuredMobileNavigation?: HeaderConfig['featuredMobileNavigation']
  contactPhoneNumber?: string | null
  workingHours?: string | null
}

export const NavbarMobile = ({
  navigation = [],
  showCart,
  showSearch,
  showTrackFinder,
  featuredMobileNavigation,
  contactPhoneNumber,
  workingHours
}: Props) => {
  const t = useTranslations('global_header')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const isMobile = !useMediaQuery('(min-width: 1024px)', { defaultValue: true })

  const bus = useMainBus(DRAWER_REQUEST_OPEN_MESSAGE_NAME, () => {
    // No-op callback - we only need the bus instance
  })

  const toggleOverflow = useCallback(() => {
    document.body.classList.toggle(
      'is-frozen',
      isDrawerOpen && isMobile === true
    )
  }, [isDrawerOpen, isMobile])

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

  useEffect(() => {
    toggleOverflow()

    return () => {
      document.body.classList.remove('is-frozen')
    }
  }, [isDrawerOpen, isMobile, toggleOverflow])

  const handleOpenSearch = () => {
    bus.send({
      name: DRAWER_REQUEST_OPEN_MESSAGE_NAME,
      details: { id: 'search-drawer' }
    })
  }

  const handleOpenCart = () => {
    bus.send({
      name: DRAWER_REQUEST_OPEN_MESSAGE_NAME,
      details: { id: CART_DRAWER_ID }
    })
  }

  return (
    <div className={styles.navbarMobile}>
      <div
        className={clsx(
          styles.navbarMobile__actions,
          styles[`navbarMobile__actions--left`]
        )}
      >
        <button
          className={styles.menu}
          aria-label={t('menu')}
          onClick={handleOpenDrawer}
        >
          <CoreIcon icon="menu" />
        </button>
        {showTrackFinder && <TrackFinderLabel />}
      </div>
      <div className={styles.navbarMobile__logo}>
        <Link href={ROUTES.FRONTEND.HOME}>
          <CoreBrand />
        </Link>
      </div>
      <div
        className={clsx(
          styles.navbarMobile__actions,
          styles[`navbarMobile__actions--right`]
        )}
      >
        {showCart && (
          <CartIcon className={styles.cart} onClick={handleOpenCart} />
        )}
        {showSearch && (
          <button
            className={styles.search}
            aria-label={t('search')}
            onClick={handleOpenSearch}
          >
            <CoreIcon icon="search" />
          </button>
        )}
      </div>
      <NavigationMobileDrawer
        items={navigation}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        featuredMobileNavigation={featuredMobileNavigation}
        contactPhoneNumber={contactPhoneNumber}
        workingHours={workingHours}
      />
    </div>
  )
}
