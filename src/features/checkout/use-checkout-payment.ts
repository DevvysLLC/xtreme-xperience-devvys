'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { logger } from '../../core/logger/logger'
import type {
  IframeToParentMessage,
  ParentToIframeMessage,
  RocketRezPaymentRequest,
  RocketRezPaymentStatus
} from '../../io/types'

type ResumePaymentOptions = {
  clientSecret: string
  redirectStatus?: string
  cartId: number | string
  cartToken: string
  userGuid: string
  paymentMethodId: number
  paymentRequest: RocketRezPaymentRequest
}

type Options = {
  cartId: number | string
  paymentMethodId?: number | null
  clientSecret: string | null
  cartToken: string
  userGuid: string
  paymentRequest: RocketRezPaymentRequest
  autoProcess: boolean
  targetOrigin: string
  allowedOrigin?: string
  resumePayment?: ResumePaymentOptions | null
  onBeforeProcessPayment?: () => void
  onResumePaymentDispatched?: () => void
  onReady?: () => void
  onPaymentAuthSuccess?: (data: {
    paymentIntentId?: string
    status?: string
  }) => void
  onPaymentAuthError?: () => void
  onPaymentSuccess?: (data: {
    orderId?: string | number
    paymentIntentId?: string
    status?: string
  }) => void
  onPaymentError?: () => void
}

