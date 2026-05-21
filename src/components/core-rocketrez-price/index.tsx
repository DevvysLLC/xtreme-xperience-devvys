'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { formatMoney } from '../../utils/format-money'
import styles from './style.module.scss'

export type CoreRocketRezPriceData = {
  id: number | string
  price: number | null
  compareAtPrice?: number | null
}

export type Props = {
  data: CoreRocketRezPriceData
  showPrefix?: boolean
  showSuffix?: boolean
  prefix?: string | null
  suffix?: string | null
  hideOnSale?: boolean
  className?: string | null
  priceClassName?: string | null
  showCurrencySymbol?: boolean
  showCents?: boolean
  valueInCents?: boolean
}

export const CoreRocketRezPrice = ({
  data,
  showPrefix = false,
  showSuffix = false,
  prefix = null,
  suffix = null,
  hideOnSale = false,
  className = null,
  priceClassName = null,
  showCurrencySymbol = true,
  showCents = false,
  valueInCents = false
}: Props) => {
  const t = useTranslations('core_rocketrez_price')
  const { price, compareAtPrice } = data
  const resolvedPrefix = prefix ?? (showPrefix ? t('prefix') : null)
  const resolvedSuffix = suffix ?? (showSuffix ? t('suffix') : null)

  const formatPrice = (value: number) => {
    // For RocketRez prices without cents, round up if there are decimals
    const processedValue =
      !showCents && !valueInCents && value % 1 !== 0 ? Math.ceil(value) : value

    return formatMoney(processedValue, {
      showDollarSign: showCurrencySymbol,
      showCents,
      valueInCents
    })
  }

  const isOnSale =
    compareAtPrice !== null &&
    compareAtPrice !== undefined &&
    price !== null &&
    compareAtPrice > price

  return (
    <span className={clsx(styles.price, className)} data-core-price>
      {resolvedPrefix && <span data-price-prefix>{resolvedPrefix}</span>}
      {isOnSale && !hideOnSale && (
        <s data-compare-at-price className={styles.price__compare}>
          {formatPrice(compareAtPrice)}
        </s>
      )}
      {price !== null && (
        <span
          data-price
          className={clsx(styles.price__regular, priceClassName)}
        >
          {formatPrice(price)}
        </span>
      )}
      {resolvedSuffix && <span data-price-suffix>{resolvedSuffix}</span>}
    </span>
  )
}
