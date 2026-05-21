'use client'

import { usePathname, useRouter } from 'next/navigation'
import { type FC, type ReactNode, useEffect, useMemo, useState } from 'react'
import { ROUTES } from '../../../../config/routes'
import { logger } from '../../../../core/logger/logger'
import { useOrder } from '../../../../features/order'
import { CoreLoadingGuard } from '../../../core-loading-guard'
import { getRedirectPathIfNeeded } from '../../config'

type Props = {
  orderId: string
  children: ReactNode
}

export const OrderWizardGuard: FC<Props> = ({ orderId, children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  const { data: orderData, isLoading } = useOrder({
    id: orderId,
    enabled: Boolean(orderId)
  })

  const target = useMemo(
    () => getRedirectPathIfNeeded(pathname, orderId),
    [pathname, orderId]
  )

  useEffect(() => {
    if (target) {
      logger.info(
        { pathname, target, orderId },
        'order-wizard-guard: redirecting to target path'
      )
      setReady(false)
      router.replace(target)
      return
    }

    if (isLoading) {
      logger.info(
        { pathname, orderId },
        'order-wizard-guard: waiting for order data to load'
      )
      setReady(false)
      return
    }

    const hasValidOrder = Boolean(
      orderData?.order && (orderData.order.lineItems?.length ?? 0) > 0
    )

    if (!hasValidOrder) {
      logger.info(
        {
          pathname,
          orderId,
          hasOrder: Boolean(orderData?.order),
          lineItemsCount: orderData?.order?.lineItems?.length ?? 0
        },
        'order-wizard-guard: invalid order, redirecting to home'
      )
      setReady(false)
      router.replace(ROUTES.FRONTEND.HOME)
      return
    }

    logger.info(
      {
        pathname,
        orderId,
        lineItemsCount: orderData?.order?.lineItems?.length ?? 0
      },
      'order-wizard-guard: guard ready'
    )
    setReady(true)
  }, [isLoading, orderData?.order, orderId, pathname, router, target])

  if (!ready) {
    return (
      <>
        {children}
        <CoreLoadingGuard />
      </>
    )
  }

  return <>{children}</>
}
