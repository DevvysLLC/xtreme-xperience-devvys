# Analytics Feature

## Overview

The analytics feature tracks user interactions and e-commerce activity across Google Tag Manager/GA4 and Facebook Pixel.

- **GA4 + GTM:** events are pushed to `window.dataLayer`
- **Facebook Pixel:** events are sent through `window.fbq`
- **Unified e-commerce hook:** one API call fans out to both providers where supported

- [Client Docs](./client/readme.md) — Client-facing, digestible overview
- [Flow Diagrams](./diagrams.md) — Technical flow diagrams for developers

## Event Tracking Layers

### Global Interaction Tracking (GA/GTM)

`ScriptsGoogleAnalytics` listens to document-level `click` and `submit` events, builds a normalized event payload, and pushes prefixed event names into the data layer.

- Event names are prefixed with `xx_frontend_` (via `ANALYTICS_EVENT_PREFIX`)
- Supports `data-ga-*` attributes for metadata
- Supports section context via `data-ga-section-name`
- Applies rate limiting to avoid event spam

**Location:** `src/components/scripts-google-analytics/index.tsx`

### E-commerce Tracking (GA4 + Facebook Pixel)

`useAnalyticsEcommerceEvent` is the main entry point for cart/checkout/purchase tracking. It delegates to:

- `useAnalyticsGA4Event` for GA4 e-commerce events (`add_to_cart`, `begin_checkout`, `add_payment_info`, `purchase`, etc.)
- `useAnalyticsFacebookPixelEvent` for FB Pixel commerce events (`AddToCart`, `InitiateCheckout`, `AddPaymentInfo`, `Purchase`)

**Location:** `src/hooks/use-analytics/use-analytics-ecommerce-event.ts`

### Domain-Specific GA4 Custom Events

Some non-e-commerce product events are tracked directly through the GA4 hook:

- `trackBookNow()` on booking CTA/link interactions
- `trackViewItem()` on supercar detail view tracking

**Locations:**
- `src/components/booking-event-cta/index.tsx`
- `src/components/booking-event-link/index.tsx`
- `src/components/template-supercar-detail-page/components/track-view-item.tsx`

## Hooks

### useAnalyticsEcommerceEvent

Unified tracking facade for checkout/cart lifecycle events:

- `trackAddToCart`
- `trackRemoveFromCart` (GA4 only)
- `trackBeginCheckout`
- `trackAddPaymentInfo`
- `trackPurchase` (requires `transactionId`)

**Location:** `src/hooks/use-analytics/use-analytics-ecommerce-event.ts`

### useAnalyticsGA4Event

GA4 data layer utilities.

- Ensures `window.dataLayer` exists before pushing
- Clears previous `ecommerce` object before each e-commerce push
- Maps RocketRez line items + metadata to GA4 `items[]`
- Tracks custom events like `view_item` and `book_now`

**Location:** `src/hooks/use-analytics/use-analytics-ga4-event.ts`

### useAnalyticsFacebookPixelEvent

Facebook Pixel helpers.

- Guards on `window.fbq` availability
- Maps line items into Pixel `contents[]`
- Sends standard commerce events (`AddToCart`, `InitiateCheckout`, etc.)

**Location:** `src/hooks/use-analytics/use-analytics-fbpixel-event.ts`

### normaliseCurrency

Normalizes currency names (for example, `US Dollars`) to ISO 4217 codes (`USD`) before events are sent.

**Location:** `src/hooks/use-analytics/normalise-currency.ts`

## Event Enablement and Runtime Behavior

- Google interaction tracking is mounted in `src/app/layout.tsx` via `ScriptsGoogleAnalytics`
- Facebook Pixel script is mounted in `src/app/layout.tsx` via `FacebookPixel`
- Both are controlled by global config feature flags (for example, `googleEnableAnalytics`, `googleEnableEventTracking`, `enableFacebookPixel`)

## Requirements Reference

Initial analytics event requirements are captured in:

- `docs/features/analytics/requirements.md`

Use that document as a reference for target event shape and naming while keeping this README aligned with actual implementation details.
