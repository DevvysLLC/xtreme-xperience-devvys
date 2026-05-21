# Booking Furthest Redirect Policy - Testing Scenarios

Manual test scenarios for validating the `intendedPageId` guard implementation.

For each scenario, open browser DevTools console and filter logs by `booking-wizard-guard` to verify the guard branch that fired matches the expected branch noted below.

## Prerequisites

- Clear localStorage (`localStorage.removeItem('booking')`) before each scenario group to start fresh unless noted otherwise
- Have a valid track/event URL ready, e.g.: `/booking?track=old-bridge-township-raceway-park&event=499&setHomeTrack=true`

## A. Fresh Entry (no existing booking state)

## A1. Navigate to `/booking` (no params)

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Type `/booking` in address bar | Redirected to `/booking/choose-location` | `[hard-redirect] HOME with no booking` |
| 2 | Verify `intendedPageId` in localStorage | `"location"` | |

## A2. Navigate to `/booking?track=...&event=...&setHomeTrack=true`

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Paste full URL with params | BookingInitializer runs, lands on `/booking/choose-date-and-car` | `[ready] guard passed` (intendedPageId = date_and_car) |
| 2 | Verify `intendedPageId` in localStorage | `"date_and_car"` | |

## A3. Navigate directly to `/booking/choose-coverage` (no booking state)

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Type URL directly | Redirected to `/booking/choose-location` | `[hard-redirect] no event/track → location` |

## A4. Navigate directly to an inaccessible page (no booking state)

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Type `/booking/review` directly | Redirected to `/booking/choose-location` | `[hard-redirect] no event/track → location` |

## B. Forward Progression (submit flow)

## B1. Complete pages sequentially

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Start from A2 (on date-and-car) | | |
| 2 | Fill out date/car and submit | Navigated to `/booking/choose-coverage` | `[submit] navigating to next page` |
| 3 | Verify `intendedPageId` | `"coverage_options"` | |
| 4 | Fill out coverage and submit | Navigated to `/booking/ride-along` | `[submit] navigating to next page` |
| 5 | Fill out ride-along and submit | Navigated to `/booking/media-packages` | `[submit] navigating to next page` |
| 6 | Fill out media-packages and submit | Navigated to `/booking/review` | `[submit] navigating to next page` |
| 7 | Submit review | Navigated to `/checkout/contacts` | `[submit] review complete → checkout contacts` |
| 8 | Verify `intendedPageId` | `null` | |

## C. Back Navigation

## C1. Single back click

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Be on `/booking/choose-coverage` (from B1 step 2) | | |
| 2 | Click "Back" button | Navigated to `/booking/choose-date-and-car` | `[back-request] navigating to previous page` |
| 3 | Verify `intendedPageId` | `"date_and_car"` | |
| 4 | Verify date-and-car form still has previous data | Data preserved (no reset) | |

## C2. Multiple back clicks

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Be on `/booking/review` (all pages complete) | | |
| 2 | Click "Back" | Navigated to `/booking/media-packages` | `[back-request]` |
| 3 | Click "Back" | Navigated to `/booking/ride-along` | `[back-request]` |
| 4 | Click "Back" | Navigated to `/booking/choose-coverage` | `[back-request]` |
| 5 | Click "Back" | Navigated to `/booking/choose-date-and-car` | `[back-request]` |
| 6 | Click "Back" | Navigated to `/booking/choose-location` | `[back-request]` |
| 7 | Verify all page data still exists in localStorage | All preserved | |

## C3. Back then forward (submit from back-visited page)

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Be on `/booking/ride-along` with all pages complete | | |
| 2 | Click "Back" to coverage-options | On coverage-options | `[back-request]` |
| 3 | Submit coverage-options (no changes) | Navigated to `/booking/ride-along` | `[submit] navigating to next page` |
| 4 | Verify `intendedPageId` | `"ride_along"` | |
| 5 | Verify ride-along data is still intact | Data preserved | |

## D. Progress Bar Navigation

## D1. Click backward on progress bar

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Be on `/booking/ride-along` (coverage-options complete) | | |
| 2 | Click "Coverage" in progress bar | Navigated to `/booking/choose-coverage` | |
| 3 | Verify `intendedPageId` | `"coverage_options"` | |
| 4 | Verify coverage-options data preserved | Data preserved | |

## D2. Click forward on progress bar (completed page)

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Continue from D1 (on coverage-options, ride-along completed) | | |
| 2 | Click "Ride Along" in progress bar | Navigated to `/booking/ride-along` | |
| 3 | Verify `intendedPageId` | `"ride_along"` | |

## D3. Progress bar does not allow inaccessible pages

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Be on `/booking/choose-date-and-car` (only location complete) | | |
| 2 | Verify "Coverage", "Ride Along", etc. are not clickable | Non-clickable (span, not link) | |

## E. Page Refresh

## E1. Refresh on current page

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Be on `/booking/choose-coverage` with `intendedPageId = "coverage_options"` | | |
| 2 | Press F5 / Cmd+R | Stays on `/booking/choose-coverage` | `[enforce] pathname matches` or `[ready]` |
| 3 | Verify no redirect flash | Page loads directly | |

## E2. Refresh on a back-visited page

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | From review, click back to date-and-car | On date-and-car, `intendedPageId = "date_and_car"` | |
| 2 | Press F5 / Cmd+R | Stays on `/booking/choose-date-and-car` | `[ready] guard passed` |
| 3 | Verify NOT redirected to review (max accessible) | Stays on date-and-car | |

## F. Deep Link / External Entry (with existing session)

