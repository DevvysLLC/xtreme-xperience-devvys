'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { FC, ReactNode } from 'react'
import { ROUTES } from '../../../config/routes'
import { useBookingPageReview } from '../../../features/booking'
import { useCart } from '../../../features/cart'
import { useBookingWizardState } from '../../booking-wizard/context'
import { CoreTextMarkdown } from '../../core-text-markdown'
import { CartActions } from '../components/actions'
import { CartLineItems } from '../components/items'
import { CartSummary } from '../components/summary'
import { Upsell } from '../components/upsell'
import styles from './page.module.scss'

type Props = {
  readOnly?: boolean
  title?: ReactNode
  description?: ReactNode
  showActions?: boolean
}

export const CartPage: FC<Props> = ({
  readOnly = false,
  title,
  description,
  showActions = true
}) => {
  const t = useTranslations('global_cart')
  const { data, isLoading, isRefreshing } = useCart()
  const lineItems = data?.cartData?.lineItems ?? []
  const pageHook = useBookingPageReview()
  const { state } = useBookingWizardState()
  const upsellsTitle = state?.configData?.upsellsTitle || t('upsells.title')
  const upsellsDescription =
    state?.configData?.upsellsDescription || t('upsells.description')
  const cancellationPolicy = state?.configData?.cancellationPolicy || null
  const router = useRouter()

  const handleCheckout = async () => {
    const pageIsValid = pageHook.isValid()
    await pageHook.set({
      value: {
        isValid: pageIsValid,
        isSubmitted: true
      },
      pageIsValid,
      userHasSubmitted: true
    })
    router.push(ROUTES.CHECKOUT.CONTACTS)
  }

  return (
    <section className={clsx(styles.cart)}>
      <header className={styles.cart__header}>
        <h1 className={styles.cart__title}>{title ?? t('header.title')}</h1>
        {description && (
          <p className={styles.cart__description}>{description}</p>
        )}
      </header>

      <div className={styles.cart__summary}>
        <CartSummary />

        {!readOnly && showActions && (
          <CartActions onCheckout={handleCheckout} />
        )}
      </div>

      <div
        className={clsx(
          styles.cart__content,
          isLoading && styles['is-loading'],
          isRefreshing && styles['is-refreshing']
        )}
      >
        <CartLineItems lineItems={lineItems} readOnly={readOnly} />

        {!readOnly && (
          <div className={styles.upsells}>
            <div className={styles.upsells__header}>
              <h2 className={styles.upsells__title}>{upsellsTitle}</h2>

              <div className={styles.upsells__description}>
                <CoreTextMarkdown type="rte">
                  {upsellsDescription}
                </CoreTextMarkdown>
              </div>
            </div>

            <Upsell />
          </div>
        )}

        {cancellationPolicy && (
          <div className={styles.cart__policy}>
            <CoreTextMarkdown type="rte">{cancellationPolicy}</CoreTextMarkdown>
          </div>
        )}
      </div>
    </section>
  )
}
