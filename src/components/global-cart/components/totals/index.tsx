'use client'

import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { useCart, useCartLineItemsTotal } from '../../../../features/cart'
import { CoreRocketRezPrice } from '../../../core-rocketrez-price'
import styles from './style.module.scss'

const getTaxAmount = (tax: unknown): number => {
  if (!tax || typeof tax !== 'object' || !('amount' in tax)) {
    return 0
  }
  const value = tax.amount
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

export const CartTotals: FC = () => {
  const t = useTranslations('global_cart')
  const { data: cart } = useCart()
  const lineItemsSubtotal = useCartLineItemsTotal(cart?.cartData?.lineItems)
  const subtotal = lineItemsSubtotal > 0 ? lineItemsSubtotal : (cart?.cartData?.subTotal ?? 0)
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
  const apiTaxTotal = cart?.cartData?.taxTotal ?? 0
  const taxTotal =
    apiTaxTotal > 0
      ? apiTaxTotal
      : Math.max(cartTaxFromBreakdown, lineItemsTaxFromBreakdown)
  const discountTotal = cart?.cartData?.discountTotal ?? 0
  const variableFeeTotal = cart?.cartData?.variableFeeTotal ?? 0
  const total = cart?.cartData?.total ?? 0
  const houseServiceChargeTotal = (cart?.cartData?.lineItems ?? []).reduce(
    (acc, lineItem) => acc + (lineItem.houseServiceChargeTotal ?? 0),
    0
  )
  const roundedVariableFeeTotal = Math.ceil(variableFeeTotal)

  return (
    <div className={styles.cartTotals}>
      <div className={styles.cartTotals__row}>
        <span className={styles.cartTotals__label}>{t('totals.subtotal')}</span>
        <span className={styles.cartTotals__value}>
          <CoreRocketRezPrice
            data={{
              id: 'subtotal-price',
              price: subtotal
            }}
            valueInCents={false}
          />
        </span>
      </div>

      {discountTotal > 0 && (
        <div className={styles.cartTotals__row}>
          <span className={styles.cartTotals__label}>
            {t('totals.discount')}
          </span>
          <span className={styles.cartTotals__value}>
            <CoreRocketRezPrice
              prefix="-"
              data={{
                id: 'discount-price',
                price: -discountTotal
              }}
              valueInCents={false}
            />
          </span>
        </div>
      )}

      {houseServiceChargeTotal > 0 && (
        <div className={styles.cartTotals__row}>
          <span className={styles.cartTotals__label}>
            {t('summary.house_service_charge')}
          </span>
          <span className={styles.cartTotals__value}>
            <CoreRocketRezPrice
              data={{
                id: 'house-service-charge-price',
                price: houseServiceChargeTotal
              }}
              valueInCents={false}
            />
          </span>
        </div>
      )}

      {roundedVariableFeeTotal > 0 && (
        <div className={styles.cartTotals__row}>
          <span className={styles.cartTotals__label}>{t('summary.ticketing_fee')}</span>
          <span className={styles.cartTotals__value}>
            <CoreRocketRezPrice
              data={{
                id: 'fees-price',
                price: roundedVariableFeeTotal
              }}
              valueInCents={false}
            />
          </span>
        </div>
      )}

      {taxTotal > 0 && (
        <div className={styles.cartTotals__row}>
          <span className={styles.cartTotals__label}>{t('totals.tax')}</span>
          <span className={styles.cartTotals__value}>
            <CoreRocketRezPrice
              data={{
                id: 'tax-price',
                price: taxTotal
              }}
              valueInCents={false}
            />
          </span>
        </div>
      )}

      <div className={styles.cartTotals__total}>
        <span>{t('totals.total')}</span>
        <CoreRocketRezPrice
          data={{
            id: 'total-price',
            price: total
          }}
          valueInCents={false}
        />
      </div>
    </div>
  )
}
