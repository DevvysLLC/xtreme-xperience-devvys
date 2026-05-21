'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ROUTES } from '../../../config/routes'
import { DRAWER_REQUEST_OPEN_MESSAGE_NAME } from '../../../core/messaging/main/messages/open-drawer'
import { useMainBus } from '../../../core/messaging/main/react'
import { CoreBrand } from '../../core-brand'
import { CoreIcon } from '../../core-icon'
import { CART_DRAWER_ID, CartIcon } from '../../global-cart'
import { TrackFinderLabel } from '../../global-track-finder/components/label'
import type { GetHeaderQuery } from '../get-header.typegen'
import styles from '../style.module.scss'
import { NavigationDesktop } from './navigation-desktop'

type HeaderConfig = NonNullable<NonNullable<GetHeaderQuery['header']>['config']>

type Props = {
  navigation?: HeaderConfig['navigation']
  showCart?: HeaderConfig['showCart']
  showSearch?: HeaderConfig['showSearch']
  showTrackFinder?: HeaderConfig['showTrackFinder']
}

export const NavbarDesktop = ({
  navigation = [],
  showCart,
  showSearch,
  showTrackFinder
}: Props) => {
  const t = useTranslations('global_header')

  const bus = useMainBus(DRAWER_REQUEST_OPEN_MESSAGE_NAME, () => {
    // No-op callback - we only need the bus instance
  })

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
    <div className={styles.navbarDesktop}>
      <div className={styles.navbarDesktop__logo}>
        <Link href={ROUTES.FRONTEND.HOME}>
          <CoreBrand />
        </Link>
      </div>
      <div className={styles.navbarDesktop__navigation}>
        <NavigationDesktop items={navigation} />
      </div>
      <div className={styles.navbarDesktop__actions}>
        {showTrackFinder && <TrackFinderLabel />}
        {showSearch && (
          <button
            className={styles.action}
            aria-label={t('search')}
            onClick={handleOpenSearch}
          >
            <CoreIcon icon="search" />
          </button>
        )}
        {showCart && (
          <CartIcon className={styles.action} onClick={handleOpenCart} />
        )}
      </div>
    </div>
  )
}
