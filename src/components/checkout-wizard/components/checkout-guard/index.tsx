'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  type FC,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { ROUTES } from '../../../../config/routes'
import { logger } from '../../../../core/logger/logger'
import { useCheckoutWithCart } from '../../../../features/checkout'
import { CoreLoadingGuard } from '../../../core-loading-guard'
import { isSubmittedPageValid } from '../../../wizard-contract'
import {
  checkoutWizardConfig,
  getNextPagePath,
  getRedirectPathIfNeeded
} from '../../config'

type Props = { children: ReactNode }

export const CheckoutWizardGuard: FC<Props> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { checkout, cart, isLoading } = useCheckoutWithCart()

  const target = useMemo(
    () => getRedirectPathIfNeeded(pathname, checkout ?? null),
    [pathname, checkout]
  )

  const [ready, setReady] = useState(false)
  const handledSubmitAtByPageRef = useRef<Record<string, string | null>>({})

  // Complete page is post-checkout — cart is intentionally cleared after payment
  const isCompletePage = pathname.startsWith('/checkout/complete')

  useEffect(() => {
    if (isCompletePage) {
      logger.info(
        { pathname },
        'checkout-wizard-guard: complete page detected, skipping guard redirects'
      )
      setReady(true)
      return
    }

    if (isLoading) {
      logger.info(
        {
          pathname,
          totalItems: cart.contents.totalItems
        },
        'checkout-wizard-guard: Waiting for cart data to load'
      )
      setReady(false)
      return
    }

    // If cart is empty redirect to home page
    if (cart.contents.totalItems === 0) {
      logger.info(
        {
          pathname,
          totalItems: cart.contents.totalItems
        },
        'checkout-wizard-guard: Redirecting to booking home (cart is empty)'
      )
      router.replace(ROUTES.FRONTEND.HOME)
      setReady(false)
      return
    }

    if (target && target !== pathname) {
      logger.info(
        { pathname, target },
        'checkout-wizard-guard: redirecting to target path'
      )
      setReady(false)
      router.replace(target)
      return
    }

    const enabledPages = checkoutWizardConfig.pages.filter(
      (page) => page.enabled
    )
    const currentIndex = enabledPages.findIndex(
      (page) => page.path === pathname
    )
    const currentPage = enabledPages[currentIndex]
    if (currentPage) {
      const currentPageState =
        currentPage.id === 'details' ? checkout?.details : checkout?.payment
      const currentPageIsSubmittedAndValid =
        isSubmittedPageValid(currentPageState)
      const currentPageSubmitAt = currentPageState?.lastSubmittedAt ?? null
      const hasSeenCurrentPage = Object.hasOwn(
        handledSubmitAtByPageRef.current,
        currentPage.id
      )

      if (!hasSeenCurrentPage) {
        logger.info(
          { pathname, pageId: currentPage.id, currentPageSubmitAt },
          'checkout-wizard-guard: first visit for page'
        )
        handledSubmitAtByPageRef.current[currentPage.id] = currentPageSubmitAt
        setReady(true)
        return
      }

      const lastHandledSubmitAt =
        handledSubmitAtByPageRef.current[currentPage.id] ?? null
      const hasNewSubmitEvent = Boolean(
        currentPageSubmitAt && currentPageSubmitAt !== lastHandledSubmitAt
      )
      const completedOrderId = checkout?.payment?.value

      if (
        pathname === ROUTES.CHECKOUT.PAYMENT &&
        hasNewSubmitEvent &&
        currentPageIsSubmittedAndValid &&
        completedOrderId
      ) {
        logger.info(
          { pathname, pageId: currentPage.id, completedOrderId },
          'checkout-wizard-guard: redirecting to complete page after payment submit'
        )
        handledSubmitAtByPageRef.current[currentPage.id] = currentPageSubmitAt
        setReady(false)
        router.replace(ROUTES.CHECKOUT.COMPLETE(completedOrderId))
        return
      }

      if (hasNewSubmitEvent && currentPageIsSubmittedAndValid) {
        logger.info(
          { pathname, pageId: currentPage.id, currentPageSubmitAt },
          'checkout-wizard-guard: redirecting to next page after submit'
        )
        handledSubmitAtByPageRef.current[currentPage.id] = currentPageSubmitAt
        const nextPath = getNextPagePath(pathname)
        if (nextPath && nextPath !== pathname) {
          logger.info(
            { pathname, nextPath },
            'checkout-wizard-guard: next path found, redirecting'
          )
          setReady(false)
          router.replace(nextPath)
          return
        }

        logger.info(
          { pathname, nextPath },
          'checkout-wizard-guard: next path missing, staying on current page'
        )
      }

      if (!hasNewSubmitEvent) {
        logger.info(
          { pathname, pageId: currentPage.id, currentPageSubmitAt },
          'checkout-wizard-guard: no new submit event, staying on current page'
        )
      } else if (!currentPageIsSubmittedAndValid) {
        logger.info(
          { pathname, pageId: currentPage.id, currentPageIsSubmittedAndValid },
          'checkout-wizard-guard: submit event ignored because page is not submitted and valid'
        )
      }
    } else {
      logger.info(
        { pathname },
        'checkout-wizard-guard: current path is not a wizard page'
      )
    }

    logger.info({ pathname }, 'checkout-wizard-guard: guard ready')
    setReady(true)
  }, [
    cart.contents.totalItems,
    checkout?.details,
    checkout?.payment,
    isCompletePage,
    isLoading,
    pathname,
    target,
    router
  ])

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
