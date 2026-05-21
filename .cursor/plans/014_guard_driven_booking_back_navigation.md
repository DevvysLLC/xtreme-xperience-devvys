# Guard Driven Booking Back Navigation

## Problem

The booking wizard back button in page footer currently uses browser history (`router.back()`), which is inconsistent with the guard-driven wizard flow.

Observed behavior:

- Back navigation depends on prior browser entries, not wizard step order
- Users can leave the intended wizard flow depending on how they arrived
- Forward navigation is already centralized in `BookingWizardGuard`, but back is not

Root cause:

- `PageFooter` performs direct routing via `router.back()`
- Guard owns submit/access redirects, but no equivalent back-intent handling
- Wizard config already has `getPreviousPagePath`, but footer bypasses it

## Goal

Make booking wizard navigation deterministic and guard-driven in both directions:

- Replace browser-history back behavior with configured previous-step behavior
- Keep route transitions centralized in guard logic
- Preserve existing forward-submit and access guard behavior

## Proposed Solution

Implement a guard-consumed back-intent flow:

- Add ephemeral back-intent fields to booking UI state
- Add a mutation hook to request/clear back-intent
- Refactor `PageFooter` to emit `onBack` callback instead of `router.back()`
- Wire booking wizard pages to request back-intent using current pathname
- Update `BookingWizardGuard` to consume new back-intent and navigate with `getPreviousPagePath(pathname)` via `router.replace`
- Clear consumed intent to avoid repeated redirects

## Implementation Targets

- `/app/src/components/booking-wizard/components/page-footer/index.tsx`
- `/app/src/components/booking-wizard/components/booking-guard/index.tsx`
- `/app/src/components/booking-wizard/pages/choose-date-and-car/index.tsx`
- `/app/src/components/booking-wizard/pages/coverage-options/index.tsx`
- `/app/src/components/booking-wizard/pages/ride-along/index.tsx`
- `/app/src/components/booking-wizard/pages/media-packages/index.tsx`
- `/app/src/components/booking-wizard/pages/review/index.tsx`
- `/app/src/features/booking/use-booking-request-back-navigation.ts`
- `/app/src/features/booking/repository.ts`
- `/app/src/features/booking/index.ts`
- `/app/src/io/schemas.ts`

## Validation

- Back from each wizard step routes to configured previous enabled step
- Back from first step does not route to arbitrary browser history
- Forward submit navigation continues to work unchanged
- Guard access redirects continue to normalize deep links
- Run project validation:
  - `./run-task ci-ai`

## Notes

- Back intent is UI state and not part of persisted booking payload
- Guard remains the single route-transition authority for wizard pages
