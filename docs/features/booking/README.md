# Booking Feature

## Overview

The booking feature manages the multi-step booking wizard flow for users to select events, tracks, dates, cars, coverage options, and other booking-related selections. It uses a Zustand store for state management with React Query integration for reactive updates.

- User selects track and event → Sets booking state → Navigates through wizard pages → Adds selections to cart
- State is persisted to localStorage and synchronized across components via React Query
- Each wizard page has its own state management hooks for validation and submission
- Navigation is driven by `intendedPageId` — a persisted field that declares which page the user should be on
- **Only the BookingWizardGuard calls `router.replace()`** — all other components signal intent by updating booking state

- [Client Docs](./client/readme.md) — Client-facing, digestible overview
- [Flow Diagrams](./diagrams.md) — Technical flow diagrams for developers
- [Testing Scenarios](./testing/README.md) — Manual validation steps

## Navigation Architecture

### Single Routing Authority

The `BookingWizardGuard` is the sole component that performs route changes within the booking wizard. All other components (initializer, progress bar, page back buttons, page submit handlers) communicate navigation intent by mutating booking state. The guard reacts to state changes and performs the actual `router.replace()`.

This eliminates race conditions between competing navigation actors and ensures deterministic routing behavior.

### intendedPageId

A persisted field in the booking store (`BookingState.intendedPageId`) that explicitly declares which wizard page the user should be viewing. It is set by:

- **BookingInitializer** — sets `'date_and_car'` after initialization
- **Back button** — sets `backNavigationRequestedAt`, which the guard consumes to compute the previous page
- **Page submit** — the guard detects new `lastSubmittedAt` timestamps and advances to the next page
- **Progress bar** — sets `intendedPageId` directly when a user clicks an accessible page

The guard enforces `intendedPageId` by redirecting to its path if the current pathname doesn't match.

### Page Blocking Rules

Certain pages are blocked based on cart/booking state via `isPageBlockedByRules()` in `config.ts`:

