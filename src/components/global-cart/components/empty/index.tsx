'use client'

import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { CoreIcon } from '../../../core-icon'
import styles from './style.module.scss'

type Props = {
  onBrowse?: () => void
}

export const CartEmpty: FC<Props> = ({ onBrowse }) => {
  const t = useTranslations('global_cart')

  return (
    <div className={styles['cart-empty']}>
      <div className={styles['cart-empty__icon']}>
        <CoreIcon icon="cart" />
      </div>
      <h3 className={styles['cart-empty__title']}>{t('empty.title')}</h3>
      <p className={styles['cart-empty__message']}>{t('empty.message')}</p>
      {onBrowse && (
        <button
          type="button"
          className={styles['cart-empty__button']}
          onClick={onBrowse}
        >
          {t('empty.browse')}
        </button>
      )}
    </div>
  )
}
