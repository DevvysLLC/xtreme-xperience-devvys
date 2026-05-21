# Codebase Overview

## Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** SCSS Modules
- **State:** Zustand + React Query
- **CMS:** DatoCMS (GraphQL)
- **Search:** Typesense
- **Payments:** RocketRez
- **Email:** Sendlane
- **Forms:** HubSpot / Zendesk
- **Geocoding:** Mapbox

## Stats

| Metric | Count |
|--------|-------|
| Lines of code | ~96,500 |
| Core components | 40 |
| Section components | 30 |
| Template components | 9 |
| Hooks | 76 |
| Utility functions | 38 |
| API routes | 24 |
| Server services | 14 |

### Lines of Code by Type

| File Type | LOC |
|-----------|-----|
| .tsx | 29,488 |
| .ts | 25,467 |
| .json | 15,188 |
| .scss | 14,914 |
| .graphql | 11,486 |

## Directory Structure

```
src/
  app/                    # Next.js App Router pages and layouts
    (booking)/            # Booking wizard route group
    (checkout)/           # Checkout route group
    (frontend)/           # Public-facing pages
    (styleguide)/         # Styleguide pages
    api/v1/               # API routes
  components/             # React components
    core-*/               # Reusable UI primitives (40)
    section-*/            # CMS-driven page sections (30)
    template-*/           # Page templates (9)
    booking-*/            # Booking-specific components
    global-*/             # Global layout components
  hooks/                  # React hooks organized by domain
  core/                   # Core utilities (logger, DatoCMS, messaging)
  server/                 # Server-side services and clients
  store/                  # Zustand stores (booking, cart, location, checkout)
  config/                 # App configuration (routes, etc.)
  utils/                  # Shared utility functions
  io/                     # Shared types and schemas
  i18n/                   # Internationalization setup
  locales/                # Translation files
```

## Components

### Core Components (40)

Reusable UI primitives used across the application.

| Component | Purpose |
|-----------|---------|
| core-accordion | Expandable/collapsible panels |
| core-add-to-cart-form | Cart add form |
| core-addons-card | Addon product card |
| core-announcement | Announcement banner |
| core-badge | Label badge |
| core-brand | Brand logo/identity |
| core-countdown | Countdown timer |
| core-cta | Call-to-action button/link |
| core-date | Date range display |
| core-event-card | Event card |
| core-flag-background | Flag pattern background |
| core-form | Form wrapper |
| core-form-field | Form input field |
| core-form-field-option | Form select/radio option |
| core-gradient | CSS gradient overlay |
| core-highlight | Highlight card |
| core-hubspot-form | HubSpot embedded form |
| core-icon | SVG icon |
| core-image | Responsive image (DatoCMS) |
| core-loading-guard | Full-page loading overlay |
| core-loading-spinner | Spinner animation |
| core-lottie | Lottie animation |
| core-map | Mapbox map |
| core-marquee | Scrolling text marquee |
| core-media-card | Media content card |
| core-newsletter-signup-form | Newsletter signup |
| core-pagination | Page pagination |
| core-price | Price display |
| core-rating | Star rating |
| core-reviews-card | Review/testimonial card |
| core-rocketrez-price | RocketRez price display |
| core-social-card | Social media card |
| core-structured-text | DatoCMS structured text |
| core-supercar-card | Supercar product card |
| core-svg-upload | Uploaded SVG renderer |
| core-swiper-controls | Carousel controls |
| core-text-markdown | Markdown text renderer |
| core-usp | Unique selling point |
| core-video | Video player |
| core-video-controls | Video playback controls |

### Section Components (30)

CMS-driven page sections rendered by `section-renderer`.

