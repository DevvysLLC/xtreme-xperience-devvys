# Booking Wizard Testing Scenarios

Manual test scenarios for validating current booking wizard behavior driven by:

- `BookingInitializer` (track/event initialization and conditional reset)
- `BookingWizardGuard` (single routing authority)
- `intendedPageId` + `lastSubmittedAt` flow

## Prerequisites

- Clear booking storage before each scenario group unless the scenario says otherwise:

```js
localStorage.removeItem('booking-store')
```

- Use a valid booking URL with params, for example:
  - `/booking?track=old-bridge-township-raceway-park&event=499&setHomeTrack=true`
- In browser DevTools, filter logs by:
  - `booking-wizard-guard`
  - `BookingInitializer`

## A. Fresh Entry

### A1. Enter `/booking` with no existing booking

- Action: open `/booking`
- Expected: redirected to `/booking/choose-location`
- Expected guard log: `[hard-redirect] HOME with no booking`
- Expected state: `intendedPageId = "location"`

### A2. Enter `/booking?track=...&event=...&setHomeTrack=true`

- Action: open URL with track/event query params
- Expected:
  - initializer seeds track/event
  - guard redirects from `/booking` to `/booking/choose-date-and-car`
- Expected guard log: `[hard-redirect] HOME with booking`
- Expected state: `intendedPageId = "date_and_car"`

### A3. Enter `/booking/coverage-options` with no booking

- Expected: redirected to `/booking/choose-location`
- Expected guard log: `[hard-redirect] no event/track → location`

### A4. Enter `/booking/review` with no booking

- Expected: redirected to `/booking/choose-location`
- Expected guard log: `[hard-redirect] no event/track → location`

## B. Forward Progression (Submit)

### B1. Complete pages in order

1. Start on `/booking/choose-date-and-car`
2. Submit date-and-car
   - expect `/booking/coverage-options`
   - log: `[submit] navigating to next page`
3. Submit coverage-options
   - expect `/booking/ride-along`
4. Submit ride-along
   - expect `/booking/media-packages`
5. Submit media-packages
   - expect `/booking/review`
6. Submit review
   - expect `/checkout/contacts`
   - log: `[submit] review complete → checkout contacts`
   - expected state: `intendedPageId = null` before leaving booking flow

## C. Back Navigation

### C1. Single back click

- Precondition: on `/booking/coverage-options`
- Action: click page back button
- Expected:
  - navigates to `/booking/choose-date-and-car`
  - `intendedPageId = "date_and_car"`
  - previously entered date-and-car values remain
- Expected log: `[back-request] navigating to previous page`

### C2. Multiple back clicks from review

- Precondition: on `/booking/review` with all prior pages completed
- Action: click back repeatedly
- Expected path sequence:
  - `/booking/media-packages`
  - `/booking/ride-along`
  - `/booking/coverage-options`
  - `/booking/choose-date-and-car`
  - final back on date-and-car does not go to location when event/track exist
- Expected log on last step: `[back-request] no valid previous page`

### C3. Back then submit unchanged values

- Precondition: complete through `/booking/ride-along`
- Action:
  - back to `/booking/coverage-options`
  - submit without changing values
- Expected:
  - still moves forward to `/booking/ride-along`
  - `intendedPageId = "ride_along"`
- Expected log: `[submit] navigating to next page`

## D. Progress Bar Navigation

### D1. Click backward to a completed page

- Precondition: on `/booking/ride-along`
- Action: click Coverage in progress bar
- Expected:
  - navigates to `/booking/coverage-options`
  - `intendedPageId = "coverage_options"`
  - entered coverage data is preserved

### D2. Click forward to an already completed page

- Precondition: on `/booking/coverage-options`, ride-along already complete
- Action: click Ride Along in progress bar
- Expected:
  - navigates to `/booking/ride-along`
  - `intendedPageId = "ride_along"`

### D3. Inaccessible pages are not clickable

- Precondition: only location/date-and-car are complete
- Expected:
  - later steps render as non-link text (not `<a>`)

## E. Refresh Behavior

### E1. Refresh current intended page

- Precondition: on `/booking/coverage-options` with `intendedPageId = "coverage_options"`
- Action: browser refresh
- Expected:
  - remain on `/booking/coverage-options`
  - no jump to another page
