# Fix Booking Initializer Track Switch

## Problem

`error_initializing` is shown too often when users enter booking from `booking-event-link`, especially after a booking has already been started.

Observed behavior:

- Entry from global track finder uses query params to open booking: `/booking?track=...&event=...&setHomeTrack=true`
- Booking home renders `/app/src/components/booking-wizard/components/booking-initializer/index.tsx` and runs:
  - `resetAfter({ pageId: 'location', clearCart: true })`
  - `setTrack(...)`
  - `setEvent(...)`
  - optional `setLocationTrack(...)`
- Any thrown error in this sequence triggers `error_initializing` and redirects to booking location

Root cause:

- `resetAfter(..., clearCart: true)` can fail due to cart-layer contention (`OPERATION_IN_PROGRESS`) or missing cart key (`NO_CART_KEY`)
- Cart refresh runs globally via `CartProvider` + `use-cart-refresh`, so collision timing is realistic when a booking/cart already exists
- Initializer currently treats this reset/cart-clear failure as fatal, even when track/event reseeding could still succeed
- Track-switch entry needs deterministic booking reset behavior to avoid stale cross-track state

## Goal

Make booking initialization resilient and deterministic:

- Keep track/event reseeding as the critical path
- Prevent transient reset/cart-clear issues from triggering unnecessary `error_initializing`
- Ensure booking data is explicitly cleared when incoming track differs from persisted track

## Proposed Solution

Update booking initializer flow in `/app/src/components/booking-wizard/components/booking-initializer/index.tsx`:

- Read current booking state before initialization
- Detect track switch (`existingTrackId !== incomingTrackId`)
- If track switched, clear booking state deterministically before writing new track/event
- Execute `resetAfter(location, clearCart)` as best-effort (or targeted retry), not as a hard blocker
- Continue with `setTrack`, `setEvent`, optional `setLocationTrack`
- Keep user-facing `error_initializing` only for true blocking failures in the critical write path

Logging boundary:

- Log track-switch metadata (`existingTrackId`, `incomingTrackId`, `isTrackSwitch`) at initializer start
- Log reset/cart-clear failures as non-fatal warnings
- Preserve error logging for hard failures that still surface to users

## Implementation Targets

- `/app/src/components/booking-wizard/components/booking-initializer/index.tsx`
- `/app/src/features/booking/use-booking-reset-after.ts`
- `/app/src/features/booking/use-booking-clear.ts` (if used for explicit track-switch reset)
- `/app/src/features/cart/use-cart-mutation.ts` (only if normalization is required for non-fatal cart-clear outcomes)

## Acceptance Criteria

- Existing started booking + same track/event entry does not show `error_initializing` and lands on date-and-car
- Existing started booking + different track entry clears prior booking data and reseeds cleanly
- Transient cart refresh contention does not block initialization when track/event writes are valid
- `error_initializing` appears only for true blocking initialization failures
- Guard behavior remains stable (no redirect regressions)

## Risks

- Making reset/cart-clear non-fatal may hide legitimate reset issues if logs are weak
- Track-switch clear could be too broad if not scoped to booking state only

Mitigations:

- Keep explicit warning logs for non-fatal reset/cart-clear failures
- Keep hard-failure path unchanged for `setTrack`/`setEvent` write errors
- Validate same-track and cross-track scenarios manually

## Validation Plan

Manual scenarios:

- Existing booking started, click book now for same track/event
- Existing booking started, click book now for different track
- Induce/observe cart refresh contention during initializer execution
- Verify redirect and guard behavior remain consistent

Automated checks:

- Run `./run-task ci-ai`
- Resolve any introduced errors before merge
