'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ROUTES } from '../../../../config/routes'
import { useAnalyticsEcommerceEvent } from '../../../../features/analytics'
import { useCart } from '../../../../features/cart'
import { useCheckoutPagePayment } from '../../../../features/checkout'
import { useToast } from '../../../../features/toast'
import { CoreCta } from '../../../core-cta'
import { CartSummary } from '../../../global-cart/components/summary'
import { PageFooter } from '../../components/page-footer'
import { PaymentV2 } from '../../components/payment-v2'
import { Placeholder } from '../../components/placeholder'

import styles from './style.module.scss'

const USE_PLACEHOLDER = false

export const PaymentPage = () => {
  const t = useTranslations('payment_page')
  const analytics = useAnalyticsEcommerceEvent()
  const cart = useCart()
  const addPaymentInfoTrackedRef = useRef(false)
  const { isValid, save } = useCheckoutPagePayment()
  const { showToast } = useToast()
  const [isPaymentComplete, setIsPaymentComplete] = useState(false)

  // Track add_payment_info when user lands on payment page
  useEffect(() => {
    const cartData = cart.data?.cartData
    if (
      !addPaymentInfoTrackedRef.current &&
      cartData &&
      (cartData.lineItems?.length ?? 0) > 0
    ) {
      analytics.trackAddPaymentInfo(cartData, cart.data.metadata)
      addPaymentInfoTrackedRef.current = true
    }
  }, [analytics, cart.data?.cartData, cart.data.metadata])

  const handlePaymentComplete = useCallback(
    async (orderId: string) => {
      await save({
        value: orderId,
        pageIsValid: isValid,
        userHasSubmitted: true
      })
      setIsPaymentComplete(true)
      showToast({
        message: t('toast.success'),
        type: 'success'
      })
    },
    [isValid, save, showToast, t]
  )

  const handlePaymentError = useCallback(() => {
    showToast({
      message: t('toast.error'),
      type: 'error'
    })
  }, [showToast, t])

  return (
    <section className={styles.payment}>
      <header className={styles.payment__header}>
        <div>
          <CoreCta
            text={t('button.back')}
            className={styles.payment__cta}
            href={ROUTES.CHECKOUT.CONTACTS}
            layoutType="text"
            styleType="black"
            icon="arrow-left"
            iconPosition="left"
            sizeType="medium"
          />
        </div>
        <h1 className={styles.payment__title}>{t('title')}</h1>
      </header>

      <div className={styles.payment__content}>
        <>
          {USE_PLACEHOLDER ? (
            <Placeholder />
          ) : (
            <PaymentV2
              onPaymentComplete={handlePaymentComplete}
              onPaymentError={handlePaymentError}
            />
          )}
        </>
      </div>

      <div className={styles.payment__summary}>
        <CartSummary />
      </div>

      <PageFooter
        backText={t('button.back')}
        backHref={ROUTES.CHECKOUT.CONTACTS}
        submitText={t('button.checkout')}
        disabled={!isPaymentComplete}
      />
    </section>
  )
}