- Expected log: `[ready] guard passed` (or canonicalize then ready)

### E2. Refresh a back-visited page

- Precondition: move back to `/booking/choose-date-and-car` and `intendedPageId` matches it
- Action: browser refresh
- Expected:
  - remain on `/booking/choose-date-and-car`
  - not redirected to furthest accessible step

## F. Deep Link with Existing Session

### F1. URL path differs from intended page

- Precondition: session has `intendedPageId = "coverage_options"`
- Action: manually type `/booking/choose-date-and-car`
- Expected:
  - redirected to `/booking/coverage-options`
  - `intendedPageId` remains `"coverage_options"`
- Expected log: `[enforce] pathname mismatch, redirecting to intended`

### F2. Direct URL to location while event/track exist

- Precondition: `intendedPageId = "ride_along"` and booking has event/track
- Action: manually type `/booking/choose-location`
- Expected:
  - redirected away from location
- Expected log: `[hard-redirect] page blocked by rules`

## G. Browser Back Button

### G1. Browser back exits wizard history

- Precondition: entered wizard from a non-booking page
- Action: use browser Back button
- Expected: exits wizard to prior non-booking route

## H. Edge Cases

### H1. intended page becomes inaccessible

- Precondition: completed through `ride_along`
- Action: manually corrupt booking state in storage so an earlier required page is missing, then refresh
- Expected:
  - guard falls back to accessible page
- Expected log: `[enforce] intended page not accessible or blocked, falling back` (or earlier hard redirect depending on state)

### H2. Invalid `intendedPageId`

- Action: set `intendedPageId` to an invalid value in `booking-store`, then open any booking route
- Expected:
  - guard clears invalid intended page
  - canonicalizes to accessible page
- Expected logs:
  - `[enforce] invalid intendedPageId, clearing`
  - then canonicalize/ready logs

### H3. Clear booking and re-enter

- Action:
  - clear `booking-store`
  - open `/booking`
- Expected:
  - redirected to `/booking/choose-location`
  - log: `[hard-redirect] HOME with no booking`

### H4. Re-select same track/event from location

- Precondition: navigate back to location, then pick same track/event pair
- Expected:
  - initializer does not call resetAfter for unchanged track/event
  - downstream booking page data remains intact
  - `intendedPageId = "date_and_car"` after initializer completes

### H5. Select different track or different event

- Precondition: existing booking session
- Action: choose a different track or different event
- Expected:
  - initializer runs reset flow (`shouldResetAfter = true`)
  - downstream wizard pages are cleared after location
  - `intendedPageId = "date_and_car"`

## I. Cart Constraint Scenarios

### I1. Cart emptied while on later pages

- Precondition: on a page after date-and-car (for example coverage-options)
- Action: clear cart externally or via session/cart invalidation
- Expected:
  - redirected to `/booking/choose-date-and-car`
  - `intendedPageId = "date_and_car"`
- Expected log: `[hard-redirect] no cars in cart → date_and_car`

## J. Location Blocking Rules

### J1. No back-navigation to location when event/track exist

- Precondition: on `/booking/choose-date-and-car` with event/track set
- Action: click page back
- Expected:
  - no navigation
  - remains on date-and-car
- Expected log: `[back-request] no valid previous page`

### J2. Location is accessible only when event/track are absent

- Precondition: clear booking storage
- Action: open `/booking/choose-location`
- Expected: stays on location page

## K. hasOnlyRideAlongs / Blocking-Skip Rules

### K1. Skip blocked pages during forward submit

- Precondition: cart state sets `hasOnlyRideAlongs = true`
- Action: submit date-and-car
- Expected:
  - coverage and ride-along are skipped
  - lands on media-packages
- Expected log: `[submit] navigating to next page` (next page is unblocked page)

### K2. Skip blocked pages during back navigation

- Precondition: on media-packages with `hasOnlyRideAlongs = true`
- Action: click back
- Expected:
  - skips ride-along and coverage
  - lands on date-and-car
- Expected log: `[back-request] navigating to previous page`

### K3. Blocked pages are non-clickable in progress bar

- Precondition: `hasOnlyRideAlongs = true`
- Expected:
  - Coverage and Ride Along render as non-links in progress bar

## Automated Validation

After manual validation:

```bash
./run-task ci-ai
```

