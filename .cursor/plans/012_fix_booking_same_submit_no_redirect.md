# Fix Booking Same Submit No Redirect

## Problem

Across wizard flows (`booking-wizard`, `checkout-wizard`, `order-wizard`), if a user returns to a step and submits unchanged values, navigation can get stuck on the same page.

Observed behavior:

- Submit succeeds
- Persisted payload is unchanged
- Guard does not perform forward redirect

Root cause:

- Current flow implicitly relies on detectable state change after submit
- When values are identical, persisted page state can be effectively unchanged for consumers
- Guard logic has no explicit "submit happened again" signal to react to

## Goal

Guarantee forward navigation after valid submit, even when form values are identical to existing persisted data.

Keep alignment with 008:

- Guard remains navigation authority
- Pages still only read + render + persist
- Page hooks stay thin

## Proposed Solution

Add an explicit submit marker to each persisted wizard page state.

Preferred field:

- `submitVersion: number` (increment on every successful submit)

Alternative:

- `lastSubmittedAt: string` (ISO timestamp)

Why `submitVersion`:

- Deterministic and monotonic
- Easier to compare in guard/effects than timestamps
- Clear intent: tracks submit events, not domain data mutation

## Data Model Changes

For each persisted wizard page schema/state in:

- booking wizard (`date_and_car`, `coverage_options`, `ride_along`, `media_packages`, `review`)
- checkout wizard (`details`, `payment`, and any persisted completion marker if present)
- order wizard (if/where persisted page submit state exists)

add:

- `submitVersion: z.number().int().nonnegative().default(0)`

Keep existing fields:

- `value`
- `pageIsValid`
- `userHasSubmitted`

Backwards compatibility:

- Missing `submitVersion` from old persisted data should hydrate as `0`

## Write Path Changes (Page Save Mutations)

In each wizard `save/set` mutation path:

- Read current page state from `base`
- Compute next submit version: `nextSubmitVersion = (current?.submitVersion ?? 0) + 1`
- Persist page object with:
  - new/validated `value`
  - `pageIsValid`
  - `userHasSubmitted`
  - `submitVersion: nextSubmitVersion`

Apply to booking:

- `use-booking-set-date-and-car`
- `use-booking-set-coverage-options`
- `use-booking-set-ride-along`
- `use-booking-set-media-packages`
- `use-booking-set-review`

Apply to checkout:

- `use-checkout-set-details`
- `use-checkout-set-payment`
- any completion submit persist helper if one is introduced/used

Apply to order:

- order step submit persist path (if order adopts persisted step state)
- if order remains single-page/no persisted step state, mirror the same pattern in the guard trigger path (explicit submit event signal)

## Guard Logic Changes

Guard forward redirect condition should depend on:

- page is complete/valid (`pageIsValid` + route rules)
- user has submitted
- latest submit event is observed (via `submitVersion`)

Implementation options:

- Reactive comparison in guard:
  - track last observed submitVersion per page in refs
  - if current page submitVersion increased and page valid -> go next
- Simpler route-level behavior:
  - on any render where current page is valid + submitted, redirect to next
  - relies on submitVersion only to ensure query subscribers re-render

Prefer the simpler route-level option unless user-flow regressions require stricter event gating.

Per wizard:

- Booking guard: react to submitted+valid page and move forward/handoff
- Checkout guard: react to submitted+valid details/payment and route forward
- Order guard: if order has submit-driven transitions, consume submit signal the same way; otherwise keep current accessibility guard behavior

## Acceptance Criteria

- User revisits a completed step, submits unchanged values, and moves forward
- This works in booking, checkout, and order flows where submit-driven step navigation is expected
- No page-level `router.push` is introduced for step-forward navigation
- Guard remains single redirect authority
- Existing skip/accessibility rules remain intact
- Persisted legacy state (without `submitVersion`) still loads safely

## Risks

- Schema updates may require migration defaults for older local storage data
- Over-eager guard redirects if validity/submission checks are too broad

Mitigations:

- Use default `submitVersion: 0` in schema
- Keep redirect condition scoped to current route page only
- Add targeted tests for unchanged-submit flow

## Validation Plan

Manual scenarios:

- Complete step A -> move to step B
- Navigate back to step A -> submit without changing fields
- Verify redirect to step B occurs
- Repeat for booking pages (coverage, ride along, media, review)
- Repeat for checkout pages (contacts/details, payment)
- Repeat for order flow submit path (if applicable)

Automated checks:

- Add unit tests for mutation submitVersion increments
- Add guard tests for unchanged submit redirection behavior
- Run `./run-task ci-ai`
