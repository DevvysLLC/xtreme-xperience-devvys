'use client'

// import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC, useMemo } from 'react'
import { useBooking } from '../../../../features/booking'
import {
  useCart,
  useCartLineItemMetadata,
  useCartLineItemsTotal,
  useCartState
} from '../../../../features/cart'
import type { RocketRezLineItem } from '../../../../io/types'
import { getCartLineItemReadMetadataKey } from '../../../../utils/get-cart-line-item-metadata-key'
import { CoreRocketRezPrice } from '../../../core-rocketrez-price'
import { CouponForm } from '../coupon-form'
import { CouponRemove } from '../coupon-remove'
import { useOptionalBookingWizardState } from '../../../booking-wizard/context'
import { CartExpiry } from '../expiry'
import { CartLocation } from '../location'
import styles from './style.module.scss'

import { CoreTextMarkdown } from '../../../core-text-markdown'

const SummaryLineItem: FC<{ lineItem: RocketRezLineItem }> = ({ lineItem }) => {
  const { metadata } = useCartLineItemMetadata({ lineItem })
  const { price, quantity = 1 } = lineItem
  const type = (lineItem.type || '').toLowerCase()
  const metaType = (metadata?.type || '').toLowerCase()
  const rawName = (lineItem.name || '').trim()
  const metaTitle = (metadata?.title || '').trim()

  const isInsurance = type === 'insurance' || metaType === 'insurance'
  const isPitPass =
    rawName.toLowerCase().includes('pit pass') ||
    metaTitle.toLowerCase().includes('pit pass')
  const isRideAlong =
    metadata?.isRideAlong === true ||
    rawName.toLowerCase().includes('ride along') ||
    rawName.toLowerCase().includes('ride-along') ||
    rawName.toLowerCase().includes('hellcat')

  let displayName = metaTitle || rawName || `${lineItem.type} #${lineItem.productId}`

  if (isInsurance) {
    displayName = metaTitle || 'Damage Protection – Base'
  } else if (isPitPass) {
    displayName = quantity > 1 ? `Pit Pass × ${quantity}` : 'Pit Pass'
  } else if (isRideAlong) {
    if (
      !displayName.toLowerCase().includes('ride along') &&
      !displayName.toLowerCase().includes('ride-along')
    ) {
      displayName = `${displayName} (Ride Along)`
    }
  } else if (
    metadata?.properties &&
    typeof metadata.properties === 'object' &&
    'laps' in metadata.properties &&
    metadata.properties.laps
  ) {
    const laps = metadata.properties.laps
    if (!displayName.toLowerCase().includes('lap')) {
      displayName = `${displayName} – ${laps} Laps`
    }
  }

  const totalPrice = price * quantity

  return (
    <div className={styles.summary__itemRow}>
      <CoreTextMarkdown className={styles.summary__itemName}>
        {displayName}
      </CoreTextMarkdown>
      <span className={styles.summary__itemPrice}>
        ${totalPrice.toLocaleString()}
      </span>
    </div>
  )
}

