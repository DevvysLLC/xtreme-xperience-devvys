# Review Booking Flow

## Initial Load / Refresh

- User lands on a wizard route (e.g. `/booking/<step>`)
- `useBooking()` begins hydrating persisted booking state from localStorage
- During this phase:
  - `isHydrated = false`
  - `booking` may be `null` or incomplete

## Guard During Hydration

- Guard renders but does not evaluate redirect logic while `isHydrated === false`
- Guard may display a loading overlay
- No redirects occur during hydration

## Hydration Completes

- `useBooking()` finishes reading and normalizing localStorage data
- Now:
  - `isHydrated = true`
  - `booking` contains persisted wizard state (or null if none exists)

## Guard Evaluates Flow

Guard computes:

- `hasEventOrTrack`
- `maxAccessiblePageIndex(booking)`
- Any cart gating rules (using primitive cart summary values)

Then:

- If current path is illegal → `router.replace(correctPath)`
- If current path is valid → allow rendering to continue

Guard is the single navigation authority.

## Page Mounts With Stable Inputs

- Page calls its page hook
- Page hook returns:
  - `persisted` (parsed page value or null)
  - `isValid` (pure boolean derived from persisted value + cart primitives)
  - `save()`

No navigation logic exists in the page.

## Form Initialization

- Form initializes once using `persisted ?? DEFAULT_VALUES`
- No effects that sync form ↔ context
- Context is UI-only and stores primitives only (if used at all)

## User Editing Phase

- Form owns all editing state
- Context updates only occur for UI primitives (e.g. selected tab, selected date)
- Context setters are idempotent (no-op if value unchanged)
- No automatic mirroring between form and booking state

## Save / Submit

When user submits:

- Page computes final payload from form values
- Validity is determined (pure boolean)
- Page calls `save(payload)` to persist booking state
- No direct navigation occurs inside the page

## Booking State Updates

- Persistence updates in-memory booking state
- `useBooking()` emits updated `booking`
- This is the only cross-page contract

## Guard Reacts and Redirects

- Guard re-evaluates flow using updated booking state
- If the wizard advanced → redirect to next accessible page
- If state invalidates access → redirect appropriately
- Page does not call router directly

## Next Page Repeats Lifecycle

- New page mounts
- Reads persisted state via page hook
- Initializes form once
- Submit persists → guard redirects

## Key Invariants

- Guard owns navigation
- Pages own forms and persistence
- Booking state is the cross-page contract
- Context stores UI primitives only
- No bidirectional syncing between form and booking
- All validity checks are pure
- Hydration gates guard decisions
