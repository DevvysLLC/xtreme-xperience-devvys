# Checkout Feature

## Overview

The checkout feature manages the multi-step checkout process including customer details, payment, and order completion. Users navigate from the cart through a sequential wizard enforced by a navigation guard.

- User has items in cart → Navigates to `/checkout/contacts` → Enters details → Payment iframe processes payment (including redirect-based methods like Affirm) → Cart completed server-side → Order confirmation → Stores cleared → Redirect to order page
- Wizard page access is enforced by `CheckoutWizardGuard` based on checkout store state
- Checkout state is persisted to localStorage via Zustand and synchronized with React Query
- Store cleanup (cart, booking, checkout) is deferred to the complete page to avoid race conditions with the wizard guard

- [Client Docs](./client/readme.md) — Client-facing, digestible overview
- [Flow Diagrams](./diagrams.md) — Technical flow diagrams for developers

## Hooks

### useCheckout

Main hook to access checkout state (details, payment). Wraps a Zustand store read in a React Query query. Subscribes to store changes and invalidates the query on updates.

**Location:** `src/features/checkout/use-checkout.ts`

### useCheckoutWithCart

Combines checkout state with cart state. Returns `{ checkout, cart, isLoading, isUpdating }`. Used by the wizard guard to determine page access and redirect logic.

**Location:** `src/features/checkout/use-checkout-with-cart.ts`

### useCheckoutClear

Clears all checkout state and resets to initial state.

**Location:** `src/features/checkout/use-checkout-clear.ts`

### useCheckoutGatewayClientSecret

Fetches payment gateway client secret for the payment iframe. Mutation hook called when the payment page mounts.

**Location:** `src/features/checkout/use-checkout-gateway-client-secret.ts`

### useCheckoutPageDetails

Manages state for the contacts/details page. Provides `get()`, `set()`, `isValid()`, and `getDefaultFormValues()`. The `isValid()` check requires: cart has items, cart is active, contacts exist, line items exist, and total > 0.

**Location:** `src/features/checkout/use-checkout-page-details.ts`

### useCheckoutPagePayment

Manages state for the payment page. Depends on `useCheckoutPageDetails` for validation (details must be complete before payment is accessible).

**Location:** `src/features/checkout/use-checkout-page-payment.ts`

### useRocketRezPayment

Manages the payment iframe communication (`postMessage`) with redirect-aware behavior for methods like Affirm.

- Sends `INIT` when iframe loads, retries until `READY` is received
- Normal flow: after `READY`, sends `PROCESS_PAYMENT`
- Redirect-return flow: after `READY`, sends `RESUME_PAYMENT`
- Filters untrusted messages by `origin` and `event.source`
- Handles iframe lifecycle events: `PAYMENT_AUTH_SUCCESS`, `PAYMENT_AUTH_ERROR`, `PAYMENT_SUCCESS`, `PAYMENT_ERROR`

**Location:** `src/features/checkout/use-checkout-payment.ts`

### useCartComplete

Completes the cart server-side via `POST /api/v1/cart/complete`. Creates the order in the database. Does NOT clear client-side stores (see `useCartClearAfterComplete`).

**Location:** `src/features/cart/use-cart-complete.ts`

### useCartClearAfterComplete

Clears all three stores (cart, booking, checkout) and invalidates their React Query caches. Called on the complete page after analytics fire. Separated from `useCartComplete` to avoid a race condition where the wizard guard would see an empty cart and redirect to the home page before navigation to the complete page takes effect.

**Location:** `src/features/cart/use-cart-clear-after-complete.ts`

### useOrderMarkViewed

Marks an order as viewed via `PATCH /api/v1/booking/order/[id]`. Called on the complete page before navigating to the order detail page.

**Location:** `src/features/order/use-order-mark-viewed.ts`

## Components

### CheckoutWizardGuard

Client component that enforces sequential page access in the checkout wizard. Checks `checkout.details` state to determine if the payment page is accessible. Redirects to the home page if the cart is empty. Bypasses all checks for the `/checkout/complete/*` path (post-checkout).

**Location:** `src/components/checkout-wizard/components/checkout-guard/index.tsx`

### ContactsForm

Client component rendering the contact details form (name, email, phone, billing address). Uses `@tanstack/react-form` with Zod schema validators.

**Location:** `src/components/checkout-wizard/components/contacts-form/index.tsx`

### PaymentV2

Client component that renders the payment iframe and orchestrates parent-side redirect resume state.

- Builds `paymentRequest` with optional `returnUrl` (`.../checkout/payment#checkout-iframe`)
- Persists redirect context before `PROCESS_PAYMENT`: `cartId`, `cartToken`, `userGuid`, `paymentMethodId`, `paymentRequest`
- On return from redirect (`payment_intent_client_secret`), restores persisted state, strips URL params (`payment_intent_client_secret`, `redirect_status`, `payment_intent`), then resumes via `RESUME_PAYMENT`
- On terminal payment outcomes, completes cart and clears persisted redirect state

**Location:** `src/components/checkout-wizard/components/payment-v2/index.tsx`

### PageFooter

Shared footer component for wizard pages. Renders back/submit buttons with form integration.

**Location:** `src/components/checkout-wizard/components/page-footer/index.tsx`

## Pages

### ContactsPage (`/checkout/contacts`)

First checkout step. User fills contact info and billing address. Saves contact to cart via API, persists form data to checkout store, then navigates to payment page.

**Location:** `src/components/checkout-wizard/pages/contacts/index.tsx`

### PaymentPage (`/checkout/payment`)

Second checkout step. Renders `PaymentV2` and receives payment success/error callbacks. On success, cart completion is performed and checkout payment state is saved; the wizard guard uses that state to route to `/checkout/complete/[id]`.

**Location:** `src/components/checkout-wizard/pages/payment/index.tsx`

### CompletePage (`/checkout/complete/[id]`)

Post-checkout confirmation page. Fetches the order from the API, tracks a purchase analytics event, waits 5 seconds for analytics to flush, then calls `useCartClearAfterComplete` to clear all stores, marks the order as viewed, and navigates to the order detail page. Redirects immediately if the order was already viewed.

**Location:** `src/components/checkout-wizard/pages/complete/index.tsx`