| Component | Purpose |
|-----------|---------|
| section-accordion | FAQ/accordion section |
| section-addons-grid | Add-ons product grid |
| section-announcement-bar | Announcement bar |
| section-contact | Contact information |
| section-event-finder | Event search/filter |
| section-events-feature | Featured events |
| section-faq | FAQ section |
| section-headline | Text headline |
| section-hero | Hero banner |
| section-highlight | Highlight callout |
| section-media-card-grid | Media card grid |
| section-media-gallery | Media gallery |
| section-media-hero | Media hero banner |
| section-policy | Policy content |
| section-press-brand-grid | Press/brand logos |
| section-renderer | Section orchestrator |
| section-review | Customer reviews |
| section-social-grid | Social media grid |
| section-split-callout | Split layout callout |
| section-split-callout-collage | Split callout with collage |
| section-supercar-brand-grid | Supercar brand grid |
| section-supercar-brand-hero | Supercar brand hero |
| section-supercar-fleet-grid | Supercar fleet grid |
| section-supercar-hero | Supercar hero banner |
| section-supercar-showcase | Supercar showcase |
| section-supercar-spec | Supercar specifications |
| section-track-hero | Track hero banner |
| section-track-map-callout | Track map callout |
| section-track-spec | Track specifications/events |
| section-usp | USP section |

### Template Components (9)

Page-level templates that compose sections.

| Component | Purpose |
|-----------|---------|
| template-blog-detail-page | Blog post page |
| template-blog-listing-page | Blog listing page |
| template-homepage | Homepage |
| template-landing-page | Landing page |
| template-page | Generic CMS page |
| template-styleguide | Styleguide page |
| template-supercar-detail-page | Supercar detail page |
| template-supercar-listing-page | Supercar listing page |
| template-track-detail-page | Track detail page |

## Hooks

### use-booking (24 hooks)

Manages the multi-step booking wizard state.

| Hook | Purpose |
|------|---------|
| use-booking | Read booking state from store |
| use-booking-with-cart | Combined booking + cart state |
| use-booking-config | Fetch booking configuration |
| use-booking-event | Fetch event schedules |
| use-booking-track | Fetch track by handle |
| use-booking-set-event | Set selected event |
| use-booking-set-track | Set selected track |
| use-booking-set-current-page | Track current wizard page |
| use-booking-clear | Clear all booking state |
| use-booking-clear-page | Clear a specific page's state |
| use-booking-clear-field-errors | Clear validation errors |
| use-booking-reset-after | Reset pages after a given step |
| use-booking-page-validator | Validate page state on cart changes |
| use-booking-page-location | Location page logic |
| use-booking-page-choose-date-and-car | Date/car page logic |
| use-booking-page-coverage-options | Coverage page logic |
| use-booking-page-ride-along | Ride-along page logic |
| use-booking-page-media-packages | Media packages page logic |
| use-booking-page-review | Review page logic |
| use-booking-page-metadata | Page metadata |
| use-booking-supercar | Fetch supercar data |
| use-booking-supercar-metadata | Supercar metadata |
| use-booking-supercar-schedule | Supercar schedule/availability |
| use-booking-supercar-rate | Supercar pricing |

### use-cart (20 hooks)

Cart operations against the RocketRez API.

| Hook | Purpose |
|------|---------|
| use-cart | Read cart state |
| use-cart-add | Add line item |
| use-cart-add-event | Add event to cart |
| use-cart-add-addon | Add addon to cart |
| use-cart-add-insurance | Add insurance |
| use-cart-replace-insurance | Replace insurance |
| use-cart-remove-line-item | Remove single item |
| use-cart-remove-all | Remove all items |
| use-cart-update-line-item | Update item quantity |
| use-cart-complete | Complete/finalize cart |
| use-cart-refresh | Refresh cart data |
| use-cart-mutation | Shared mutation helper |
| use-cart-line-item-metadata | Read line item metadata |
| use-cart-contact-add | Add contact to cart |
| use-cart-contact-remove | Remove contact |
| use-cart-contact-update | Update contact |
| use-cart-coupon-add | Apply coupon |
| use-cart-coupon-remove | Remove coupon |
| use-toggle-cart | Toggle cart drawer |
| use-set-cart-open | Set cart drawer open/closed |

### use-checkout (7 hooks)

Payment and checkout flow.

| Hook | Purpose |
|------|---------|
| use-checkout | Read checkout state |
| use-checkout-with-cart | Combined checkout + cart |
| use-checkout-clear | Clear checkout state |
| use-checkout-payment | Process payment |
| use-checkout-gateway-client-secret | Fetch payment gateway secret |
| use-checkout-page-details | Contact details page logic |
| use-checkout-page-payment | Payment page logic |

