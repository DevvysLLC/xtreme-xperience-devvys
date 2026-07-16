'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { logger } from '../../../../core/logger/logger'
import {
  useCart,
  useCartComplete,
  useCartState
} from '../../../../features/cart'
import {
  useCheckoutGatewayClientSecret,
  useRocketRezPayment
} from '../../../../features/checkout'
import type { RocketRezPaymentRequest } from '../../../../io/types'
import { CartKeyHelpers } from '../../../../utils/cart-key'
import { CoreCta } from '../../../core-cta'
import { CoreLoadingSpinner } from '../../../core-loading-spinner'
import styles from './style.module.scss'

const IFRAME_URL_RAW =
  process.env.NEXT_PUBLIC_ROCKET_REZ_PAYMENTS_API_IFRAME_URL

const IFRAME_ALLOWED_ORIGIN_RAW =
  process.env.NEXT_PUBLIC_ROCKET_REZ_PAYMENTS_API_ALLOWED_ORIGIN

const IFRAME_TARGET_ORIGIN_RAW =
  process.env.NEXT_PUBLIC_ROCKET_REZ_PAYMENTS_API_TARGET_ORIGIN

const IFRAME_URL =
  IFRAME_URL_RAW?.startsWith('https://') === true ? IFRAME_URL_RAW : null

const PARENT_REDIRECT_STATE_STORAGE_KEY =
  'checkout.payment.parent-redirect-state'

type ParentRedirectState = {
  cartId: number | string
  cartToken: string
  userGuid: string
  paymentMethodId: number
  paymentRequest: RocketRezPaymentRequest
}

