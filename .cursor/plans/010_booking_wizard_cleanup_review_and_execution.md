# Booking Wizard Cleanup Review + Execution Plan

Your initial plan direction is strong and aligns with current pain points (cross-page hook chains, duplicated page redirects, context-derived form defaults). The main gaps are implementation order, transition boundaries, and preservation of current reset semantics. This plan keeps your architecture but makes rollout safe and incremental.

## What to Keep From Initial Plan

- Single navigation authority in guard/config is correct
- Page hooks becoming thin (`persisted`, pure `isValid`, `save`) is correct
- Context reduced to UI-only state is correct
- Primitive-based validity checks is correct

## Critical Additions Before Implementation

- Preserve cart-invalidates-downstream behavior currently handled by validator/reset logic
- Remove duplicate forward navigation in page components only after guard can handle forward progression
- Explicitly retire cross-page hook chain in features layer
- Define objective "done" criteria per page (no `router.push`, no previous-step hook import, no context-form merge)
- Keep explicit boundary exceptions:
  - entry point initialization flow may retain redirect handling in booking initializer
  - exit point completion flow may retain redirect handling from wizard completion to checkout

## Scope and File Targets

- Guard/navigation/core config:
  - [/app/src/components/booking-wizard/components/wizard-guard/index.tsx](/app/src/components/booking-wizard/components/wizard-guard/index.tsx)
  - [/app/src/components/booking-wizard/config.ts](/app/src/components/booking-wizard/config.ts)
  - [/app/src/features/booking/use-booking-page-validator.ts](/app/src/features/booking/use-booking-page-validator.ts)
- Wizard context:
  - [/app/src/components/booking-wizard/context.tsx](/app/src/components/booking-wizard/context.tsx)
- Page hooks (decoupling):
  - [/app/src/features/booking/use-booking-page-choose-date-and-car.ts](/app/src/features/booking/use-booking-page-choose-date-and-car.ts)
  - [/app/src/features/booking/use-booking-page-coverage-options.ts](/app/src/features/booking/use-booking-page-coverage-options.ts)
  - [/app/src/features/booking/use-booking-page-ride-along.ts](/app/src/features/booking/use-booking-page-ride-along.ts)
  - [/app/src/features/booking/use-booking-page-media-packages.ts](/app/src/features/booking/use-booking-page-media-packages.ts)
  - [/app/src/features/booking/use-booking-page-review.ts](/app/src/features/booking/use-booking-page-review.ts)
  - [/app/src/features/booking/use-booking-page-location.ts](/app/src/features/booking/use-booking-page-location.ts)
- Page components (remove page-owned routing):
  - [/app/src/components/booking-wizard/pages/choose-location/index.tsx](/app/src/components/booking-wizard/pages/choose-location/index.tsx)
  - [/app/src/components/booking-wizard/pages/choose-date-and-car/index.tsx](/app/src/components/booking-wizard/pages/choose-date-and-car/index.tsx)
  - [/app/src/components/booking-wizard/pages/coverage-options/index.tsx](/app/src/components/booking-wizard/pages/coverage-options/index.tsx)
  - [/app/src/components/booking-wizard/pages/ride-along/index.tsx](/app/src/components/booking-wizard/pages/ride-along/index.tsx)
  - [/app/src/components/booking-wizard/pages/media-packages/index.tsx](/app/src/components/booking-wizard/pages/media-packages/index.tsx)
  - [/app/src/components/booking-wizard/pages/review/index.tsx](/app/src/components/booking-wizard/pages/review/index.tsx)
- Boundary components (allowed redirect ownership):
  - [/app/src/components/booking-wizard/components/booking-initializer/index.tsx](/app/src/components/booking-wizard/components/booking-initializer/index.tsx) as entry point
  - [/app/src/components/booking-wizard/pages/review/index.tsx](/app/src/components/booking-wizard/pages/review/index.tsx) completion transition to checkout as exit point

## Choose-Date-And-Car State Lifecycle (Current)

This section documents the current end-to-end state path so cleanup work has a concrete baseline.

## Page State Required

- Persisted page payload (`booking.date_and_car.value`):
  - `cars`
  - `selectedDate`
  - `selectedEvent`
  - `selectedDay`
  - `activeTabIndex`
  - `isValid`
  - `isSubmitted`
- Runtime/UI state consumed by page and child components:
  - `state.eventData`
  - `state.selectedDay`
  - `state.activeTabIndex`
  - `state.selectedEvent`

## How It Loads From localStorage

