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
import { useOptionalBookingWizardState } from '../../../booking-wizard/context'
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
  const isCheckoutPage = pathname?.includes('/checkout')
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

  const savingsGroups = useMemo(() => {
    type GroupItem = { name: string; amount: number }
    type Group = { category: string; total: number; items: GroupItem[] }
    const groups: Group[] = []

    const getCleanName = (title?: string | null) => {
      if (!title) {
        return 'Vehicle'
      }
      const strongMatch = title.match(/<strong>(.*?)<\/strong>/i)
      if (strongMatch && strongMatch[1]) {
        return strongMatch[1].trim()
      }
      return title.replace(/<[^>]+>/g, '').trim()
    }

    if (cartState?.metadata) {
      for (const item of cartState.metadata) {
        const props = item.properties
        if (!props || typeof props !== 'object') {
          continue
        }

        const itemSavings =
          'savings' in props &&
          typeof props.savings === 'number' &&
          props.savings > 0
            ? props.savings
            : 0

        if (itemSavings <= 0) {
          continue
        }

        const carName = getCleanName(item.title)

        const breakdown: Array<{ category: string; amount: number }> = []
        if (
          'savingsBreakdown' in props &&
          Array.isArray(props.savingsBreakdown) &&
          props.savingsBreakdown.length > 0
        ) {
          for (const b of props.savingsBreakdown) {
            if (
              typeof b === 'object' &&
              b !== null &&
              'category' in b &&
              typeof b.category === 'string' &&
              'amount' in b &&
              typeof b.amount === 'number' &&
              b.amount > 0
            ) {
              breakdown.push({ category: b.category, amount: b.amount })
            }
          }
        }

        if (breakdown.length > 0) {
          for (const b of breakdown) {
            let group = groups.find(
              (g) => g.category.toLowerCase() === b.category.toLowerCase()
            )
            if (!group) {
              group = { category: b.category, total: 0, items: [] }
              groups.push(group)
            }
            group.total += b.amount
            group.items.push({ name: carName, amount: b.amount })
          }
        } else {
          let isEarly = false
          if ('date' in props && typeof props.date === 'string') {
            const parts = props.date.split('T')
            const timePart = parts[1]
            if (timePart) {
              const timePieces = timePart.split(':')
              const hStr = timePieces[0]
              const mStr = timePieces[1]
              if (hStr) {
                const h = Number(hStr)
                const m = mStr ? Number(mStr) : 0
                if (!Number.isNaN(h) && !Number.isNaN(m)) {
                  const totalMins = h * 60 + m
                  if (totalMins >= 480 && totalMins <= 600) {
                    isEarly = true
                  }
                }
              }
            }
          }

          if (isEarly && itemSavings >= 60) {
            const earlyAmount = 60
            const dayAmount = itemSavings - 60

            if (dayAmount > 0) {
              let dayGroup = groups.find((g) => g.category === 'Day pricing')
              if (!dayGroup) {
                dayGroup = { category: 'Day pricing', total: 0, items: [] }
                groups.push(dayGroup)
              }
              dayGroup.total += dayAmount
              dayGroup.items.push({ name: carName, amount: dayAmount })
            }

            let earlyGroup = groups.find((g) => g.category === 'Early sessions')
            if (!earlyGroup) {
              earlyGroup = { category: 'Early sessions', total: 0, items: [] }
              groups.push(earlyGroup)
            }
            earlyGroup.total += earlyAmount
            earlyGroup.items.push({ name: carName, amount: earlyAmount })
          } else {
            let dayGroup = groups.find((g) => g.category === 'Day pricing')
            if (!dayGroup) {
              dayGroup = { category: 'Day pricing', total: 0, items: [] }
              groups.push(dayGroup)
            }
            dayGroup.total += itemSavings
            dayGroup.items.push({ name: carName, amount: itemSavings })
          }
        }
      }
    }

    return groups
  }, [cartState?.metadata])

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

      {isCheckoutPage && driveItems.length > 0 && (
        <>
          <hr className={styles.summary__divider} />
          <CartLineItems lineItems={driveItems} compact={true} />
        </>
      )}

      {isCheckoutPage && coverageAndAddonItems.length > 0 && (
        <>
          <hr className={styles.summary__divider} />
          <div className={styles.summary__sectionHeader}>
            COVERAGE &amp; ADD-ONS
          </div>
          <CartLineItems lineItems={coverageAndAddonItems} compact={true} />
        </>
      )}

      {!isReviewPage && (
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
            {savingsGroups.length > 0 ? (
              <div className={styles.summary__savingsList}>
                {savingsGroups.map((group) => (
                  <div
                    key={group.category}
                    className={styles.summary__savingsGroup}
                  >
                    <div className={styles.summary__savingsGroupHeader}>
                      <span className={styles.summary__savingsGroupTitle}>
                        {group.category}
                      </span>
                      <span className={styles.summary__savingsGroupTotal}>
                        -${group.total}
                      </span>
                    </div>
                    {group.items.map((item, idx) => (
                      <div key={idx} className={styles.summary__savingsItem}>
                        <span className={styles.summary__savingsItemName}>
                          {item.name}
                        </span>
                        <span className={styles.summary__savingsItemAmount}>
                          -${item.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.summary__savingsContent}>
                Discounts applied automatically to selected packages and vehicles.
              </div>
            )}
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

      {discountTotal > 0 && (
        <div className={styles.summary__data}>
          <span className={styles.summary__label}>
            {couponCodes ? `Discount (${couponCodes})` : t('summary.discount')}
          </span>

          <CoreRocketRezPrice
            className={`${styles.summary__value} ${styles.summary__discountValue}`}
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
        <strong className={styles.summary__totalTitle}>Total</strong>

        <CoreRocketRezPrice
          className={styles.summary__totalAmount}
          data={{
            id: 'summary-total',
            price: total
          }}
        />
      </div>
    </div>
  )
}