type ResumePaymentState = ParentRedirectState & {
  clientSecret: string
  redirectStatus?: string
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const isParentRedirectState = (
  value: unknown
): value is ParentRedirectState => {
  if (!isRecord(value)) {
    return false
  }

  return (
    (typeof value.cartId === 'string' || typeof value.cartId === 'number') &&
    typeof value.cartToken === 'string' &&
    typeof value.userGuid === 'string' &&
    typeof value.paymentMethodId === 'number' &&
    isRecord(value.paymentRequest)
  )
}

type PaymentProps = {
  onPaymentComplete?: (orderId: string) => Promise<void>
  onPaymentError?: () => void
}

export const PaymentV2 = ({
  onPaymentComplete,
  onPaymentError
}: PaymentProps = {}) => {
  const t = useTranslations('payment_page')
  const { data } = useCart()
  const cartData = data?.cartData
  const clientSecretMutation = useCheckoutGatewayClientSecret()
  const completeCart = useCartComplete()

  const { data: cartState } = useCartState()
  const cartKey = cartState.cartKey ?? null

  // Parse cart key to get cartId and cartToken
  const cartKeyParsed = useMemo(() => {
    if (!cartKey) {
      return null
    }
    return CartKeyHelpers.parse(cartKey)
  }, [cartKey])

  const cartId = cartKeyParsed?.cartId ?? null
  const cartToken = cartKeyParsed?.cartToken ?? null
  const [resumePayment, setResumePayment] = useState<ResumePaymentState | null>(
    null
  )

  const userGuid = clientSecretMutation.data?.data?.userGuid ?? ''
  const paymentMethodId =
    clientSecretMutation.data?.data?.paymentMethodId ?? null

  // Get client secret
  const clientSecret =
    clientSecretMutation.data?.data?.result?.data?.clientSecret ?? null

  const {
    data: csData,
    isPending: csIsPending,
    isError: csIsError,
    mutate: csMutate
  } = clientSecretMutation
  const isIframeEnvMissing = !IFRAME_URL
  const returnUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return null
    }

    try {
      const url = new URL(window.location.href)
      url.searchParams.delete('payment_intent_client_secret')
      url.searchParams.delete('redirect_status')
      url.searchParams.delete('payment_intent')
      url.hash = 'checkout-iframe'
      return url.toString()
    } catch {
      return `${window.location.origin}${window.location.pathname}#checkout-iframe`
    }
  }, [])

  useEffect(() => {
    if (isIframeEnvMissing) {
      return
    }
    if (cartKey && !csData && !csIsPending && !csIsError) {
      csMutate(undefined)
    }
  }, [isIframeEnvMissing, cartKey, csData, csIsPending, csIsError, csMutate])

  useEffect(() => {
    if (isIframeEnvMissing) {
      logger.error(
        'Payment: NEXT_PUBLIC_ROCKET_REZ_PAYMENTS_API_IFRAME_URL is not set or does not use https'
      )
    }
  }, [isIframeEnvMissing])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const url = new URL(window.location.href)
    const redirectClientSecret = url.searchParams.get(
      'payment_intent_client_secret'
    )

    if (!redirectClientSecret) {
      return
    }

    const redirectStatus = url.searchParams.get('redirect_status') ?? undefined
    const rawSavedState = window.sessionStorage.getItem(
      PARENT_REDIRECT_STATE_STORAGE_KEY
    )

    if (!rawSavedState) {
      logger.error(
        'Payment: Redirect params detected but no saved redirect state found'
      )
      return
    }

    try {
      const parsed: unknown = JSON.parse(rawSavedState)
      if (!isParentRedirectState(parsed)) {
        logger.error(
          { parsed },
          'Payment: Saved redirect state has invalid shape'
        )
        return
      }

      url.searchParams.delete('payment_intent_client_secret')
      url.searchParams.delete('redirect_status')
      url.searchParams.delete('payment_intent')
      window.history.replaceState({}, document.title, url.toString())

      setResumePayment({
        ...parsed,
        clientSecret: redirectClientSecret,
        redirectStatus
      })
      logger.info(
        { redirectStatus },
        'Payment: Redirect return detected, resume state restored'
      )
    } catch (error) {
      logger.error(
        { error },
        'Payment: Failed to parse saved redirect state for payment resume'
      )
    }
  }, [])

  const isCompletingOrderRef = useRef(false)
  const clearPersistedRedirectState = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }
    logger.info('Payment: Clearing persisted parent redirect state')
    window.sessionStorage.removeItem(PARENT_REDIRECT_STATE_STORAGE_KEY)
  }, [])

  // Build payment request from cart and contact data
  const paymentRequest = useMemo<RocketRezPaymentRequest | null>(() => {
    if (!cartData || !cartId || !paymentMethodId) {
      return null
    }

    // Get primary contact or first contact
    const contact =
      cartData.contacts?.find((c) => c.isPrimary) || cartData.contacts?.[0]

    if (!contact) {
      logger.warn('Payment: No contact found in cart data')
      return null
    }

    const paymentTotal = cartData.total

    return {
      PaymentMethodId: paymentMethodId,
      CartId: cartId,
      PaymentTotal: paymentTotal,
      ...(returnUrl ? { returnUrl } : {}),
      RecaptchaToken: null,
      FirstName: contact.firstName ?? null,
      LastName: contact.lastName ?? null,
      Email: contact.email ?? null,
      CompanyName: null,
      MobilePhoneNumber: contact.phone ?? null,
      HomePhoneNumber: null,
      BillingAddress: contact.billingAddress
        ? {
            Address1: contact.billingAddress.addressLine1 ?? null,
            Address2: contact.billingAddress.addressLine2 ?? null,
            City: contact.billingAddress.city ?? null,
            CountryShortName2: contact.billingAddress.country ?? null,
            ProvinceId: null,
            PostalCode: contact.billingAddress.postalCode ?? null
          }
        : null,
      SMSConsent: false,
      CreditCard: {
        Type: null,
        Cvv: null,
        Expiry: null,
        Name: null,
        Number: null
      },
      allowSecondaryPayments: true,
      SecondaryPayments: []
    }
  }, [cartData, cartId, paymentMethodId, returnUrl])

  const handlePaymentSuccess = useCallback(
    async (d: {
      orderId?: string | number
      paymentIntentId?: string
      status?: string
    }) => {
      const iframeOrderId = d.orderId
      logger.info({ orderId: iframeOrderId }, 'Payment: Payment successful')
      clearPersistedRedirectState()

      if (isCompletingOrderRef.current) {
        logger.warn({}, 'Payment: Already completing order, skipping')
        return
      }

      isCompletingOrderRef.current = true

      try {
        if (onPaymentComplete) {
          const result = await completeCart.mutateAsync(undefined)
          await onPaymentComplete(String(result.order.externalId))
          return
        }

        logger.warn({}, 'Payment: onPaymentComplete callback missing')
      } catch (error) {
        logger.error(
          { error, orderId: iframeOrderId },
          'Payment: Failed to complete order'
        )

        if (iframeOrderId != null && onPaymentComplete) {
          logger.warn(
            { iframeOrderId },
            'Payment: Falling back to iframe orderId'
          )
          await onPaymentComplete(String(iframeOrderId))
          return
        }
        onPaymentError?.()
      } finally {
        // Always reset the guard so the user can retry if something went
        // wrong. In the success path the component unmounts anyway, so
        // resetting is harmless.
        isCompletingOrderRef.current = false
      }
    },
    [
      clearPersistedRedirectState,
      onPaymentComplete,
      onPaymentError,
      completeCart
    ]
  )

  // Handle payment error
  const handlePaymentError = useCallback(() => {
    logger.error('Payment: Payment failed')
    clearPersistedRedirectState()
    onPaymentError?.()
  }, [clearPersistedRedirectState, onPaymentError])

  const resolvedCartId = resumePayment?.cartId ?? cartId
  const resolvedCartToken = resumePayment?.cartToken ?? cartToken
  const resolvedUserGuid = resumePayment?.userGuid ?? userGuid
  const resolvedPaymentMethodId =
    resumePayment?.paymentMethodId ?? paymentMethodId
  const resolvedClientSecret = resumePayment?.clientSecret ?? clientSecret
  const resolvedPaymentRequest = resumePayment?.paymentRequest ?? paymentRequest

  const handleResumePaymentDispatched = useCallback(() => {
    setResumePayment((current) => {
      if (!current) {
        return current
      }

      logger.info(
        'Payment: RESUME_PAYMENT dispatched, clearing local resume state'
      )
      return null
    })
  }, [])

  const persistParentRedirectState = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }
    if (
      !resolvedCartId ||
      !resolvedCartToken ||
      !resolvedUserGuid ||
      typeof resolvedPaymentMethodId !== 'number' ||
      !resolvedPaymentRequest
    ) {
      logger.warn(
        'Payment: Skipping redirect state persistence due to missing fields'
      )
      return
    }

    const stateToPersist: ParentRedirectState = {
      cartId: resolvedCartId,
      cartToken: resolvedCartToken,
      userGuid: resolvedUserGuid,
      paymentMethodId: resolvedPaymentMethodId,
      paymentRequest: resolvedPaymentRequest
    }

    window.sessionStorage.setItem(
      PARENT_REDIRECT_STATE_STORAGE_KEY,
      JSON.stringify(stateToPersist)
    )
    logger.info(
      {
        cartId: resolvedCartId,
        paymentMethodId: resolvedPaymentMethodId
      },
      'Payment: Persisted parent redirect state before PROCESS_PAYMENT'
    )
  }, [
    resolvedCartId,
    resolvedCartToken,
    resolvedPaymentMethodId,
    resolvedPaymentRequest,
    resolvedUserGuid
  ])

  const resolvedTargetOrigin = useMemo(() => {
    const fallbackOrigin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost'

    if (IFRAME_TARGET_ORIGIN_RAW?.startsWith('https://')) {
      try {
        return new URL(IFRAME_TARGET_ORIGIN_RAW).origin
      } catch {
        return fallbackOrigin
      }
    }

    if (!IFRAME_URL) {
      return fallbackOrigin
    }

    try {
      return new URL(IFRAME_URL, fallbackOrigin).origin
    } catch {
      return fallbackOrigin
    }
  }, [])

  const resolvedAllowedOrigin = useMemo(() => {
    if (IFRAME_ALLOWED_ORIGIN_RAW?.startsWith('https://')) {
      try {
        return new URL(IFRAME_ALLOWED_ORIGIN_RAW).origin
      } catch {
        return undefined
      }
    }
    return undefined
  }, [])
  const [iframeKey, setIframeKey] = useState(0)

  // Call hook unconditionally (React hooks rule)
  // Pass safe defaults when data is not ready
  const { iframeRef, status, initIframe, resetPaymentFlow } =
    useRocketRezPayment({
      cartId: resolvedCartId ?? '',
      paymentMethodId: resolvedPaymentMethodId,
      clientSecret: resolvedClientSecret,
      cartToken: resolvedCartToken ?? '',
      userGuid: resolvedUserGuid,
      paymentRequest: resolvedPaymentRequest ?? {
        PaymentMethodId: 0,
        CartId: '',
        PaymentTotal: 0
      },
      resumePayment,
      autoProcess: true,
      targetOrigin: resolvedTargetOrigin,
      allowedOrigin: resolvedAllowedOrigin,
      onBeforeProcessPayment: persistParentRedirectState,
      onResumePaymentDispatched: handleResumePaymentDispatched,
      onPaymentSuccess: handlePaymentSuccess,
      onPaymentError: handlePaymentError
    })
  const isIframeLoading = status === 'idle' || status === 'loading_iframe'
  const hasPaymentError = status === 'error'

  const handleRetryPayment = useCallback(() => {
    resetPaymentFlow()
    setIframeKey((prev) => prev + 1)
  }, [resetPaymentFlow])

  // Bail out immediately when the iframe env var is misconfigured.
  // No retry button: the env var won't appear at runtime.
  if (isIframeEnvMissing) {
    return (
      <div className={styles.body}>
        <div className={styles.status}>
          <span>{t('status.error')}</span>
        </div>
      </div>
    )
  }

  // After the guard above, IFRAME_URL is guaranteed to be a non-null string.
  const iframeUrl: string = IFRAME_URL

  // Only render payment form if we have all required data
  if (!resolvedCartId || !resolvedCartToken || !resolvedPaymentRequest) {
    return (
      <div className={styles.body}>
        <div className={styles.status}>
          {!resolvedCartId || !resolvedCartToken ? (
            <span>{t('status.loading_cart')}</span>
          ) : (
            <span>{t('status.loading')}</span>
          )}
        </div>
      </div>
    )
  }

  // Show error state when client-secret fetch failed
  if (csIsError) {
    return (
      <div className={styles.body}>
        <div className={styles.status}>
          <span>{t('status.error')}</span>
        </div>
        <div className={styles.actions}>
          <CoreCta
            href={null}
            text={t('button.pay_now')}
            onClick={() => {
              csMutate(undefined)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={styles.body}>
        <div id="checkout-iframe" className={styles.iframeBox}>
          {isIframeLoading && (
            <div className={styles.iframeLoadingOverlay}>
              <CoreLoadingSpinner
                showLabel={false}
                className={styles.iframeSpinner}
              />
            </div>
          )}
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={iframeUrl}
            title={t('iframe.title')}
            className={styles.iframe}
            onLoad={initIframe}
          />
        </div>
        {hasPaymentError && (
          <div className={styles.actions}>
            <CoreCta
              href={null}
              text={t('button.retry')}
              onClick={handleRetryPayment}
            />
          </div>
        )}
      </div>
    </>
  )
}