const getTaxAmount = (tax: unknown): number => {
  if (!tax || typeof tax !== 'object' || !('amount' in tax)) {
    return 0
  }
  const value = tax.amount
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

const getLineItemDiscount = (
  entry: unknown
): { lineItemId: number; discountAmount: number } | null => {
  if (
    !entry ||
    typeof entry !== 'object' ||
    !('lineItemId' in entry) ||
    !('discountAmount' in entry)
  ) {
    return null
  }
  const lineItemId = entry.lineItemId
  const discountAmount = entry.discountAmount
  if (
    typeof lineItemId === 'number' &&
    typeof discountAmount === 'number' &&
    discountAmount > 0
  ) {
    return { lineItemId, discountAmount }
  }
  return null
}

export const CartSummary: FC = () => {
  const t = useTranslations('global_cart')
  // const pathname = usePathname()
  // const isReviewPage = pathname?.includes('/review')
  // const isCheckoutPage = pathname?.includes('/checkout')
  const { data: booking } = useBooking()
  const { data: cart } = useCart()
  const wizardContext = useOptionalBookingWizardState()
  const wizardTrack = wizardContext?.state?.selectedEvent?.model?.track
  const track = booking?.track ?? wizardTrack ?? null
  const rawLineItems = cart?.cartData?.lineItems
  const lineItems = useMemo(() => rawLineItems ?? [], [rawLineItems])
  const subtotal = useCartLineItemsTotal(cart?.cartData?.lineItems)
  const ticketingFee = cart?.cartData?.variableFeeTotal ?? 0
  const total = cart?.cartData?.total ?? 0
  const discountTotal = cart?.cartData?.discountTotal ?? 0
  const couponCodes = useMemo(() => {
    return (cart?.cartData?.coupons ?? [])
      .map((c) => c.code || c.serial)
      .filter(Boolean)
      .join(', ')
  }, [cart?.cartData?.coupons])
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

  const savingsBreakdownItems = useMemo(() => {
    type SavingsItem = { name: string; category: string; amount: number }
    const items: SavingsItem[] = []

    const getCleanName = (title?: string | null) => {
      if (!title) {
        return 'Product'
      }
      return title
        .replace(/<[^>]+>/g, '')
        .replace(/[-–—]\s*\d+\s*Laps?/gi, '')
        .replace(/\(\s*Ride Along\s*\)/gi, '')
        .trim()
    }

    // 1. Process RocketRez line-item discounts (coupons and promo rules)
    const processedLineItemIds = new Set<number>()
    let accountedRRDiscounts = 0

    if (cart?.cartData?.coupons && cart?.cartData?.lineItems) {
      for (const coupon of cart.cartData.coupons) {
        const couponCode = coupon.code || coupon.serial
        const couponLabel = couponCode
          ? `Coupon (${couponCode})`
          : 'Discount applied'
        const rawLineDiscounts = coupon.lineItemDiscounts
        if (Array.isArray(rawLineDiscounts)) {
          for (const rawEntry of rawLineDiscounts) {
            const ld = getLineItemDiscount(rawEntry)
            if (!ld) {
              continue
            }
            const { lineItemId, discountAmount: amount } = ld
            const matchedLineItem = cart.cartData.lineItems.find(
              (li) => li.id === lineItemId
            )
              const lineItemKey = matchedLineItem
                ? getCartLineItemReadMetadataKey({ lineItem: matchedLineItem })
                : null
              const matchedMeta = lineItemKey
                ? cartState?.metadata?.find((m) => m.key === lineItemKey)
                : null
              const name = matchedMeta?.title
                ? getCleanName(matchedMeta.title)
                : matchedLineItem?.name || matchedLineItem?.type || 'Product'

              items.push({
                name,
                category: couponLabel,
                amount
              })
              accountedRRDiscounts += amount
              processedLineItemIds.add(lineItemId)
            }
          }
        }
      }

    if (cart?.cartData?.lineItems) {
      for (const lineItem of cart.cartData.lineItems) {
        if (processedLineItemIds.has(lineItem.id)) {
          continue
        }
        const itemDiscount = lineItem.discountAmount ?? 0
        if (itemDiscount > 0) {
          const lineItemKey = getCartLineItemReadMetadataKey({ lineItem })
          const matchedMeta = lineItemKey
            ? cartState?.metadata?.find((m) => m.key === lineItemKey)
            : null
          const name = matchedMeta?.title
            ? getCleanName(matchedMeta.title)
            : lineItem.name || lineItem.type || 'Product'

          items.push({
            name,
            category: 'Discount applied',
            amount: itemDiscount
          })
          accountedRRDiscounts += itemDiscount
          processedLineItemIds.add(lineItem.id)
        }
      }
    }

    // Remaining cart-level discount from RocketRez (if any whole-cart discount unassigned to line items)
    const remainingRRDiscount =
      Math.round((discountTotal - accountedRRDiscounts) * 100) / 100
    if (remainingRRDiscount > 0) {
      items.push({
        name: couponCodes ? `Coupon (${couponCodes})` : 'Order discount',
        category: 'Discount applied',
        amount: remainingRRDiscount
      })
    }

    return items
  }, [
    cart?.cartData?.coupons,
    cart?.cartData?.lineItems,
    cartState?.metadata,
    couponCodes,
    discountTotal
  ])

  const totalSavings = useMemo(() => {
    return Math.round(
      savingsBreakdownItems.reduce((acc, item) => acc + item.amount, 0)
    )
  }, [savingsBreakdownItems])

  return (
    <div className={styles.summary}>
      <h2 className={styles.summary__title}>{t('summary.title')}</h2>

      {track && <CartLocation track={track} />}

      <CartExpiry />

      <CouponForm />

      {cart?.cartData?.coupons && cart.cartData.coupons.length > 0 && (
        <div className={styles.summary__coupons}>
          {cart.cartData.coupons.map((coupon) => (
            <CouponRemove key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}


      {lineItems.length > 0 && (
        <div className={styles.summary__itemsList}>
          {lineItems.map((item) => (
            <SummaryLineItem key={item.id} lineItem={item} />
          ))}
        </div>
      )}

      {subtotal > 0 && (
        <>
          <hr className={styles.summary__divider} />

          <div
            className={`${styles.summary__data} ${styles['summary__data--subtotal']}`}
          >
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
        </>
      )}

      {houseServiceChargeTotal > 0 && (
        <>
          {subtotal === 0 && <hr className={styles.summary__divider} />}
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

      {totalSavings > 0 && (
        <div className={styles.summary__savingsBlock}>
          <details className={styles.summary__savingsDetails} open>
            <summary className={styles.summary__savingsSummary}>
              See savings details
            </summary>
            <div className={styles.summary__savingsHeader}>
              <span className={styles.summary__savingsTitle}>
                You saved ${totalSavings.toLocaleString()}
              </span>
              <span className={styles.summary__savingsSubtitle}>
                Applied discounts
              </span>
            </div>
            {savingsBreakdownItems.length > 0 && (
              <div className={styles.summary__savingsList}>
                {savingsBreakdownItems.map((item, idx) => (
                  <div key={idx} className={styles.summary__savingsRow}>
                    <span className={styles.summary__savingsRowName}>
                      {item.name}
                    </span>
                    <span className={styles.summary__savingsRowType}>
                      | {item.category}
                    </span>
                    <span className={styles.summary__savingsRowAmount}>
                      - ${item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <hr className={styles.summary__savingsTotalDivider} />
                <div className={styles.summary__savingsTotalRow}>
                  <span>Total savings</span>
                  <span className={styles.summary__savingsTotalAmount}>
                    - ${totalSavings.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </details>
        </div>
      )}

      <hr className={styles.summary__divider} />

      <div className={styles.summary__total}>
        <strong className={styles.summary__totalTitle}>Total</strong>

        <CoreRocketRezPrice
          className={styles.summary__totalAmount}
          data={{
            id: 'summary-total',
            price: total
          }}
        />
      </div>

      <div className={styles.summary__secure}>
        <svg
          className={styles.summary__secureIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
            clipRule="evenodd"
          />
        </svg>
        <div className={styles.summary__secureText}>
          <strong className={styles.summary__secureTitle}>Secure checkout</strong>
          <span className={styles.summary__secureSubtitle}>
            Your payment information is encrypted and secure.
          </span>
        </div>
      </div>
    </div>
  )
}
