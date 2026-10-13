'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { FC, ReactNode } from 'react'
import { ROUTES } from '../../../config/routes'
import { useBookingPageReview } from '../../../features/booking'
import { useCart } from '../../../features/cart'
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
        {showActions && (
          <CartLineItems lineItems={lineItems} readOnly={readOnly} />
        )}

        {!readOnly && (
          <div className={styles.upsells}>
            <div className={styles.upsells__header}>
              <h2 className={styles.upsells__title}>MAKE IT A DAY TO REMEMBER.</h2>

              <div className={styles.upsells__description}>
                <p>A few optional extras for you and your crew.</p>
              </div>
            </div>

            <Upsell />
          </div>
        )}

        <div className={styles.policySection}>
          <h2 className={styles.policySection__title}>BEFORE YOU FINISH</h2>

          <details className={styles.policySection__accordion} open>
            <summary className={styles.policySection__summary}>
              Cancellation Policy
            </summary>
            <div className={styles.policySection__content}>
              <p>
                <strong>Refunds are based on purchase date, not drive date.</strong>{' '}
                Eligible bookings can be refunded within 7 calendar days of purchase,
                less a 5% processing fee. Gift cards and vouchers are final sale.
              </p>
              <p>
                The 7-day refund guarantee does not apply when your event is within 7 days
                of purchase. Email refund requests to{' '}
                <a href="mailto:info@xxspeed.com">info@xxspeed.com</a> within the eligible window.
              </p>
              <p>
                After 7 days, experiences are non-refundable. Tickets can be transferred to another eligible participant; rescheduling is
                limited to the original event weekend.
              </p>
              <p>
                <a href="/policies" className={styles.policySection__link}>
                  Read the full cancellation and rescheduling policies &nearr;
                </a>
              </p>
            </div>
          </details>

          <details className={styles.policySection__accordion} open>
            <summary className={styles.policySection__summary}>
              Terms &amp; Conditions
            </summary>
            <div className={styles.policySection__content}>
              <p>
                Drivers must be 18 or older with a valid driver&apos;s license. Participants must meet eligibility requirements and complete the liability waiver. Driver protection is required for drives.
              </p>
              <p>
                No-shows forfeit their booking. Weather or vehicle availability may affect your reservation; see the full policies for applicable changes and restrictions.
              </p>
              <p>
                <a href="/terms" className={styles.policySection__link}>
                  Read full Terms &amp; Conditions &nearr;
                </a>
              </p>
            </div>
          </details>

          <div className={styles.policySection__contact}>
            Questions? <a href="tel:8662737727">(866) 273-7727</a> &bull;{' '}
            <a href="mailto:info@xxspeed.com">info@xxspeed.com</a>
          </div>
        </div>
      </div>
    </section>
  )
}
