'use client'

import { useCallback } from 'react'
import { TRACK_FB_ECOMMERCE_EVENTS } from '../../config/analytics'
import { logger } from '../../core/logger/logger'
import type {
  AnalyticsFacebookPixelEvent,
  AnalyticsFacebookPixelEventData,
  CartLineItemMetadata,
  RocketRezCart,
  RocketRezLineItem
} from '../../io/types'
import { getLineItemsValue, normaliseCurrency } from './utils'

type FacebookPixelWindow = {
  fbq?: (
    action: 'track',
    eventName: AnalyticsFacebookPixelEvent['event'],
    parameters: Record<string, unknown>
  ) => void
} & Window

declare const window: FacebookPixelWindow

export const useAnalyticsFacebookPixelEvent = () => {
  const trackEvent = useCallback(
    (
      event: AnalyticsFacebookPixelEvent['event'],
      data: AnalyticsFacebookPixelEventData
    ) => {
      if (!TRACK_FB_ECOMMERCE_EVENTS) {
        logger.info(
          { event, data },
          'useAnalyticsFacebookPixelEvent: tracking disabled'
        )
        return
      }

      if (typeof window === 'undefined' || !window.fbq) {
        logger.debug(
          { event, data },
          'useAnalyticsFacebookPixelEvent: fbq not available'
        )
        return
      }

      try {
        window.fbq('track', event, data)
        logger.info(
          { event, data },
          'useAnalyticsFacebookPixelEvent: tracked event'
        )
      } catch (error) {
        logger.error(
          { error, event, data },
          'useAnalyticsFacebookPixelEvent: failed to track event'
        )
      }
    },
    []
  )

  const mapLineItemToContent = useCallback(
    (
      lineItem: RocketRezLineItem,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature kept for API consistency with GA4 hook
      _metadata: CartLineItemMetadata[]
    ): { id: string; quantity: number; item_price?: number } => {
      return {
        id: String(lineItem.id),
        quantity: lineItem.quantity ?? 1,
        item_price: lineItem.price ?? undefined
      }
    },
    []
  )

  const trackAddToCart = useCallback(
    (
      cart: RocketRezCart,
      addedItems: RocketRezLineItem[],
      metadata: CartLineItemMetadata[] = []
    ) => {
      if (addedItems.length === 0) {
        return
      }

      const contents = addedItems.map((item) =>
        mapLineItemToContent(item, metadata)
      )

      trackEvent('AddToCart', {
        content_ids: contents.map((c) => c.id),
        contents,
        content_type: 'product',
        value: getLineItemsValue(addedItems),
        currency: normaliseCurrency(cart.currency ?? 'USD'),
        num_items: addedItems.reduce(
          (sum, item) => sum + (item.quantity ?? 1),
          0
        )
      })
    },
    [trackEvent, mapLineItemToContent]
  )

  const trackInitiateCheckout = useCallback(
    (cart: RocketRezCart, metadata: CartLineItemMetadata[] = []) => {
      const lineItems = cart.lineItems ?? []
      if (lineItems.length === 0) {
        return
      }

      const contents = lineItems.map((item) =>
        mapLineItemToContent(item, metadata)
      )

      trackEvent('InitiateCheckout', {
        content_ids: contents.map((c) => c.id),
        contents,
        content_type: 'product',
        value: cart.total ?? 0,
        currency: normaliseCurrency(cart.currency ?? 'USD'),
        num_items: lineItems.reduce(
          (sum, item) => sum + (item.quantity ?? 1),
          0
        )
      })
    },
    [trackEvent, mapLineItemToContent]
  )

  const trackPurchase = useCallback(
    (cart: RocketRezCart, metadata: CartLineItemMetadata[] = []) => {
      const lineItems = cart.lineItems ?? []
      if (lineItems.length === 0) {
        return
      }

      const contents = lineItems.map((item) =>
        mapLineItemToContent(item, metadata)
      )

      trackEvent('Purchase', {
        content_ids: contents.map((c) => c.id),
        contents,
        content_type: 'product',
        value: cart.total ?? 0,
        currency: normaliseCurrency(cart.currency ?? 'USD'),
        num_items: lineItems.reduce(
          (sum, item) => sum + (item.quantity ?? 1),
          0
        )
      })
    },
    [trackEvent, mapLineItemToContent]
  )

  const trackAddPaymentInfo = useCallback(
    (cart: RocketRezCart, metadata: CartLineItemMetadata[] = []) => {
      const lineItems = cart.lineItems ?? []
      if (lineItems.length === 0) {
        return
      }

      const contents = lineItems.map((item) =>
        mapLineItemToContent(item, metadata)
      )

      trackEvent('AddPaymentInfo', {
        content_ids: contents.map((c) => c.id),
        contents,
        content_type: 'product',
        value: cart.total ?? 0,
        currency: normaliseCurrency(cart.currency ?? 'USD')
      })
    },
    [trackEvent, mapLineItemToContent]
  )

  return {
    trackEvent,
    trackAddToCart,
    trackInitiateCheckout,
    trackPurchase,
    trackAddPaymentInfo
  }
}
