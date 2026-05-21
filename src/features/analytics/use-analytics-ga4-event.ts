'use client'

import { useCallback } from 'react'
import {
  ANALYTICS_BRAND_NAME,
  TRACK_GA4_ECOMMERCE_EVENTS,
  TRACK_GA4_PAGE_VIEW_EVENTS,
  UNAVAILABLE_ANALYTICS_VALUE
} from '../../config/analytics'
import { logger } from '../../core/logger/logger'
import type {
  AnalyticsGA4Event,
  AnalyticsGA4EventData,
  AnalyticsGA4Item,
  CartLineItemMetadata,
  RocketRezCart,
  RocketRezLineItem
} from '../../io/types'
import {
  findCartLineItemMetadata,
  getLineItemsValue,
  normaliseCurrency
} from './utils'

type DataLayerWindow = {
  dataLayer?:
    | Record<string, unknown>[]
    | { push?: (...args: unknown[]) => void }
} & Window

declare const window: DataLayerWindow

type DataLayerWithPush = { push: (...args: unknown[]) => void }

const hasDataLayerPush = (
  x: Record<string, unknown>[] | { push?: (...args: unknown[]) => void }
): x is DataLayerWithPush => {
  return (
    typeof x === 'object' &&
    x !== null &&
    'push' in x &&
    typeof x.push === 'function'
  )
}

const getDataLayer = (): DataLayerWithPush | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }

  window.dataLayer = window.dataLayer ?? []

  if (!hasDataLayerPush(window.dataLayer)) {
    return undefined
  }

  return window.dataLayer
}

const pushEcommerceEvent = (
  event: string,
  ecommerce: AnalyticsGA4EventData
): void => {
  const dl = getDataLayer()
  if (!dl) {
    return
  }

  dl.push({ ecommerce: null })
  dl.push({ event, ecommerce })
}

const pushCustomEvent = (
  event: string,
  params: Record<string, unknown>
): void => {
  const dl = getDataLayer()
  if (!dl) {
    return
  }

  dl.push({ event, ...params })
}

export type BookNowEventData = {
  track_id?: string
  track_name?: string
  event_id?: string
  event_title?: string
  rocket_rez_event_id?: string
  page_path?: string
}

export type ViewItemEventData = {
  item_id: string
  item_name: string
  item_brand?: string
  item_category?: string
  item_variant?: 'supercar' | 'track' | string
  currency?: string
  value?: number
  page_path?: string
}

export type ShippingInfoUserData = {
  user_id?: string
  email?: string
  phone?: string
  name?: string
  zip_code?: string
  address?: string
}

