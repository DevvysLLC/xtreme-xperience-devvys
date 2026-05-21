'use client'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { formatMoney } from '../../utils/format-money'
import type { CorePriceFragment } from './core-price.typegen'
import styles from './style.module.scss'

export type Props = {
  data: CorePriceFragment
  showPrefix?: boolean
  showSuffix?: boolean
  hideOnSale?: boolean
  className?: string | null
  showCurrencySymbol?: boolean
  /**
   * Display cents in price formatting
   * @default false
   * @note Changed from `true` to `false` in 2026-01 to display cleaner prices
   *       (e.g., "$100" instead of "$100.00") across the site
   */
  showCents?: boolean
  valueInCents?: boolean
}

export const CorePrice = ({
  data,
  showPrefix = false,
  showSuffix = false,
  hideOnSale = false,
  className = null,
  showCurrencySymbol = true,
  showCents = false, // Changed default: was `true`, now `false` for cleaner price display
  valueInCents = true
}: Props) => {
  const t = useTranslations('core_price')
  const { price, compareAtPrice } = data

  const formatPrice = (value: number) =>
    formatMoney(value, {
      showDollarSign: showCurrencySymbol,
      showCents,
      valueInCents
    })

  const isOnSale =
    compareAtPrice !== null && price !== null && compareAtPrice > price

  return (
    <span className={clsx(styles.price, className)} data-core-price>
      {showPrefix && <span data-price-prefix>{t('prefix')}</span>}
      {isOnSale && !hideOnSale && (
        <s data-compare-at-price className={styles.price__compare}>
          {formatPrice(compareAtPrice)}
        </s>
      )}
      {price !== null && (
        <span data-price className={styles.price__regular}>
          {formatPrice(price)}
        </span>
      )}
      {showSuffix && <span data-price-suffix>{t('suffix')}</span>}
    </span>
  )
}
