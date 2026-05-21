# 018 — Fix "Book Now" buttons when a track has no upcoming events

## Problem

When a track has no upcoming events, the `event` prop passed to booking components is `null`. This caused two broken behaviors:

1. **`BookingEventCta`** — Rendered `<>{children}</>` when `event` was `null`, making the entire CTA (button/text) disappear from the UI. Affected consumers like `track-card` (track finder) and `booking-event-card`.

2. **`BookingEventLink`** — In the non-legacy booking path, generated a URL like `/booking?track=<handle>` with no event parameter, sending users into a broken booking flow. The legacy path already had a correct fallback to `/events`.

## Solution

When `event` is `null`, both components now fall back to linking users to the events listing page (`/events`) via `ROUTES.FRONTEND.EVENTS.LISTING`.

### Changes

#### `src/components/booking-event-link/index.tsx`

- Move the `!event` check to the top of the `bookingUrl` memo, before the legacy/non-legacy branching.
- When `event` is `null`, return `ROUTES.FRONTEND.EVENTS.LISTING` regardless of booking mode.
- This unifies the fallback behavior that previously only existed in the legacy path.

#### `src/components/booking-event-cta/index.tsx`

- Replace the early return of `<>{children}</>` with a `CoreCta` that links to `ROUTES.FRONTEND.EVENTS.LISTING`.
- The fallback CTA preserves the same `layoutType`, `styleType`, `sizeType`, `text`, `className`, and `children` props so it renders identically to the normal CTA — just as a link instead of a booking action button.

## Affected consumers

These components pass `event: null` when a track has no upcoming events and will now show a working link to `/events` instead of a broken or missing button:

- `section-track-hero` — Hero "Book Now" button on track pages
- `global-track-finder/track-card` — "Book Now" button on track cards in the track finder drawer
- `booking-event-card` — "Select" button on event cards

## Validation

- CI (`./run-task ci-ai`) passes: lint, typecheck, prettify, and tests all clean.
