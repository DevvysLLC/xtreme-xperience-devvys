'use client'

import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { useBooking } from '../../../../features/booking'
import { useCart, useCartLineItemsTotal } from '../../../../features/cart'
import { CoreRocketRezPrice } from '../../../core-rocketrez-price'
import { CouponForm } from '../coupon-form'
import { CouponRemove } from '../coupon-remove'
import { CartExpiry } from '../expiry'
import { CartLocation } from '../location'
import styles from './style.module.scss'

const getTaxAmount = (tax: unknown): number => {
  if (!tax || typeof tax !== 'object' || !('amount' in tax)) {
    return 0
  }
  const value = tax.amount
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

export const CartSummary: FC = () => {
  const t = useTranslations('global_cart')
  const { data: booking } = useBooking()
  const { data: cart } = useCart()
  const track = booking?.track
  const subtotal = useCartLineItemsTotal(cart?.cartData?.lineItems)
  const ticketingFee = cart?.cartData?.variableFeeTotal ?? 0
  const total = cart?.cartData?.total ?? 0
  const discountTotal = cart?.cartData?.discountTotal ?? 0
  const cartTaxFromBreakdown = (cart?.cartData?.taxes ?? []).reduce(
    (sum, tax) => sum + getTaxAmount(tax),
    0
  )
  const lineItemsTaxFromBreakdown = (cart?.cartData?.lineItems ?? []).reduce(
    (lineItemsSum, lineItem) =>
      lineItemsSum +
      (lineItem.taxes ?? []).reduce((taxesSum, tax) => taxesSum + getTaxAmount(tax), 0),
    0
  )
  const lineItemsTaxFromTotals = (cart?.cartData?.lineItems ?? []).reduce(
    (lineItemsSum, lineItem) => lineItemsSum + (lineItem.taxTotal ?? 0),
    0
  )
  const apiTaxTotal = cart?.cartData?.taxTotal ?? 0
  const inferredTaxTotal = total - subtotal - ticketingFee + discountTotal
  const taxTotal =
    apiTaxTotal > 0
      ? apiTaxTotal
      : Math.max(
          inferredTaxTotal > 0 && Number.isFinite(inferredTaxTotal)
            ? inferredTaxTotal
            : 0,
          cartTaxFromBreakdown,
          lineItemsTaxFromBreakdown,
          lineItemsTaxFromTotals
        )
  const houseServiceChargeTotal = (cart?.cartData?.lineItems ?? []).reduce(
    (acc, lineItem) => acc + (lineItem.houseServiceChargeTotal ?? 0),
    0
  )

  return (
    <div className={styles.summary}>
      <h2 className={styles.summary__title}>{t('summary.title')}</h2>

      {track && (
        <>
          <hr className={styles.summary__divider} />
          <CartLocation track={track} />
          <CartExpiry />
        </>
      )}

      <hr className={styles.summary__divider} />

      <CouponForm />

      {cart?.cartData?.coupons && cart.cartData.coupons.length > 0 && (
        <div className={styles.summary__coupons}>
          {cart.cartData.coupons.map((coupon) => (
            <CouponRemove key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}

      <hr className={styles.summary__divider} />

      <div className={styles.summary__data}>
        <strong className={styles.summary__label}>
          {t('summary.subtotal')}
        </strong>

        <CoreRocketRezPrice
          className={styles.summary__value}
          data={{
            id: 'summary-subtotal',
            price: subtotal
          }}
        />
      </div>

      {houseServiceChargeTotal > 0 && (
        <div className={styles.summary__data}>
          <span className={styles.summary__label}>
            {t('summary.house_service_charge')}
          </span>

          <CoreRocketRezPrice
            className={styles.summary__value}
            data={{
              id: 'house-service-charge-total',
              price: houseServiceChargeTotal
            }}
          />
        </div>
      )}

      {ticketingFee > 0 && (
        <div className={styles.summary__data}>
          <span className={styles.summary__label}>
            {t('summary.ticketing_fee')}
          </span>

          <CoreRocketRezPrice
            className={styles.summary__value}
            data={{
              id: 'summary-ticketing-fee',
              price: ticketingFee
            }}
          />
        </div>
      )}

      {discountTotal > 0 && (
        <div className={styles.summary__data}>
          <span className={styles.summary__label}>{t('summary.discount')}</span>

          <CoreRocketRezPrice
            className={styles.summary__value}
            prefix="-"
            data={{
              id: 'summary-discount',
              price: discountTotal
            }}
          />
        </div>
      )}

      {taxTotal > 0 && (
        <div className={styles.summary__data}>
          <span className={styles.summary__label}>{t('summary.tax')}</span>

          <CoreRocketRezPrice
            className={styles.summary__value}
            data={{
              id: 'summary-tax',
              price: taxTotal
            }}
          />
        </div>
      )}

      <hr className={styles.summary__divider} />

      <div className={styles.summary__total}>
        <strong className={styles.summary__label}>{t('summary.total')}</strong>

        <CoreRocketRezPrice
          className={styles.summary__value}
          data={{
            id: 'summary-total',
            price: total
          }}
        />
      </div>
    </div>
  )
}
