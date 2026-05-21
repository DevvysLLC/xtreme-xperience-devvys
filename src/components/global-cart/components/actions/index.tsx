'use client'

import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { CoreCta } from '../../../core-cta'
import styles from './style.module.scss'

type Props = {
  onCheckout?: () => void
  onClear?: () => void
  isLoading?: boolean
  checkoutDisabled?: boolean
  checkoutText?: string
  clearText?: string
  showClear?: boolean
}

export const CartActions: FC<Props> = ({
  onCheckout,
  onClear,
  isLoading = false,
  checkoutDisabled = false,
  checkoutText,
  clearText,
  showClear = false
}) => {
  const t = useTranslations('global_cart')
  const checkoutButtonText = checkoutText ?? t('actions.checkout')
  const clearButtonText = clearText ?? t('actions.clear')

  return (
    <div className={styles.actions}>
      <CoreCta
        text={checkoutButtonText}
        className={styles.actions__button}
        href={null}
        layoutType="button"
        sizeType="small"
        styleType="black"
        onClick={onCheckout}
        disabled={checkoutDisabled || isLoading}
      />

      {showClear && onClear && (
        <CoreCta
          text={clearButtonText}
          className={styles.actions__button}
          href={null}
          layoutType="button"
          sizeType="small"
          styleType="black-transparent"
          onClick={onClear}
          disabled={isLoading}
        />
      )}
    </div>
  )
}
