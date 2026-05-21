'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC, useCallback, useEffect, useState } from 'react'
import { ROUTES } from '../../../config/routes'
import { logger } from '../../../core/logger/logger'
import { useBooking } from '../../../features/booking'
import { useCart, useCartClear } from '../../../features/cart'
import { Drawer } from '../../global-drawer'
import { CartActions } from '../components/actions'
import { CartEmpty } from '../components/empty'
import { CartExpiry } from '../components/expiry'
import { CartLineItems } from '../components/items'
import { CartLocation } from '../components/location'
import { CartTotals } from '../components/totals'
import styles from './drawer.module.scss'

export const CART_DRAWER_ID = 'cart-drawer'

type Props = {
  onCheckout?: () => void
  onBrowse?: () => void
}

export const CartDrawer: FC<Props> = ({ onCheckout, onBrowse }) => {
  const t = useTranslations('global_cart')
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const { data, isLoading, isRefreshing } = useCart()
  const clearCart = useCartClear()
  const { data: booking } = useBooking()
  const track = booking?.track
  const lineItems = data?.cartData?.lineItems ?? []
  const isEmpty = lineItems.length === 0

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleClear = useCallback(async () => {
    try {
      await clearCart.mutateAsync(undefined)
    } catch (error) {
      logger.error({ error }, 'cart-drawer.handleClear.error')
    }
  }, [clearCart])

  const handleCheckout = useCallback(() => {
    if (onCheckout) {
      onCheckout()
    } else {
      if (data?.contents.canSkipBooking) {
        router.push(ROUTES.CHECKOUT.CONTACTS)
      } else {
        router.push(ROUTES.BOOKING.HOME)
      }
    }
  }, [onCheckout, router, data?.contents.canSkipBooking])

  const drawerClassName = isMounted
    ? clsx(
        styles.cartDrawer,
        isLoading && styles['is-loading'],
        isRefreshing && styles['is-refreshing']
      )
    : undefined

  return (
    <Drawer
      className={drawerClassName}
      id={CART_DRAWER_ID}
      layoutType="cart"
      title={t('header.title')}
    >
      <div className={styles.cartDrawer}>
        <div
          className={clsx(
            styles.cartDrawer__content,
            isLoading && styles['is-loading'],
            isRefreshing && styles['is-refreshing']
          )}
        >
          {isEmpty ? (
            <CartEmpty onBrowse={onBrowse} />
          ) : (
            <>
              <CartTotals />
              {track && (
                <>
                  <hr className={styles.cartDrawer__divider} />
                  <div className={styles.cartDrawer__location}>
                    {data?.contents.hasCars && <CartLocation track={track} />}
                    <CartExpiry />
                  </div>
                </>
              )}
              <CartLineItems lineItems={lineItems} compact />
            </>
          )}
        </div>

        {!isEmpty && (
          <div className={styles.cartDrawer__footer}>
            <CartActions
              onCheckout={handleCheckout}
              onClear={handleClear}
              isLoading={isLoading}
              checkoutDisabled={isEmpty}
              showClear
            />
          </div>
        )}
      </div>
    </Drawer>
  )
}
