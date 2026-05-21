'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef } from 'react'
import { ROUTES } from '../../../../config/routes'
import { useAnalyticsEcommerceEvent } from '../../../../features/analytics'
import { useCartClearAfterComplete } from '../../../../features/cart'
import { useOrder, useOrderMarkViewed } from '../../../../features/order'
import { CoreCta } from '../../../core-cta'
import { CoreLoadingGuard } from '../../../core-loading-guard'
import { PageFooter } from '../../components/page-footer'
import styles from './style.module.scss'

const trackedPurchaseIds = new Set<string>()

const REDIRECT_DELAY = 5000

type CompletPageProps = {
  id: string
}

export const CompletePage = ({ id }: CompletPageProps) => {
  const t = useTranslations('complete_page')
  const orderId = id
  const analytics = useAnalyticsEcommerceEvent()
  const purchaseTrackedRef = useRef(false)
  const { mutateAsync: markOrderViewed } = useOrderMarkViewed(orderId)
  const clearAfterComplete = useCartClearAfterComplete()

  // Fetch order from API
  const { data: orderData, isLoading } = useOrder({
    id: orderId,
    enabled: !!orderId
  })

  const order = orderData?.order
  const lineItems = order?.lineItems ?? []

  const isValidOrder = orderId && orderData && order && lineItems.length > 0

  // Redirect to the order page if this order has already been viewed
  useEffect(() => {
    if (!isLoading && orderData?.viewedAt) {
      window.location.replace(ROUTES.ORDER.BY_ID(orderId))
    }
  }, [isLoading, orderData?.viewedAt, orderId])

  // Clear checkout, mark order as viewed, and navigate to the order page.
  // Shared by the automatic redirect (after analytics) and the manual
  // "View Order" button so both paths clean up identically.
  const handleViewOrder = useCallback(async () => {
    clearAfterComplete()
    try {
      await markOrderViewed(undefined)
    } catch {
      // Best-effort — don't block navigation if marking viewed fails
    }
    window.location.assign(ROUTES.ORDER.BY_ID(orderId))
  }, [clearAfterComplete, markOrderViewed, orderId])

  // Keep the handler in a ref so the redirect timer's closure is stable.
  // Without this, the effect below would re-run every time markOrderViewed
  // (from useMutation) gets a new identity, clearing the timeout while the
  // purchaseTrackedRef guard prevents re-creating it.
  const handleViewOrderRef = useRef(handleViewOrder)
  handleViewOrderRef.current = handleViewOrder

  // Track purchase, then wait for the analytics event to send before
  // clearing checkout state, marking viewed, and redirecting. The delay
  // gives the purchase event time to flush to the analytics provider.
  // Checkout state must stay intact until after the analytics event fires —
  // the wizard guard relies on it to keep this page accessible.
  useEffect(() => {
    if (
      !purchaseTrackedRef.current &&
      !trackedPurchaseIds.has(orderId) &&
      isValidOrder &&
      order &&
      orderId
    ) {
      analytics.trackPurchase(order, orderId, [])
      purchaseTrackedRef.current = true
      trackedPurchaseIds.add(orderId)

      const timer = setTimeout(() => {
        handleViewOrderRef.current()
      }, REDIRECT_DELAY)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [analytics, isValidOrder, order, orderId])

  return (
    <section className={styles.complete}>
      <header className={styles.complete__header}>
        <div>
          <CoreCta
            text={t('button.home')}
            className={styles.complete__cta}
            href={ROUTES.FRONTEND.HOME}
            layoutType="text"
            styleType="black"
            icon="arrow-left"
            iconPosition="left"
            sizeType="medium"
          />
        </div>

        <h1 className={styles.complete__title}>{t('title')}</h1>
        <p className={styles.complete__description}>
          {t('description', { orderNumber: orderId || 'N/A' })}
        </p>
      </header>

      <div className={styles.complete__content}>
        {isLoading ? (
          <p>{t('status.loading')}</p>
        ) : !isValidOrder ? (
          <p>{t('error.missing_order_id')}</p>
        ) : null}
      </div>

      <div className={styles.complete__summary}></div>

      <CoreLoadingGuard />

      <PageFooter
        backText={t('button.home')}
        backHref={ROUTES.FRONTEND.HOME}
        submitText={t('button.view_order')}
        onSubmit={handleViewOrder}
      />
    </section>
  )
}
