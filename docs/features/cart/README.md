# Cart Feature

## Overview

The cart feature manages the shopping cart state, line items, metadata, and cart operations. It integrates with RocketRez API for cart persistence and automatically manages insurance validation and removal based on cart contents.

- User adds items to cart → Cart state updates → Metadata tracks item types → Insurance validated/removed automatically → Cart synced with API
- State is persisted to localStorage and synchronized via React Query
- Automatic insurance management ensures insurance quantity matches total sessions

- [Client Docs](./client/readme.md) — Client-facing, digestible overview
- [Flow Diagrams](./diagrams.md) — Technical flow diagrams for developers

## Hooks

### useCart

Main hook to access cart state, contents, and operations. Returns cart data, computed contents (insurance, cars, addons counts), loading states, and clear function. Automatically removes insurance when no cars are present or when insurance quantity doesn't match sessions.

**Location:** `src/hooks/use-cart/use-cart.ts`

### useCartAdd

Mutation hook to add a line item to the cart via RocketRez API. Optionally adds metadata for the line item.

**Location:** `src/hooks/use-cart/use-cart-add.ts`

### useCartAddAddon

Mutation hook to add an addon item to the cart.

**Location:** `src/hooks/use-cart/use-cart-add-addon.ts`

### useCartAddEvent

Mutation hook to add an event (car) to the cart with associated metadata including supercar and user selection state.

**Location:** `src/hooks/use-cart/use-cart-add-event.ts`

### useCartAddInsurance

Mutation hook to add insurance to the cart.

**Location:** `src/hooks/use-cart/use-cart-add-insurance.ts`

### useCartContactAdd

Mutation hook to add contact information to the cart.

**Location:** `src/hooks/use-cart/use-cart-contact-add.ts`

### useCartContactRemove

Mutation hook to remove contact information from the cart.

**Location:** `src/hooks/use-cart/use-cart-contact-remove.ts`

### useCartContactUpdate

Mutation hook to update contact information in the cart.

**Location:** `src/hooks/use-cart/use-cart-contact-update.ts`

### useCartCouponAdd

Mutation hook to apply a coupon code to the cart.

**Location:** `src/hooks/use-cart/use-cart-coupon-add.ts`

### useCartCouponRemove

Mutation hook to remove a coupon code from the cart.

**Location:** `src/hooks/use-cart/use-cart-coupon-remove.ts`

### useCartRefresh

Query hook to refresh cart data from the RocketRez API.

**Location:** `src/hooks/use-cart/use-cart-refresh.ts`

### useCartRemoveAll

Mutation hook to remove all items from the cart.

**Location:** `src/hooks/use-cart/use-cart-remove-all.ts`

### useCartRemoveLineItem

Mutation hook to remove a specific line item from the cart.

**Location:** `src/hooks/use-cart/use-cart-remove-line-item.ts`

### useCartReplaceInsurance

Mutation hook to replace existing insurance in the cart with new insurance.

**Location:** `src/hooks/use-cart/use-cart-replace-insurance.ts`

### useCartUpdateLineItem

Mutation hook to update a line item's quantity or properties in the cart.

**Location:** `src/hooks/use-cart/use-cart-update-line-item.ts`

### useSetCartOpen

Mutation hook to control cart open/closed state.

**Location:** `src/hooks/use-cart/use-set-cart-open.ts`

### useToggleCart

Mutation hook to toggle cart open/closed state.

**Location:** `src/hooks/use-cart/use-toggle-cart.ts`

## Components
