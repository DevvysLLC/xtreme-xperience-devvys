'use client'

import { useTranslations } from 'next-intl'
import { ROUTES } from '../../../../config/routes'
import { useBookingConfig } from '../../../../features/booking'
import { useOrder } from '../../../../features/order'
import { PageFooter } from '../../../checkout-wizard/components/page-footer'
import { CoreTextMarkdown } from '../../../core-text-markdown'
import { CartLineItems } from '../../../global-cart'
import { OrderSummary } from '../../components/summary'
import styles from './style.module.scss'

type OrderPageProps = {
  id: string
}

export const OrderPage = ({ id }: OrderPageProps) => {
  const t = useTranslations('order_wizard.page_complete')
  const orderId = id

  const { data: orderData, isLoading } = useOrder({
    id: orderId,
    enabled: !!orderId
  })

  const bookingConfig = useBookingConfig()
  const orderCompleteNotice = bookingConfig?.data?.orderCompleteNotice ?? null
  const cancellationPolicy = bookingConfig?.data?.cancellationPolicy ?? null
  const order = orderData?.order
  const metadata = orderData?.metadata ?? []
  const lineItems = order?.lineItems ?? []
  const isValidOrder = orderId && orderData && order && lineItems.length > 0

  return (
    <section className={styles.order}>
      <header className={styles.order__header}>
        <h1 className={styles.order__title}>{t('title')}</h1>
        <p className={styles.order__description}>
          {t('description', { orderNumber: orderId || 'N/A' })}
        </p>
      </header>

      <div className={styles.order__content}>
        {isLoading ? (
          <p>{t('status.loading')}</p>
        ) : isValidOrder ? (
          <CartLineItems
            lineItems={lineItems}
            readOnly={true}
            metadata={metadata}
          />
        ) : (
          <p>{t('error.missing_order_id')}</p>
        )}
        <div className={styles.order__notices}>
          {orderCompleteNotice && (
            <div className={styles.order__notice}>
              <CoreTextMarkdown type="rte">
                {orderCompleteNotice}
              </CoreTextMarkdown>
            </div>
          )}
          {cancellationPolicy && (
            <div className={styles.order__notice}>
              <CoreTextMarkdown type="rte">
                {cancellationPolicy}
              </CoreTextMarkdown>
            </div>
          )}
        </div>
      </div>

      <div className={styles.order__summary}>
        {isValidOrder && order && <OrderSummary order={order} />}
      </div>

      <PageFooter
        submitText={t('button.home')}
        onSubmit={() => {
          window.location.assign(ROUTES.FRONTEND.HOME)
        }}
      />
    </section>
  )
}
