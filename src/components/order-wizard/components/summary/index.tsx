'use client'

import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import type { RocketRezCart } from '../../../../io/types'
import { CoreRocketRezPrice } from '../../../core-rocketrez-price'
import styles from './style.module.scss'

type Props = {
  order: RocketRezCart
}

export const OrderSummary: FC<Props> = ({ order }) => {
  const t = useTranslations('order_wizard.order_summary')
  const subtotal = order.subTotal ?? 0
  const ticketingFee = order.variableFeeTotal ?? 0
  const total = order.total ?? 0
  const discountTotal = order.discountTotal ?? 0
  const coupons = order.coupons ?? []

  return (
    <div className={styles.summary}>
      <h2 className={styles.summary__title}>{t('title')}</h2>

      <hr className={styles.summary__divider} />

      {coupons.length > 0 && (
        <div className={styles.summary__coupons}>
          {coupons.map((coupon) => (
            <div key={coupon.id} className={styles.summary__coupon}>
              <span>{coupon.code ?? coupon.serial ?? ''}</span>
              {coupon.description && (
                <span className={styles.summary__couponDescription}>
                  {coupon.description}
                </span>
              )}
            </div>
          ))}
          <hr className={styles.summary__divider} />
        </div>
      )}

      <div className={styles.summary__data}>
        <strong className={styles.summary__label}>{t('subtotal')}</strong>

        <CoreRocketRezPrice
          className={styles.summary__value}
          data={{
            id: 'summary-subtotal',
            price: subtotal
          }}
        />
      </div>

      {discountTotal > 0 && (
        <div className={styles.summary__data}>
          <strong className={styles.summary__label}>{t('discount')}</strong>

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

      <div className={styles.summary__data}>
        <span className={styles.summary__label}>{t('ticketing_fee')}</span>

        <CoreRocketRezPrice
          className={styles.summary__value}
          data={{
            id: 'summary-ticketing-fee',
            price: ticketingFee
          }}
        />
      </div>

      <hr className={styles.summary__divider} />

      <div className={styles.summary__total}>
        <strong className={styles.summary__label}>{t('total')}</strong>

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