- `useBooking()` loads booking through React Query
- Query function calls `bookingRepository.read()`
- `bookingRepository.read()` reads `localStorage` key `booking-store`
- Parsed data is validated by `PersistedBookingStateSchema`
- `date_and_car` then flows through `useBookingWithCart()` into `BookingWizardProvider`
- `BookingWizardProvider` derives context defaults from persisted `date_and_car.value.selectedEvent` and `date_and_car.value.activeTabIndex`

## How It Syncs With State

- Current sync is a merge between persisted booking page data and context overrides:
  - persisted source: `booking.date_and_car.value`
  - context source: `selectedDay`, `selectedEvent`, `activeTabIndex`
- `useBookingPageChooseDateAndCar.getDefaultFormValues(...)` merges context + stored values via `getFormValue(...)`
- `DateSelect` can mutate context `selectedDay` on event/schedule changes
- `SupercarOptions` can mutate context `activeTabIndex`

## How It Is Saved

- Intended persistence path:
  - `useBookingPageChooseDateAndCar.set(...)`
  - `useBookingSetDateAndCar.mutateAsync(...)`
  - update React Query cache
  - `bookingRepository.write(next)`
  - `localStorage.setItem('booking-store', ...)`
- Current observed gap in [/app/src/components/booking-wizard/pages/choose-date-and-car/index.tsx](/app/src/components/booking-wizard/pages/choose-date-and-car/index.tsx):
  - submit handler computes `carLineItems` but does not call page `set(...)` / date-and-car mutation, so persistence is not performed in this page component as currently written

## Phase 1: Make Navigation Deterministic in One Place

- Introduce/extend a single guard decision function in wizard config for:
  - current path validity
  - backward correction (current > max accessible)
  - optional forward progression trigger when page becomes complete
  - cart invalidation fallback
- Update guard to use this decision function only
- Keep existing validator active temporarily for reset semantics during transition
- Respect explicit boundaries: initializer (entry) and completion-to-checkout (exit) are intentionally outside step-to-step guard ownership

## Phase 2: Decouple Page Hook Graph

- For each page hook, remove previous-step hook imports/calls
- `isValid` uses only:
  - persisted page state
  - cart primitive summary needed for that page
- Keep `get`/`set` behavior stable while simplifying shape to thin interface

## Phase 3: Shrink Context to UI-Only

- In wizard context, stop serving as booking/default-value merger
- Keep only UI convenience state (selected day/event id/tab index) and avoid storing booking validity/flow decisions
- Remove context-driven fallback merging in page-form defaults; use persisted value first, then local deterministic fallback

## Phase 4: Remove Page-Owned Navigation

- Remove `router.push` forward transitions from wizard pages
- Submits only persist booking/page state; guard performs redirect after state change
- Remove page-level "compute next path" usage
- Do not remove entry/exit boundary redirects:
  - initializer redirects into wizard start state
  - completion redirect from wizard to checkout

## Phase 5: Retire Temporary Duplicate Logic

- Once guard-driven flow is stable, simplify validator responsibilities:
  - either reduce to downstream reset-only
  - or fold reset trigger into guard-level decision if cleaner
- Remove dead utilities no longer used by pages

## Verification Plan

- Manual flow checks:
  - fresh entry: home/location/date-and-car progression
  - submit each step and confirm guard-driven forward navigation
  - direct URL to inaccessible step redirects backward correctly
  - cart mutation invalidates downstream steps and redirects safely
  - back navigation still works
- Data integrity checks:
  - confirm `date_and_car` is written on submit (query cache and `localStorage` key `booking-store`)
  - confirm reload hydrates `date_and_car` and UI defaults deterministically
  - confirm event/day/tab context changes no longer overwrite persisted values unexpectedly
- Navigation ownership checks:
  - confirm intra-wizard forward navigation occurs only via guard/config decisions
  - confirm initializer entry redirect still works as boundary exception
  - confirm completion exit redirect to checkout still works as boundary exception
- Regression checks:
  - confirm validator/reset behavior still clears downstream steps when cart invalidates requirements
  - confirm no redirect oscillation (guard <-> page/initializer) on slow updates
- Technical validation:
  - run `./run-task ci-ai` after edits until clean
  - check for effect loops/regressions around guard/context updates
  - remove transitional/dead logic only after all checks above pass

## Success Criteria

- No wizard step page calls `router.push` for intra-wizard progression
- No page hook imports previous-step page hook
- Guard/config is sole source of route progression decisions
- Entry/exit redirects remain explicit and isolated (initializer entry, completion exit)
- Context does not hold booking flow/validity state
- No render loops from object identity churn between context, hook defaults, and page effects
