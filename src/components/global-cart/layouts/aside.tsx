'use client'

import clsx from 'clsx'
import { type FC, useMemo } from 'react'
import { useBooking } from '../../../features/booking'
import { useCart, useCartState } from '../../../features/cart'
import { useOptionalBookingWizardState } from '../../booking-wizard/context'
import { CartExpiry } from '../components/expiry'
import { CartLineItems } from '../components/items'
import { CartLocation } from '../components/location'
import styles from './aside.module.scss'

type Props = {
  className?: string
}

export const CartAside: FC<Props> = ({ className }) => {
  const { data, isLoading, isRefreshing } = useCart()
  const { data: cartState } = useCartState()
  const { data: booking } = useBooking()
  const wizardContext = useOptionalBookingWizardState()
  const wizardTrack = wizardContext?.state?.selectedEvent?.model?.track
  const track = booking?.track ?? wizardTrack ?? null
  const rawLineItems = data?.cartData?.lineItems
  const lineItems = rawLineItems ?? []
  const isEmpty = lineItems.length === 0
  const rawSubtotal = useMemo(() => {
    return (rawLineItems ?? []).reduce(
      (acc, item) => acc + item.price * (item.quantity ?? 1),
      0
    )
  }, [rawLineItems])
  const discountTotal = data?.cartData?.discountTotal ?? 0

  // Calculate dynamic savings from metadata
  const totalSavings = useMemo(() => {
    let metadataSavings = 0
    if (cartState?.metadata) {
      for (const item of cartState.metadata) {
        const props = item.properties
        const itemSavings =
          props &&
          typeof props === 'object' &&
          'savings' in props &&
          typeof props.savings === 'number'
            ? props.savings
            : 0
        if (itemSavings > 0) {
          metadataSavings += itemSavings
        }
      }
    }
    return Math.round(Math.max(discountTotal, metadataSavings))
  }, [cartState?.metadata, discountTotal])

  const subtotal = rawSubtotal

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
        <div className={styles.cart__header}>
          <h2 className={styles.cart__title}>Cart summary</h2>
          <span className={styles.cart__count}>
            {lineItems.length} {lineItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {track && <CartLocation track={track} />}

        <CartExpiry />

        <div
          className={clsx(
            styles.cart__content,
            isLoading && styles['is-loading'],
            isRefreshing && styles['is-refreshing']
          )}
        >
          <CartLineItems lineItems={lineItems} compact />
        </div>

        {totalSavings > 0 && (
          <div className={styles.cart__savings}>
            <strong>You save ${totalSavings.toLocaleString()}</strong>
            <small>Already included in these prices.</small>
          </div>
        )}

        <div className={styles.cart__totals}>
          <div className={styles.cart__subtotal_row}>
            <span>Subtotal</span>
            <strong>${subtotal.toLocaleString()}</strong>
          </div>
          {discountTotal > 0 && (
            <div className={styles.cart__discount_row}>
              <span>Discount</span>
              <strong>-${discountTotal.toLocaleString()}</strong>
            </div>
          )}
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