### use-tracks (6 hooks)

Track listing, filtering, and sorting.

| Hook | Purpose |
|------|---------|
| use-tracks | Fetch all tracks |
| use-tracks-filtered | Filter tracks by criteria |
| use-tracks-sorted-by-distance | Sort by user distance |
| use-tracks-states | Get unique track states |
| use-track-events | Fetch events for a track |
| use-track-next-event | Get next upcoming event |

### use-location (6 hooks)

User location and home track.

| Hook | Purpose |
|------|---------|
| use-location | Read location state |
| use-location-update | Update location |
| use-location-set-track | Set home track |
| use-location-clear | Clear location |
| use-location-browser | Browser geolocation |
| use-location-get-browser-location | Get browser coordinates |

### use-analytics (3 hooks)

| Hook | Purpose |
|------|---------|
| use-analytics-ga4-event | Fire GA4 events |
| use-analytics-fbpixel-event | Fire Facebook Pixel events |
| use-analytics-ecommerce-event | Fire ecommerce events |

### use-user (2 hooks)

| Hook | Purpose |
|------|---------|
| use-user | Read user state |
| use-user-guid | Get/generate user GUID |

### Utility Hooks

| Hook | Purpose |
|------|---------|
| use-order | Fetch order by ID |
| use-toast | Show toast notifications |
| use-dialog | Show confirmation dialogs |
| use-newsletter | Newsletter signup |
| use-mapbox-geocode | Geocode addresses |
| use-scroll-to-bottom | Scroll to page bottom |
| use-route-change | Listen for route changes |
| use-utils-debounced-value | Debounce a value |

## Utility Functions (38)

Shared helpers in `src/utils/`.

### Booking & Cart

| Utility | Purpose |
|---------|---------|
| get-booking-link-params | Build booking URL query params |
| get-booking-event-link | Build legacy/modern booking links |
| get-booking-page-metadata | Get metadata for a booking page |
| get-booking-supercar-metadata | Get supercar metadata for booking |
| get-add-to-cart-line-item-car-metadata | Build car line item metadata |
| get-add-to-cart-line-item-addon-metadata | Build addon line item metadata |
| get-add-to-cart-line-item-insurance-metadata | Build insurance line item metadata |
| get-ride-along-cart-metadata | Build ride-along metadata |
| get-cart-line-item-metadata-key | Generate metadata key for line item |
| get-cart-expiry | Calculate cart expiration time |
| filter-cart-metadata-by-key | Filter metadata entries by key |
| remove-cart-line-item-metadata | Remove metadata from line item |
| cart-key | Parse/serialize cart key (cartId + cartToken) |

### Events & Scheduling

| Utility | Purpose |
|---------|---------|
| get-event-data-fragment | Convert event model to EventDataFragment |
| get-dato-event-dates | Extract dates from DatoCMS events |
| find-event-schedules-for-rate-id | Find schedules matching a rate |
| find-matching-earliest-event-schedule-for-rate-id | Find earliest matching schedule |
| find-track-for-event | Find parent track for an event |
| is-schedule-sold-out | Check if schedule has availability |
| find-booking-supercar-by-seat-type-id | Find supercar by seat type |
| sort-supercars-by-availability | Sort supercars by availability |

### Formatting & Display

| Utility | Purpose |
|---------|---------|
| format-money | Format currency values |
| date-time | Date/time formatting helpers |
| get-rate-type-price | Get display price for rate type |
| get-srcset | Build responsive image srcset |
| get-dpr-from-width | Calculate DPR from image width |
| get-hero-lcp-image | Get LCP image for hero sections |

### Routing & URLs

| Utility | Purpose |
|---------|---------|
| get-href | Resolve href from DatoCMS link records |
| get-record-link | Build link for a CMS record |
| get-request-path | Extract path from request object |
| parse-query-params | Parse URL query parameters |
| search-params | Search param helpers |

### Forms & CMS

| Utility | Purpose |
|---------|---------|
| get-form-value | Extract form values |
| get-section-config-classes | Build CSS classes from section config |
| seo | SEO metadata helpers |

### Server / Auth

| Utility | Purpose |
|---------|---------|
| api-utils | Shared API response helpers |
| tools-auth | Tools auth validation |
| user-guid-cookie | User GUID cookie management |

