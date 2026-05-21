'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { ROUTES } from '../../config/routes'
import { useBookingConfig } from '../../features/booking'
import { CoreBrand } from '../core-brand'
import { CoreCta } from '../core-cta'
import { CoreIcon } from '../core-icon'
import styles from './style.module.scss'

type Props = {
  showCart?: boolean
}

export const BookingHeader: FC<Props> = ({ showCart = true }) => {
  const t = useTranslations('booking_header')
  const { data } = useBookingConfig()
  const backLink = data?.showBackLink && data.backLink ? data.backLink : null

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href={ROUTES.FRONTEND.HOME} className={styles.logo}>
          <CoreBrand />
        </Link>
      </div>

      {backLink && (
        <CoreCta
          data={backLink}
          className={styles.backLink}
          layoutType="underline"
          styleType="black"
          sizeType="large"
        />
      )}

      {showCart && (
        <button type="button" className={styles.cart} aria-label={t('cart')}>
          <CoreIcon icon="cart" />
        </button>
      )}
    </header>
  )
}
