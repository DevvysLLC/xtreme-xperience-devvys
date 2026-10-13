'use client'

import clsx from 'clsx'
import type { FC } from 'react'
import { useCart } from '../../../features/cart'
import { CartExpiry } from '../components/expiry'
import { CartLineItems } from '../components/items'
import styles from './aside.module.scss'

type Props = {
  className?: string
}

export const CartAside: FC<Props> = ({ className }) => {
  const { data, isLoading, isRefreshing } = useCart()
  const lineItems = data?.cartData?.lineItems ?? []
  const isEmpty = lineItems.length === 0
  const subtotal = data?.cartData?.subTotal ?? 0
  const discountTotal = data?.cartData?.discountTotal ?? 0

  if (isEmpty) {
    return (
      <aside className={clsx(styles.cart, className)}>
        <div className={styles.cart__container}>
          <div className={styles.cart__header}>
            <h2 className={styles.cart__title}>Cart summary</h2>
            <span className={styles.cart__count}>0 items</span>
          </div>

          <div className={styles.cart__empty_state}>
            <p className={styles.cart__empty_eyebrow}>Your cart is ready.</p>
            <p className={styles.cart__empty_desc}>
              Choose a car, date and start time.
            </p>
            <ul className={styles.cart__empty_reasons}>
              <li>Professional instruction included</li>
              <li>Real supercars. Real racetracks.</li>
              <li>760,000+ Experiences Delivered</li>
            </ul>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className={clsx(styles.cart, className)}>
      <div className={styles.cart__container}>
        <CartExpiry />

        <div className={styles.cart__header}>
          <h2 className={styles.cart__title}>Cart summary</h2>
          <span className={styles.cart__count}>
            {lineItems.length} {lineItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div
          className={clsx(
            styles.cart__content,
            isLoading && styles['is-loading'],
            isRefreshing && styles['is-refreshing']
          )}
        >
          <CartLineItems lineItems={lineItems} compact />
        </div>

        {discountTotal > 0 && (
          <div className={styles.cart__savings}>
            <strong>You save ${discountTotal.toLocaleString()}</strong>
            <small>Already included in these prices.</small>
          </div>
        )}

        <div className={styles.cart__totals}>
          <div className={styles.cart__subtotal_row}>
            <span>Subtotal</span>
            <strong>${subtotal.toLocaleString()}</strong>
          </div>
          <p className={styles.cart__note}>Before fees and taxes.</p>
        </div>

        <ul className={styles.cart__trust}>
          <li>Professional instruction included</li>
          <li>Real supercars. Real racetracks.</li>
          <li>760,000+ Experiences Delivered</li>
        </ul>
      </div>
    </aside>
  )
}
