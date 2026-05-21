'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { useBooking } from '../../../features/booking'
import { useCart } from '../../../features/cart'
import { CartExpiry } from '../components/expiry'
import { CartLineItems } from '../components/items'
import { CartLocation } from '../components/location'
import styles from './aside.module.scss'

type Props = {
  className?: string
}

export const CartAside: FC<Props> = ({ className }) => {
  const t = useTranslations('global_cart')
  const { data, isLoading, isRefreshing } = useCart()
  const { data: booking } = useBooking()
  const track = booking?.track
  const lineItems = data?.cartData?.lineItems ?? []
  const isEmpty = lineItems.length === 0

  if (isEmpty) {
    return (
      <aside className={clsx(styles.cart, className)}>
        <div className={styles.cart__container}>
          <h2 className={styles.cart__title}>{t('aside.title')}</h2>

          <hr className={styles.cart__divider} />

          <div className={styles.cart__empty}>
            <span>{t('aside.empty')}</span>
          </div>

          <hr className={styles.cart__divider} />
        </div>
      </aside>
    )
  }

  return (
    <aside className={clsx(styles.cart)}>
      <div className={styles.cart__container}>
        <h2 className={styles.cart__title}>{t('aside.title')}</h2>

        {track && (
          <>
            <hr className={styles.cart__divider} />
            <CartLocation track={track} />
            <CartExpiry />
          </>
        )}

        <hr className={styles.cart__divider} />

        <div
          className={clsx(
            styles.cart__content,
            isLoading && styles['is-loading'],
            isRefreshing && styles['is-refreshing']
          )}
        >
          <CartLineItems lineItems={lineItems} compact />
        </div>
      </div>
    </aside>
  )
}