## API Routes

### Cart (12 routes)

| Route | Purpose |
|-------|---------|
| `GET /api/v1/cart` | Get cart |
| `POST /api/v1/cart/add` | Add item |
| `POST /api/v1/cart/remove` | Remove item |
| `POST /api/v1/cart/update` | Update item |
| `POST /api/v1/cart/clear` | Clear cart |
| `POST /api/v1/cart/complete` | Complete order |
| `POST /api/v1/cart/payment` | Process payment |
| `POST /api/v1/cart/contact/add` | Add contact |
| `POST /api/v1/cart/contact/remove` | Remove contact |
| `POST /api/v1/cart/contact/update` | Update contact |
| `POST /api/v1/cart/coupon/add` | Apply coupon |
| `POST /api/v1/cart/coupon/remove` | Remove coupon |

### Booking (4 routes)

| Route | Purpose |
|-------|---------|
| `GET /api/v1/booking/config` | Booking configuration |
| `GET /api/v1/booking/events` | List events |
| `GET /api/v1/booking/events/[id]` | Event by ID |
| `GET /api/v1/booking/order/[id]` | Order by ID |

### Frontend (5 routes)

| Route | Purpose |
|-------|---------|
| `GET /api/v1/frontend/tracks` | List tracks |
| `GET /api/v1/frontend/tracks/[handle]` | Track by handle |
| `GET /api/v1/frontend/search` | Search |
| `POST /api/v1/frontend/newsletter` | Newsletter signup |
| `POST /api/v1/frontend/form` | Form submission |

### Tools (2 routes)

| Route | Purpose |
|-------|---------|
| `POST /api/v1/tools/login` | Login |
| `GET /api/v1/tools/search` | Search |

### Typesense (1 route)

| Route | Purpose |
|-------|---------|
| `GET /api/v1/typesense/health-check` | Health check |

## Server Services

### RocketRez

| Service | Purpose |
|---------|---------|
| auth-service | OAuth token management |
| cart-service | Cart operations |
| products-service | Product data |
| products-cache | Product caching |
| events-cache | Event schedule caching |

### Middleware

| Service | Purpose |
|---------|---------|
| cart-service | Cart orchestration layer |
| events-service | Event data processing |
| booking-config-service | Booking config from DatoCMS |
| order-service | Order management |
| tools-service | Internal tools |

### Typesense

| Service | Purpose |
|---------|---------|
| typesense-service | Index management |
| search-service | Search queries |

### Sendlane

| Service | Purpose |
|---------|---------|
| contact-service | Newsletter/contact management |

### HubSpot

| Service | Purpose |
|---------|---------|
| form-service | Form submissions |

### Forms (Abstraction Layer)

| Service | Purpose |
|---------|---------|
| get-form-provider | Provider factory |
| hubspot-provider | HubSpot form handler |
| zendesk-provider | Zendesk form handler |

### Scripts

| Script | Purpose |
|--------|---------|
| sync-events-cache | Sync event schedules |
| sync-products-cache | Sync product data |
| sync-tracks | Sync tracks to Typesense |
| sync-supercars | Sync supercars to Typesense |
| sync-pages | Sync pages to Typesense |

## Key Architectural Patterns

### State Management

- **Zustand stores** for persistent client state (booking, cart, location, checkout)
- **React Query** for server state, caching, and reactive invalidation
- Stores persist to **localStorage** and sync across tabs
- Mutations go through React Query `useMutation` hooks that update Zustand stores

### Booking Initialization from URL

When a user navigates to `/booking?track=<handle>&event=<id>&setHomeTrack=true`:

1. **Server Component** (`/booking/page.tsx`) fetches track data from DatoCMS
2. Server validates track/event exist, redirects to location page if invalid
3. **BookingInitializer** (client component) receives validated data as props
4. Sets booking state, optionally sets home track, navigates to date/car page

### Component Architecture

- **Pages** are thin — import a component and render it
- **BookingWizardGuard** handles routing protection, current page tracking, and redirect logic
- **BookingWizardProvider** (React Context) shares wizard state across pages
- **section-renderer** maps CMS section types to section components
