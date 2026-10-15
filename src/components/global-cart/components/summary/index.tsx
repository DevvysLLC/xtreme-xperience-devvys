'use client'

import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC, useMemo } from 'react'
import { useBooking } from '../../../../features/booking'
import {
  useCart,
  useCartLineItemsTotal,
  useCartState
} from '../../../../features/cart'
import { CoreRocketRezPrice } from '../../../core-rocketrez-price'
import { CouponForm } from '../coupon-form'
import { CouponRemove } from '../coupon-remove'
import { CartExpiry } from '../expiry'
import { CartLocation } from '../location'
import { CartLineItems } from '../items'
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
  const pathname = usePathname()
  const isReviewPage = pathname?.includes('/review')
  const isReviewOrCheckoutPage = isReviewPage || pathname?.includes('/checkout')
  const { data: booking } = useBooking()
  const { data: cart } = useCart()
  const track = booking?.track
  const rawLineItems = cart?.cartData?.lineItems
  const lineItems = useMemo(() => rawLineItems ?? [], [rawLineItems])
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
      (lineItem.taxes ?? []).reduce(
        (taxesSum, tax) => taxesSum + getTaxAmount(tax),
        0
      ),
    0
  )
  const lineItemsTaxFromTotals = (cart?.cartData?.lineItems ?? []).reduce(
    (lineItemsSum, lineItem) => lineItemsSum + (lineItem.taxTotal ?? 0),
    0
  )
  const apiTaxTotal = cart?.cartData?.taxTotal ?? 0
  const taxTotal =
    apiTaxTotal > 0
      ? apiTaxTotal
      : Math.max(
          cartTaxFromBreakdown,
          lineItemsTaxFromBreakdown,
          lineItemsTaxFromTotals
        )
  const houseServiceChargeTotal = (cart?.cartData?.lineItems ?? []).reduce(
    (acc, lineItem) => acc + (lineItem.houseServiceChargeTotal ?? 0),
    0
  )

  const { data: cartState } = useCartState()
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

  const displayedSubtotal = Math.max(0, subtotal - totalSavings)

  const driveItems = useMemo(() => {
    return lineItems.filter((item) => {
      const type = item.type?.toLowerCase()
      const name = item.name?.toLowerCase() || ''
      if (type === 'insurance') {
        return false
      }
      if (
        name.includes('pit pass') ||
        name.includes('throttle') ||
        name.includes('gift') ||
        type === 'giftcard' ||
        type === 'retail'
      ) {
        return false
      }
      return true
    })
  }, [lineItems])

  const coverageAndAddonItems = useMemo(() => {
    return lineItems.filter((item) => {
      const type = item.type?.toLowerCase()
      const name = item.name?.toLowerCase() || ''
      if (type === 'insurance') {
        return true
      }
      if (
        name.includes('pit pass') ||
        name.includes('throttle') ||
        name.includes('gift') ||
        type === 'giftcard' ||
        type === 'retail'
      ) {
        return true
      }
      return false
    })
  }, [lineItems])

  return (
    <div className={styles.summary}>
      <h2 className={styles.summary__title}>{t('summary.title')}</h2>

      {track && !isReviewOrCheckoutPage && (
        <>
          <hr className={styles.summary__divider} />
          <CartLocation track={track} />
          <CartExpiry />
        </>
      )}

      {track && isReviewOrCheckoutPage && (
        <>
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

      {isReviewOrCheckoutPage && driveItems.length > 0 && (
        <>
          <hr className={styles.summary__divider} />
          <CartLineItems lineItems={driveItems} compact={true} />
        </>
      )}

      {isReviewOrCheckoutPage && coverageAndAddonItems.length > 0 && (
        <>
          <hr className={styles.summary__divider} />
          <div className={styles.summary__sectionHeader}>
            COVERAGE &amp; ADD-ONS
          </div>
          <CartLineItems lineItems={coverageAndAddonItems} compact={true} />
        </>
      )}

      <hr className={styles.summary__divider} />

      <div className={`${styles.summary__data} ${styles['summary__data--subtotal']}`}>
        <strong className={styles.summary__label}>
          {t('summary.subtotal')}
        </strong>

        <CoreRocketRezPrice
          className={styles.summary__value}
          data={{
            id: 'summary-subtotal',
            price: displayedSubtotal
          }}
        />
      </div>

      {totalSavings > 0 && (
        <div className={styles.summary__savingsBlock}>
          <div className={styles.summary__savingsHeader}>
            <span className={styles.summary__savingsTitle}>
              You saved ${totalSavings.toLocaleString()}
            </span>
            <span className={styles.summary__savingsSubtitle}>
              Included in your prices
            </span>
          </div>
          <details className={styles.summary__savingsDetails}>
            <summary className={styles.summary__savingsSummary}>
              See savings details
            </summary>
            <div className={styles.summary__savingsContent}>
              Discounts applied automatically to selected packages and vehicles.
            </div>
          </details>
        </div>
      )}

      {houseServiceChargeTotal > 0 && (
        <>
          {totalSavings === 0 && <hr className={styles.summary__divider} />}
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
        </>
      )}

      <div className={styles.summary__data}>
        <span className={styles.summary__label}>{t('summary.tax')}</span>
        <span className={styles.summary__taxNote}>
          {taxTotal > 0 ? (
            <CoreRocketRezPrice
              className={styles.summary__value}
              data={{
                id: 'summary-tax',
                price: taxTotal
              }}
            />
          ) : (
            'Calculated at checkout'
          )}
        </span>
      </div>

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

      {discountTotal > 0 && totalSavings === 0 && (
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

      <hr className={styles.summary__divider} />

      <div className={styles.summary__total}>
        <div className={styles.summary__totalLabelGroup}>
          <strong className={styles.summary__totalTitle}>Estimated total</strong>
          <small className={styles.summary__totalSub}>before tax</small>
        </div>

        <CoreRocketRezPrice
          className={styles.summary__totalAmount}
          data={{
            id: 'summary-total',
            price: total
          }}
        />
      </div>

      <p className={styles.summary__legalNote}>
        Sample fees. Final amount including tax requires a live checkout quote.
      </p>
    </div>
  )
}