export const useRocketRezPayment = (options: Options) => {
  const {
    cartId,
    paymentMethodId,
    clientSecret,
    cartToken,
    userGuid,
    paymentRequest,
    autoProcess,
    targetOrigin,
    allowedOrigin,
    resumePayment,
    onBeforeProcessPayment,
    onResumePaymentDispatched,
    onReady,
    onPaymentAuthSuccess,
    onPaymentAuthError,
    onPaymentSuccess,
    onPaymentError
  } = options

  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const hasAutoProcessedRef = useRef(false)
  const initRetryRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [status, setStatus] = useState<RocketRezPaymentStatus>('idle')
  const [orderId, setOrderId] = useState<string | number | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)

  const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null
  }

  const isIframeToParentMessageType = (
    value: string
  ): value is IframeToParentMessage['type'] => {
    return (
      value === 'READY' ||
      value === 'PAYMENT_AUTH_SUCCESS' ||
      value === 'PAYMENT_AUTH_ERROR' ||
      value === 'PAYMENT_SUCCESS' ||
      value === 'PAYMENT_ERROR' ||
      value === 'UNKNOWN_MESSAGE_TYPE'
    )
  }

  const canProcess = useMemo(() => {
    return status === 'ready' && Boolean(clientSecret)
  }, [clientSecret, status])

  const postToIframe = useCallback(
    (message: ParentToIframeMessage) => {
      const iframeWindow = iframeRef.current?.contentWindow
      if (!iframeWindow) {
        logger.warn(
          { messageType: message.type },
          'Payment: No iframe contentWindow, cannot post message'
        )
        return
      }
      logger.info(
        { messageType: message.type, targetOrigin },
        'Payment: Posting message to iframe'
      )
      iframeWindow.postMessage(message, targetOrigin)
    },
    [targetOrigin]
  )

  const clearInitRetry = useCallback(() => {
    if (initRetryRef.current) {
      clearInterval(initRetryRef.current)
      initRetryRef.current = null
    }
  }, [])

  const initIframe = useCallback(() => {
    logger.info(
      { cartId, paymentMethodId },
      'Payment: Iframe loaded, sending INIT'
    )
    setStatus('loading_iframe')
    postToIframe({
      type: 'INIT',
      cartId,
      ...(typeof paymentMethodId === 'number' ? { paymentMethodId } : {})
    })

    // The iframe's internal React app may not be ready when onLoad fires.
    // Retry INIT every 500ms until we receive READY (which clears the interval).
    clearInitRetry()
    let attempts = 0
    const maxAttempts = 20 // 10 seconds max
    initRetryRef.current = setInterval(() => {
      attempts += 1
      if (attempts >= maxAttempts) {
        logger.error(
          { cartId, attempts },
          'Payment: INIT retry limit reached — iframe never became ready'
        )
        clearInitRetry()
        return
      }
      logger.info(
        { cartId, attempt: attempts },
        'Payment: Retrying INIT — iframe not yet ready'
      )
      postToIframe({
        type: 'INIT',
        cartId,
        ...(typeof paymentMethodId === 'number' ? { paymentMethodId } : {})
      })
    }, 500)
  }, [cartId, paymentMethodId, postToIframe, clearInitRetry])

  const processPayment = useCallback(() => {
    if (!clientSecret) {
      logger.error('Payment: processPayment called without clientSecret')
      setStatus('error')
      onPaymentError?.()
      return
    }

    logger.info(
      {
        cartId,
        hasCartToken: !!cartToken,
        hasUserGuid: !!userGuid,
        hasPaymentRequest: !!paymentRequest,
        clientSecretPreview: clientSecret
          ? `${clientSecret.slice(0, 15)}...`
          : null
      },
      'Payment: Processing payment — sending PROCESS_PAYMENT to iframe'
    )

    onBeforeProcessPayment?.()
    setStatus('processing_payment')
    postToIframe({
      type: 'PROCESS_PAYMENT',
      clientSecret,
      cartToken,
      userGuid,
      paymentRequest
    })
  }, [
    cartId,
    cartToken,
    clientSecret,
    onPaymentError,
    onBeforeProcessPayment,
    paymentRequest,
    postToIframe,
    userGuid
  ])

  const resumePaymentFlow = useCallback(() => {
    if (!resumePayment) {
      logger.warn(
        'Payment: resumePaymentFlow called without resumePayment payload'
      )
      return
    }

    logger.info(
      {
        cartId: resumePayment.cartId,
        paymentMethodId: resumePayment.paymentMethodId,
        redirectStatus: resumePayment.redirectStatus
      },
      'Payment: Resuming redirect payment — sending RESUME_PAYMENT to iframe'
    )

    setStatus('processing_payment')
    postToIframe({
      type: 'RESUME_PAYMENT',
      clientSecret: resumePayment.clientSecret,
      redirectStatus: resumePayment.redirectStatus,
      cartId: resumePayment.cartId,
      cartToken: resumePayment.cartToken,
      userGuid: resumePayment.userGuid,
      paymentMethodId: resumePayment.paymentMethodId,
      paymentRequest: resumePayment.paymentRequest
    })
    onResumePaymentDispatched?.()
  }, [onResumePaymentDispatched, postToIframe, resumePayment])

  const resetPaymentFlow = useCallback(() => {
    hasAutoProcessedRef.current = false
    setStatus('idle')
    setOrderId(null)
    setPaymentIntentId(null)
    clearInitRetry()
  }, [clearInitRetry])

  const maybeAutoProcess = useCallback(() => {
    if (!autoProcess) {
      logger.info('Payment: Auto-process disabled; waiting for manual trigger')
      return
    }

    if (hasAutoProcessedRef.current) {
      logger.info('Payment: Auto-process skipped; payment already dispatched')
      return
    }

    if (!canProcess) {
      logger.info(
        { status, hasClientSecret: Boolean(clientSecret) },
        'Payment: Auto-process skipped; iframe not ready or clientSecret missing'
      )
      return
    }

    logger.info(
      'Payment: Auto-process conditions met; dispatching PROCESS_PAYMENT'
    )
    hasAutoProcessedRef.current = true
    processPayment()
  }, [autoProcess, canProcess, clientSecret, processPayment, status])

  useEffect(() => {
    const handleMessage = (event: MessageEvent<unknown>) => {
      // Log every message received by the window (safe summary only: origin, type, keys)
      logger.info(
        {
          windowMessageOrigin: event.origin,
          windowMessageType:
            isRecord(event.data) && typeof event.data.type === 'string'
              ? event.data.type
              : undefined,
          windowMessageKeys: isRecord(event.data) ? Object.keys(event.data) : []
        },
        'Payment: Window message received'
      )

      // Filter out Stripe internal messages (RocketRez doc recommendation)
      if (event.origin?.includes('.stripe.com')) {
        return
      }

      if (allowedOrigin && event.origin !== allowedOrigin) {
        // Only log when the message looks like a payment message (avoids noise from
        // our own origin or other scripts posting unrelated messages)
        const type = isRecord(event.data) ? event.data.type : undefined
        if (typeof type === 'string' && isIframeToParentMessageType(type)) {
          logger.warn(
            {
              eventOrigin: event.origin,
              allowedOrigin,
              dataType: type
            },
            'Payment: Message rejected — origin mismatch'
          )
        }
        return
      }

      const iframeWindow = iframeRef.current?.contentWindow
      if (iframeWindow && event.source !== iframeWindow) {
        const type = isRecord(event.data) ? event.data.type : undefined
        if (typeof type === 'string' && isIframeToParentMessageType(type)) {
          logger.warn(
            {
              eventOrigin: event.origin,
              hasIframeWindow: Boolean(iframeWindow),
              sourceMatchesIframe: event.source === iframeWindow,
              dataType: type
            },
            'Payment: Message rejected — source mismatch'
          )
        }
        return
      }

      if (!isRecord(event.data)) {
        return
      }

      const type = event.data.type
      if (typeof type !== 'string') {
        return
      }

      if (!isIframeToParentMessageType(type)) {
        logger.info(
          { type, eventOrigin: event.origin },
          'Payment: Ignoring unrecognised message type from iframe'
        )
        return
      }

      logger.info(
        { type, eventOrigin: event.origin },
        'Payment: Received iframe message'
      )

      switch (type) {
        case 'READY': {
          clearInitRetry()
          logger.info(
            { cartId, hasClientSecret: !!clientSecret },
            'Payment: Iframe READY — transitioning to ready'
          )
          setStatus('ready')
          onReady?.()
          if (resumePayment && !hasAutoProcessedRef.current) {
            logger.info(
              'Payment: READY with resumePayment context; dispatching RESUME_PAYMENT'
            )
            hasAutoProcessedRef.current = true
            resumePaymentFlow()
            break
          }
          if (resumePayment && hasAutoProcessedRef.current) {
            logger.warn(
              'Payment: READY received but resume/payment already dispatched; skipping duplicate dispatch'
            )
          } else {
            logger.info(
              'Payment: READY without resume context; evaluating PROCESS_PAYMENT auto-flow'
            )
          }
          maybeAutoProcess()
          break
        }
        case 'PAYMENT_AUTH_SUCCESS': {
          const nextPaymentIntentId =
            typeof event.data.paymentIntentId === 'string'
              ? event.data.paymentIntentId
              : null
          const nextStatus =
            typeof event.data.status === 'string'
              ? event.data.status
              : undefined

          logger.info(
            {
              paymentIntentId: nextPaymentIntentId,
              status: nextStatus
            },
            'Payment: PAYMENT_AUTH_SUCCESS — transitioning to authorizing'
          )

          setStatus('authorizing')
          setPaymentIntentId(nextPaymentIntentId)
          onPaymentAuthSuccess?.({
            paymentIntentId: nextPaymentIntentId ?? undefined,
            status: nextStatus
          })
          break
        }
        case 'PAYMENT_AUTH_ERROR': {
          logger.error(
            { eventData: event.data },
            'Payment: PAYMENT_AUTH_ERROR — transitioning to error'
          )
          setStatus('error')
          onPaymentAuthError?.()
          break
        }
        case 'PAYMENT_SUCCESS': {
          const nextPaymentIntentId =
            typeof event.data.paymentIntentId === 'string'
              ? event.data.paymentIntentId
              : null

          const nextOrderId =
            typeof event.data.orderId === 'string' ||
            typeof event.data.orderId === 'number'
              ? event.data.orderId
              : null

          const nextStatus =
            typeof event.data.status === 'string'
              ? event.data.status
              : undefined

          logger.info(
            {
              orderId: nextOrderId,
              paymentIntentId: nextPaymentIntentId,
              status: nextStatus
            },
            'Payment: PAYMENT_SUCCESS — transitioning to success'
          )

          setStatus('success')
          setPaymentIntentId(nextPaymentIntentId)
          setOrderId(nextOrderId)
          onPaymentSuccess?.({
            orderId: nextOrderId ?? undefined,
            paymentIntentId: nextPaymentIntentId ?? undefined,
            status: nextStatus
          })
          break
        }
        case 'PAYMENT_ERROR': {
          logger.error(
            { eventData: event.data },
            'Payment: PAYMENT_ERROR — transitioning to error'
          )
          setStatus('error')
          onPaymentError?.()
          break
        }
        case 'UNKNOWN_MESSAGE_TYPE': {
          logger.warn(
            { eventData: event.data, eventOrigin: event.origin },
            'Payment: Received UNKNOWN_MESSAGE_TYPE from iframe'
          )
          break
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [
    allowedOrigin,
    cartId,
    clearInitRetry,
    clientSecret,
    onPaymentAuthError,
    onPaymentAuthSuccess,
    onPaymentError,
    onPaymentSuccess,
    onReady,
    maybeAutoProcess,
    resumePayment,
    resumePaymentFlow
  ])

  useEffect(() => {
    hasAutoProcessedRef.current = false
  }, [cartId])

  useEffect(() => {
    maybeAutoProcess()
  }, [maybeAutoProcess])

  // Clean up INIT retry interval on unmount
  useEffect(() => {
    return () => {
      clearInitRetry()
    }
  }, [clearInitRetry])

  return {
    iframeRef,
    status,
    orderId,
    paymentIntentId,
    canProcess,
    initIframe,
    processPayment,
    resetPaymentFlow
  }
}
