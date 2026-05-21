'use client'

import { useCallback, useMemo } from 'react'
import { TRACK_ECOMMERCE_EVENTS } from '../../config/analytics'
import { logger } from '../../core/logger/logger'
import type {
  CartLineItemMetadata,
  RocketRezCart,
  RocketRezLineItem
} from '../../io/types'
import { useAnalyticsFacebookPixelEvent } from './use-analytics-fbpixel-event'
import type { ShippingInfoUserData } from './use-analytics-ga4-event'
import { useAnalyticsGA4Event } from './use-analytics-ga4-event'
import {
  getAddedLineItemsDelta,
  getRemovedLineItemDelta,
  getTrackedCartSnapshot,
  rememberTrackedCartSnapshot
} from './utils'

export type EcommerceEventType =
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'add_shipping_info'
  | 'add_payment_info'
  | 'purchase'

export type EcommerceEventData = {
  cart: RocketRezCart
  metadata?: CartLineItemMetadata[]
  shippingTier?: string
  userData?: ShippingInfoUserData
  removedItem?: RocketRezLineItem
  transactionId?: string
}

export const useAnalyticsEcommerceEvent = () => {
  const fbPixel = useAnalyticsFacebookPixelEvent()
  const ga4 = useAnalyticsGA4Event()

  const trackEvent = useCallback(
    (type: EcommerceEventType, data: EcommerceEventData) => {
      const {
        cart,
        metadata = [],
        shippingTier,
        userData,
        removedItem,
        transactionId
      } = data
      const previousCart = getTrackedCartSnapshot(cart.id)

      if (!TRACK_ECOMMERCE_EVENTS) {
        logger.info(
          { type, cartId: cart.id },
          'useAnalyticsEcommerceEvent: tracking disabled'
        )
        return
      }

      logger.info(
        { type, cartId: cart.id, lineItemsCount: cart.lineItems?.length ?? 0 },
        'useAnalyticsEcommerceEvent: tracking event'
      )

      try {
        switch (type) {
          case 'add_to_cart': {
            const addedItems = getAddedLineItemsDelta(previousCart, cart)

            if (addedItems.length > 0) {
              fbPixel.trackAddToCart(cart, addedItems, metadata)
              ga4.trackAddToCart(cart, addedItems, metadata)
            } else {
              logger.warn(
                { type, cartId: cart.id },
                'useAnalyticsEcommerceEvent: add_to_cart missing delta items'
              )
            }
            break
          }

          case 'remove_from_cart': {
            const deltaItem = removedItem
              ? getRemovedLineItemDelta(cart, removedItem)
              : undefined

            if (removedItem) {
              if (deltaItem) {
                ga4.trackRemoveFromCart(cart, deltaItem, metadata)
              } else {
                logger.warn(
                  { type, cartId: cart.id, removedItemId: removedItem.id },
                  'useAnalyticsEcommerceEvent: remove_from_cart missing delta item'
                )
              }
            }
            break
          }

          case 'begin_checkout':
            fbPixel.trackInitiateCheckout(cart, metadata)
            ga4.trackBeginCheckout(cart, metadata)
            break

          case 'add_payment_info':
            fbPixel.trackAddPaymentInfo(cart, metadata)
            ga4.trackAddPaymentInfo(cart, metadata)
            break

          case 'add_shipping_info':
            ga4.trackAddShippingInfo(cart, metadata, shippingTier, userData)
            break

          case 'purchase':
            if (transactionId) {
              fbPixel.trackPurchase(cart, metadata)
              ga4.trackPurchase(cart, transactionId, metadata)
            } else {
              logger.warn(
                { type, cartId: cart.id },
                'useAnalyticsEcommerceEvent: purchase event missing transactionId'
              )
            }
            break

          default:
            logger.warn(
              { type },
              'useAnalyticsEcommerceEvent: unknown event type'
            )
        }

        rememberTrackedCartSnapshot(cart)
      } catch (error) {
        logger.error(
          { error, type, cartId: cart.id },
          'useAnalyticsEcommerceEvent: failed to track event'
        )
      }
    },
    [fbPixel, ga4]
  )

  const trackAddToCart = useCallback(
    (cart: RocketRezCart, metadata?: CartLineItemMetadata[]) => {
      trackEvent('add_to_cart', { cart, metadata })
    },
    [trackEvent]
  )

  const trackRemoveFromCart = useCallback(
    (
      cart: RocketRezCart,
      removedItem: RocketRezLineItem,
      metadata?: CartLineItemMetadata[]
    ) => {
      trackEvent('remove_from_cart', {
        cart,
        metadata,
        removedItem
      })
    },
    [trackEvent]
  )

  const trackBeginCheckout = useCallback(
    (cart: RocketRezCart, metadata?: CartLineItemMetadata[]) => {
      trackEvent('begin_checkout', { cart, metadata })
    },
    [trackEvent]
  )

  const trackAddPaymentInfo = useCallback(
    (cart: RocketRezCart, metadata?: CartLineItemMetadata[]) => {
      trackEvent('add_payment_info', { cart, metadata })
    },
    [trackEvent]
  )

  const trackAddShippingInfo = useCallback(
    (
      cart: RocketRezCart,
      metadata?: CartLineItemMetadata[],
      shippingTier?: string,
      userData?: ShippingInfoUserData
    ) => {
      trackEvent('add_shipping_info', {
        cart,
        metadata,
        shippingTier,
        userData
      })
    },
    [trackEvent]
  )

  const trackPurchase = useCallback(
    (
      cart: RocketRezCart,
      transactionId: string,
      metadata?: CartLineItemMetadata[]
    ) => {
      trackEvent('purchase', { cart, metadata, transactionId })
    },
    [trackEvent]
  )

  return useMemo(
    () => ({
      trackEvent,
      trackAddToCart,
      trackRemoveFromCart,
      trackBeginCheckout,
      trackAddShippingInfo,
      trackAddPaymentInfo,
      trackPurchase
    }),
    [
      trackEvent,
      trackAddToCart,
      trackRemoveFromCart,
      trackBeginCheckout,
      trackAddShippingInfo,
      trackAddPaymentInfo,
      trackPurchase
    ]
  )
}