export const useAnalyticsGA4Event = () => {
  const trackEvent = useCallback(
    (event: AnalyticsGA4Event['event'], ecommerce: AnalyticsGA4EventData) => {
      if (!TRACK_GA4_ECOMMERCE_EVENTS) {
        logger.info({ event }, 'useAnalyticsGA4Event: tracking disabled')
        return
      }

      if (typeof window === 'undefined') {
        logger.info({ event }, 'useAnalyticsGA4Event: window not available')
        return
      }

      try {
        pushEcommerceEvent(event, ecommerce)
        logger.info({ event }, 'useAnalyticsGA4Event: pushed to dataLayer')
      } catch (error) {
        logger.error(
          { error, event },
          'useAnalyticsGA4Event: failed to push to dataLayer'
        )
      }
    },
    []
  )

  const mapLineItemToGA4Item = useCallback(
    (
      lineItem: RocketRezLineItem,
      metadata: CartLineItemMetadata[],
      index: number
    ): AnalyticsGA4Item => {
      const meta = findCartLineItemMetadata(lineItem, metadata)

      return {
        item_id: String(lineItem.id),
        item_name: meta?.title ?? `${lineItem.type} #${lineItem.id}`,
        item_brand: ANALYTICS_BRAND_NAME,
        item_category: meta?.type ?? 'product',
        item_variant: meta?.type ?? UNAVAILABLE_ANALYTICS_VALUE,
        price: lineItem.price ?? 0,
        quantity: lineItem.quantity ?? 1,
        index,
        discount: lineItem.discountAmount ?? 0
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

      trackEvent('add_to_cart', {
        currency: normaliseCurrency(cart.currency ?? 'USD'),
        value: getLineItemsValue(addedItems),
        items: addedItems.map((item, i) =>
          mapLineItemToGA4Item(item, metadata, i)
        )
      })
    },
    [trackEvent, mapLineItemToGA4Item]
  )

  const trackRemoveFromCart = useCallback(
    (
      cart: RocketRezCart,
      removedItem: RocketRezLineItem,
      metadata: CartLineItemMetadata[] = []
    ) => {
      trackEvent('remove_from_cart', {
        currency: normaliseCurrency(cart.currency ?? 'USD'),
        value: getLineItemsValue([removedItem]),
        items: [mapLineItemToGA4Item(removedItem, metadata, 0)]
      })
    },
    [trackEvent, mapLineItemToGA4Item]
  )

  const trackBeginCheckout = useCallback(
    (cart: RocketRezCart, metadata: CartLineItemMetadata[] = []) => {
      const lineItems = cart.lineItems ?? []
      if (lineItems.length === 0) {
        return
      }

      trackEvent('begin_checkout', {
        currency: normaliseCurrency(cart.currency ?? 'USD'),
        value: cart.total ?? 0,
        items: lineItems.map((item, i) =>
          mapLineItemToGA4Item(item, metadata, i)
        ),
        coupon:
          cart.coupons?.[0]?.code ?? cart.coupons?.[0]?.serial ?? undefined
      })
    },
    [trackEvent, mapLineItemToGA4Item]
  )

  const trackAddPaymentInfo = useCallback(
    (cart: RocketRezCart, metadata: CartLineItemMetadata[] = []) => {
      const lineItems = cart.lineItems ?? []
      if (lineItems.length === 0) {
        return
      }

      trackEvent('add_payment_info', {
        currency: normaliseCurrency(cart.currency ?? 'USD'),
        value: cart.total ?? 0,
        items: lineItems.map((item, i) =>
          mapLineItemToGA4Item(item, metadata, i)
        ),
        coupon:
          cart.coupons?.[0]?.code ?? cart.coupons?.[0]?.serial ?? undefined
      })
    },
    [trackEvent, mapLineItemToGA4Item]
  )

  const trackAddShippingInfo = useCallback(
    (
      cart: RocketRezCart,
      metadata: CartLineItemMetadata[] = [],
      shippingTier?: string,
      userData?: ShippingInfoUserData
    ) => {
      const lineItems = cart.lineItems ?? []
      if (lineItems.length === 0) {
        return
      }

      if (!TRACK_GA4_ECOMMERCE_EVENTS) {
        logger.info(
          { shippingTier },
          'useAnalyticsGA4Event: tracking disabled for add_shipping_info'
        )
        return
      }

      const dl = getDataLayer()
      if (!dl) {
        return
      }

      dl.push({ ecommerce: null })
      dl.push({
        event: 'add_shipping_info',
        ecommerce: {
          currency: normaliseCurrency(cart.currency ?? 'USD'),
          value: cart.total ?? 0,
          shipping_tier: shippingTier ?? UNAVAILABLE_ANALYTICS_VALUE,
          items: lineItems.map((item, i) =>
            mapLineItemToGA4Item(item, metadata, i)
          )
        },
        ...(userData ? { user_data: userData } : {})
      })
    },
    [mapLineItemToGA4Item]
  )

  const trackPurchase = useCallback(
    (
      cart: RocketRezCart,
      transactionId: string,
      metadata: CartLineItemMetadata[] = []
    ) => {
      const lineItems = cart.lineItems ?? []
      if (lineItems.length === 0) {
        return
      }

      trackEvent('purchase', {
        transaction_id: transactionId,
        currency: normaliseCurrency(cart.currency ?? 'USD'),
        value: cart.total ?? 0,
        items: lineItems.map((item, i) =>
          mapLineItemToGA4Item(item, metadata, i)
        ),
        coupon:
          cart.coupons?.[0]?.code ?? cart.coupons?.[0]?.serial ?? undefined,
        tax: cart.taxTotal ?? 0
      })
    },
    [trackEvent, mapLineItemToGA4Item]
  )

  const trackViewItem = useCallback(
    (data: ViewItemEventData) => {
      try {
        trackEvent('view_item', {
          currency: normaliseCurrency(data.currency ?? 'USD'),
          value: data.value ?? 0,
          items: [
            {
              item_id: data.item_id,
              item_name: data.item_name,
              item_brand: data.item_brand ?? ANALYTICS_BRAND_NAME,
              item_category: data.item_category,
              item_variant: data.item_variant ?? UNAVAILABLE_ANALYTICS_VALUE,
              quantity: 1
            }
          ]
        })
        logger.info(
          { data },
          'useAnalyticsGA4Event: view_item pushed to dataLayer'
        )
      } catch (error) {
        logger.error(
          { error, data },
          'useAnalyticsGA4Event: failed to push view_item'
        )
      }
    },
    [trackEvent]
  )

  const trackRouterNavigate = useCallback(
    (data: { from: string; to: string }) => {
      try {
        pushCustomEvent('router_navigate', data)
        logger.info(
          { data },
          'useAnalyticsGA4Event: router_navigate pushed to dataLayer'
        )
      } catch (error) {
        logger.error(
          { error, data },
          'useAnalyticsGA4Event: failed to push router_navigate'
        )
      }
    },
    []
  )

  const trackPageView = useCallback(
    (data: {
      page_location: string
      page_referrer: string
      page_title: string
    }) => {
      if (!TRACK_GA4_PAGE_VIEW_EVENTS) {
        logger.info(
          { data },
          'useAnalyticsGA4Event: tracking disabled for page_view'
        )
        return
      }

      try {
        pushCustomEvent('page_view', data)
        logger.info(
          { data },
          'useAnalyticsGA4Event: page_view pushed to dataLayer'
        )
      } catch (error) {
        logger.error(
          { error, data },
          'useAnalyticsGA4Event: failed to push page_view'
        )
      }
    },
    []
  )

  const trackBookNow = useCallback((data: BookNowEventData) => {
    if (!TRACK_GA4_ECOMMERCE_EVENTS) {
      logger.info(
        { data },
        'useAnalyticsGA4Event: tracking disabled for book_now'
      )
      return
    }

    try {
      pushCustomEvent('book_now', data)
      logger.info(
        { data },
        'useAnalyticsGA4Event: book_now pushed to dataLayer'
      )
    } catch (error) {
      logger.error(
        { error, data },
        'useAnalyticsGA4Event: failed to push book_now'
      )
    }
  }, [])

  return {
    trackEvent,
    trackAddToCart,
    trackRemoveFromCart,
    trackBeginCheckout,
    trackAddShippingInfo,
    trackAddPaymentInfo,
    trackPurchase,
    trackViewItem,
    trackBookNow,
    trackPageView,
    trackRouterNavigate
  }
}
