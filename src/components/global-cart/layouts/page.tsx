'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { FC, ReactNode } from 'react'
import { ROUTES } from '../../../config/routes'
import { useBookingConfig, useBookingPageReview } from '../../../features/booking'
import { useCart } from '../../../features/cart'
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
  const { data: config } = useBookingConfig()
  const upsellsTitle = config?.upsellsTitle || 'ADD A PIT PASS'
  const upsellsDescription =
    config?.upsellsDescription || 'Perfect for spectators.'
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

              {upsellsDescription && (
                <div className={styles.upsells__description}>
                  <CoreTextMarkdown type="rte">
                    {upsellsDescription}
                  </CoreTextMarkdown>
                </div>
              )}
            </div>

            <Upsell />
          </div>
        )}

        <div className={styles.policySection}>
          <h2 className={styles.policySection__title}>BEFORE YOU FINISH</h2>

          <details className={styles.policySection__accordion}>
            <summary className={styles.policySection__summary}>
              Cancellation Policy
            </summary>
            <div className={styles.policySection__content}>
              <p>
                All Xtreme Xperience Bookings are refundable within 7 calendar days from the purchase date. Note, this does not mean 7 days after your Xperience date. Gift vouchers are final sale and non-refundable.
              </p>
              <p>
                ALL 7-Day refund requests MUST be submitted by email to info@xxspeed.com within 7 days of the original purchase, and are subject to a 5% bank processing fee.
              </p>
              <p>
                7-DAY REFUND GUARANTEE is not applicable if the reserved Event Day is within 7 days of the purchase date.
              </p>
              <p>
                TICKETS MAY NOT BE RESCHEDULED OUTSIDE OF THE EVENT WEEKEND. This ticket is fully transferable to another individual and may be gifted or sold.
              </p>
              <p>
                See our FAQ page for all agreed upon Refund, Reschedule, and Weather policies and procedures.
              </p>
            </div>
          </details>

          <details className={styles.policySection__accordion}>
            <summary className={styles.policySection__summary}>
              Terms &amp; Conditions
            </summary>
            <div className={styles.policySection__content}>
              <p>
                Please refer to our policies page for full terms and conditions.
              </p>
              <p>
                If you have any other questions, feel free to call (866) 273-7727 or email info@xxspeed.com.
              </p>
              <p>
                See you on the track!
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