- **location** — blocked when event/track already exist (user can't go back to location selection)
- **coverage_options** — blocked when `insuranceSessions === 0` (nothing to insure)
- **ride_along** — blocked when `hasOnlyRideAlongs === true` (only ride-alongs in cart)

Blocked pages are skipped during forward/back navigation and hidden from the progress bar.

### Guard Logic (6 Steps)

1. **WAIT** — hold while booking/cart data is loading
2. **HARD REDIRECTS** — unconditional redirects (HOME route, no event/track, no cars, beyond max accessible, blocked pages)
3. **BACK REQUEST** — consume `backNavigationRequestedAt` signal, compute previous non-blocked page
4. **SUBMIT EVENT** — detect new `lastSubmittedAt`, advance to next non-blocked page
5. **CANONICALIZE** — if `intendedPageId` is null, set it to max accessible page
6. **ENFORCE INTENDED** — redirect to `intendedPageId` path if pathname doesn't match

## Hooks

### useBooking

Main hook to access booking state. Returns React Query result with booking data including all wizard pages, event, track, current page, errors, and loading state.

**Location:** `src/features/booking/use-booking.ts`

### useBookingClear

Clears all booking state and resets to initial state.

**Location:** `src/features/booking/use-booking-clear.ts`

### useBookingClearFieldErrors

Clears field-level validation errors from booking state.

**Location:** `src/features/booking/use-booking-clear-field-errors.ts`

### useBookingClearPage

Clears state for a specific wizard page.

**Location:** `src/features/booking/use-booking-clear-page.ts`

### useBookingConfig

Fetches booking configuration data from the API. Returns booking config fragment with caching enabled.

**Location:** `src/features/booking/use-booking-config.ts`

### useBookingEvent

Accesses the current event from booking state.

**Location:** `src/features/booking/use-booking-event.ts`

### useBookingPageChooseDateAndCar

Manages state for the date and car selection page of the booking wizard.

**Location:** `src/features/booking/use-booking-page-choose-date-and-car.ts`

### useBookingPageCoverageOptions

Manages state for the coverage options page of the booking wizard.

**Location:** `src/features/booking/use-booking-page-coverage-options.ts`

### useBookingPageLocation

Manages state for the location selection page of the booking wizard.

**Location:** `src/features/booking/use-booking-page-location.ts`

### useBookingPageMediaPackages

Manages state for the media packages selection page of the booking wizard.

**Location:** `src/features/booking/use-booking-page-media-packages.ts`

### useBookingPageMetadata

Accesses metadata for booking wizard pages.

**Location:** `src/features/booking/use-booking-page-metadata.ts`

### useBookingPageReview

Manages state for the review page of the booking wizard.

**Location:** `src/features/booking/use-booking-page-review.ts`

### useBookingPageRideAlong

Manages state for the ride-along selection page of the booking wizard.

**Location:** `src/features/booking/use-booking-page-ride-along.ts`

### useBookingPageValidator

Validates booking pages when cart state changes. Uses each page's `isValid()` method.

**Location:** `src/features/booking/use-booking-page-validator.ts`

### useBookingRequestBackNavigation

Mutation hook that signals a back navigation intent by setting `backNavigationRequestedAt` and `backNavigationFromPath` in the booking store. The guard consumes this signal to compute and navigate to the previous non-blocked page.

**Location:** `src/features/booking/use-booking-request-back-navigation.ts`

### useBookingResetAfter

Resets booking pages after a given page in the wizard flow. Clears all pages that come after the specified page and optionally clears the cart. Used by the BookingInitializer when a user enters with different track/event data.

**Location:** `src/features/booking/use-booking-reset-after.ts`

### useBookingSetCurrentPage

Sets the current active page in the booking wizard.

**Location:** `src/features/booking/use-booking-set-current-page.ts`

### useBookingSetEvent

Mutation hook to set the selected event in booking state.

**Location:** `src/features/booking/use-booking-set-event.ts`

### useBookingSetIntendedPage

Mutation hook to set `intendedPageId` in the booking store. Used by the initializer, progress bar, and guard to declare which page the user should be on. The guard enforces this by redirecting to the intended page's path.

**Location:** `src/features/booking/use-booking-set-intended-page.ts`

### useBookingSetTrack

Mutation hook to set the selected track in booking state.

**Location:** `src/features/booking/use-booking-set-track.ts`

### useBookingSupercar

Manages supercar-related booking data.

**Location:** `src/features/booking/use-booking-supercar.ts`

### useBookingSupercarMetadata

Accesses metadata for supercar bookings.

**Location:** `src/features/booking/use-booking-supercar-metadata.ts`

### useBookingSupercarRate

Fetches supercar pricing/rate data.

**Location:** `src/features/booking/use-booking-supercar-rate.ts`

### useBookingSupercarSchedule

Manages supercar schedule data for bookings.

**Location:** `src/features/booking/use-booking-supercar-schedule.ts`

### useBookingTrack

Fetches track data by handle from the API. Used for client-side track loading.

**Location:** `src/features/booking/use-booking-track.ts`

### useBookingWithCart

Combined hook that provides both booking state and cart state together with loading/updating flags.

**Location:** `src/features/booking/use-booking-with-cart.ts`

## Components

### BookingInitializer

Client component that initializes booking state from server-provided data. Rendered by `/booking/page.tsx` when track query params are present. Receives pre-fetched track/event data as props, sets booking state (track, event, home track), and sets `intendedPageId` to `'date_and_car'`. Does not perform navigation — the guard handles the route change.

**Location:** `src/components/booking-wizard/components/booking-initializer/index.tsx`

### BookingWizardGuard

Client component that protects booking wizard pages. Sole routing authority for the booking wizard — all `router.replace()` calls originate here. Implements the 6-step guard logic (wait, hard redirects, back request, submit event, canonicalize, enforce intended). Shows a loading overlay during transitions.

**Location:** `src/components/booking-wizard/components/booking-guard/index.tsx`

### BookingEventLink

Client component that renders a link to the booking flow with track/event query parameters. Shows a confirmation dialog if the user has cart items from a different track/event. Used on frontend pages (track hero, track spec, track finder).

**Location:** `src/components/booking-event-link/index.tsx`

### BookingEventCta

Client component that handles booking event selection with client-side state mutations. Sets track, event, and location state directly via mutation hooks. Shows confirmation dialog when changing track/event with items in cart. Used inside the booking wizard flow (e.g., choose-location page).

**Location:** `src/components/booking-event-cta/index.tsx`
