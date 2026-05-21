'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { useCart } from '../../../../features/cart'
import { CoreIcon } from '../../../core-icon'
import styles from './style.module.scss'

type Props = {
  onClick?: () => void
  className?: string
}

export const CartIcon: FC<Props> = ({ onClick, className }) => {
  const t = useTranslations('global_cart')
  const { data } = useCart()
  const { contents } = data ?? {}
  const { totalItems } = contents

  return (
    <button
      type="button"
      className={clsx(styles['cart-icon'], className)}
      onClick={onClick}
      aria-label={t('icon.aria_label', { count: totalItems })}
    >
      <CoreIcon icon="cart" />
      {totalItems > 0 && (
        <span className={styles['cart-icon__badge']}>{totalItems}</span>
      )}
    </button>
  )
}
