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
          <div className={styles.cart__header}>
            <h2 className={styles.cart__title}>{t('aside.title')}</h2>
            <span className={styles.cart__count}>0 items</span>
          </div>

          <div className={styles.cart__empty_state}>
            <p className={styles.cart__empty_eyebrow}>Your cart is ready.</p>
            <p className={styles.cart__empty_desc}>Choose a car, date and start time.</p>
            <ul className={styles.cart__empty_reasons}>
              <li>Professional Instruction included</li>
              <li>Track supervision, Pit crew and helmets</li>
              <li>450,000+ Experiences Delivered</li>
            </ul>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className={clsx(styles.cart)}>
      <div className={styles.cart__container}>
        <div className={styles.cart__header}>
          <h2 className={styles.cart__title}>{t('aside.title')}</h2>
          <span className={styles.cart__count}>
            {lineItems.length} {lineItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

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