## F1. Type a different wizard URL than intendedPageId

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Have session with `intendedPageId = "coverage_options"` | | |
| 2 | Type `/booking/choose-date-and-car` in address bar | Redirected to `/booking/choose-coverage` | `[enforce] pathname mismatch, redirecting to intended` |
| 3 | Verify `intendedPageId` unchanged | `"coverage_options"` | |

## F2. Type `/booking/choose-location` with existing booking

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Have session with `intendedPageId = "ride_along"` | | |
| 2 | Type `/booking/choose-location` in address bar | Redirected to `/booking/ride-along` | `[enforce] pathname mismatch` |

## G. Browser Back Button

## G1. Browser back exits wizard

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Navigate to booking wizard from a non-booking page | | |
| 2 | Progress through a few pages (all use replace) | | |
| 3 | Press browser Back button | Exits wizard to the pre-wizard page | (guard does not fire — left wizard) |

## H. Edge Cases

## H1. intendedPageId points to inaccessible page (external state change)

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Complete through ride-along, `intendedPageId = "ride_along"` | | |
| 2 | Manually clear `date_and_car` from localStorage booking data | | |
| 3 | Refresh page | Redirected to max accessible (likely location or date_and_car) | `[enforce] intended page not accessible, falling back` or `[hard-redirect]` |

## H2. Invalid intendedPageId in localStorage

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Manually set `intendedPageId` to `"nonexistent"` in localStorage | | |
| 2 | Navigate to any booking page | Canonicalizes to max accessible | `[enforce] invalid intendedPageId, clearing` then `[canonicalize]` |

## H3. Booking cleared then re-enter wizard

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Complete a full booking flow | `intendedPageId = null` (after review submit) | |
| 2 | Clear booking (`localStorage.removeItem('booking')`) | | |
| 3 | Navigate to `/booking` | Redirected to location | `[hard-redirect] HOME with no booking` |

## H4. Back to location, then re-select same track/event

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | From date-and-car, click back to location | On location page | `[back-request]` |
| 2 | Re-select the same track/event | Initializer detects same track, preserves cart | |
| 3 | Verify `intendedPageId` | `"date_and_car"` (set by initializer) | |
| 4 | Verify all downstream page data preserved | Data preserved | |

## H5. Back to location, select DIFFERENT track

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | From date-and-car, click back to location | On location page | `[back-request]` |
| 2 | Select a different track/event | Initializer detects track switch, clears booking | |
| 3 | Verify `intendedPageId` | `"date_and_car"` (set by initializer) | |
| 4 | Verify downstream page data cleared | Data cleared by resetAfter | |

## I. Cart Constraint Scenarios

## I1. Cart becomes empty mid-flow

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Be on `/booking/choose-coverage` with cars in cart | | |
| 2 | Simulate cart clearing (e.g., cart expiry) | Redirected to `/booking/choose-date-and-car` | `[hard-redirect] no cars in cart → date_and_car` |
| 3 | Verify `intendedPageId` | `"date_and_car"` | |

## J. Location Page Blocking

## J1. Cannot back-navigate to location when event/track exist

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Be on `/booking/choose-date-and-car` with track+event set | | |
| 2 | Click "Back" button | Nothing happens — no valid previous page | `[back-request] no valid previous page` |
| 3 | Verify still on date-and-car | Stays on page | |

## J2. Direct URL to location when event/track exist

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Have booking with track+event, `intendedPageId = "coverage_options"` | | |
| 2 | Type `/booking/choose-location` in address bar | Redirected away from location | `[hard-redirect] page blocked by rules` |
| 3 | Verify NOT on location page | On date_and_car or later page | |

## J3. Location IS accessible when event/track are empty

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Clear booking state entirely | | |
| 2 | Navigate to `/booking/choose-location` | Stays on location | `[ready]` or `[canonicalize]` |

## K. hasOnlyRideAlongs Page Skipping

## K1. Coverage and ride-along skipped during forward navigation

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Add only ride-along cars to cart (`hasOnlyRideAlongs = true`) | | |
| 2 | Submit date-and-car page | Skips coverage AND ride-along, lands on media-packages | `[submit] navigating to next page` (nextPageId = media_packages) |
| 3 | Verify `intendedPageId` | `"media_packages"` | |

## K2. Coverage and ride-along skipped during back navigation

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Be on `/booking/media-packages` with `hasOnlyRideAlongs = true` | | |
| 2 | Click "Back" button | Skips ride-along AND coverage, lands on date-and-car | `[back-request] navigating to previous page` (previousPageId = date_and_car) |
| 3 | Verify `intendedPageId` | `"date_and_car"` | |

## K3. Blocked pages not clickable in progress bar

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Be on any page with `hasOnlyRideAlongs = true` | | |
| 2 | Inspect progress bar | "Coverage" and "Ride Along" rendered as spans (not links) | |

## K4. Coverage skipped when insuranceSessions = 0 (mixed cars)

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Add cars where `insuranceSessions = 0` but `hasOnlyRideAlongs = false` | | |
| 2 | Submit date-and-car page | Skips coverage, lands on ride-along | `[submit] navigating to next page` (nextPageId = ride_along) |

## K5. Direct URL to blocked page redirects forward

| Step | Action | Expected | Guard log |
|------|--------|----------|-----------|
| 1 | Have `hasOnlyRideAlongs = true`, `intendedPageId = "media_packages"` | | |
| 2 | Type `/booking/choose-coverage` in address bar | Redirected away | `[hard-redirect] page blocked by rules` |
| 3 | Lands on media-packages (next non-blocked page) | | |

## Automated Validation

After all manual testing:

```bash
./run-task ci-ai
```

Verify:

- No TypeScript errors
- No lint errors
- All existing tests pass
- No circular dependency issues
