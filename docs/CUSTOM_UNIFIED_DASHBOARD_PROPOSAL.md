# Proposal: Unified Custom Admin & Booking Operations Dashboard
**Replacing DatoCMS + RocketRez with an All-in-One Platform Powered by Neon PostgreSQL & Cloudinary**

**Prepared for:** Xtreme Xperience  
**Date:** November 2026  

---

## 1. Executive Summary

Currently, Xtreme Xperience operates its digital storefront and booking flow across **two disconnected third-party platforms**:
1. **DatoCMS** — used for website content, supercar specs, track pages, media assets, and frontend promotional display rules (*Promotion Manager*).
2. **RocketRez** — used for event schedules, time-slot inventory, base pricing, live cart sessions, coupons, gift vouchers, fees, and checkout calculations.

Because DatoCMS and RocketRez do not natively communicate with each other, our engineering team has had to build and maintain a complex middleware synchronization layer, custom metadata stitching, and duplicate promotion engines to make the two systems appear unified to your customers.

While we have engineered fixes for the immediate issues on the current storefront, the underlying dual-platform architecture remains **expensive, fragile to manage for your staff, and prone to synchronization discrepancies**.

We propose replacing both DatoCMS and RocketRez with a **Unified Custom Admin & Booking Operations Dashboard** built specifically for Xtreme Xperience—powered by **Neon Serverless PostgreSQL** (database) and **Cloudinary** (image & video CDN). This consolidates all content, inventory, pricing, promotions, and orders into **one dashboard** while cutting recurring software costs by **~90% (`$20,000–$50,000+` saved per year)**.

---

## 2. Real Problems We Faced with DatoCMS + RocketRez (What We Fixed vs. Why a Unified Dashboard Is Needed)

During development and live testing of the booking wizard (`/booking/choose-date-and-car` through `/booking/review`), we encountered several critical issues caused directly by the split between DatoCMS and RocketRez. Below is a transparent breakdown of **what went wrong**, **how we fixed it in the current codebase**, and **how the Custom Dashboard eliminates the root cause permanently**.

---

### Problem 1: Schedule Cache vs. Live Cart Price Mismatches (e.g., `$419` on Card vs. `$499` in Cart)
* **What Happened:**
  On the *Choose Date & Car* page (e.g., Porsche 911 GT3 at NCM Motorsports Park), the car card and 9:00 AM time slot displayed a base price of `$419` (`$329` after the `$90` morning discount). However, as soon as the customer clicked **Add to Cart**, the Cart Summary on the right displayed a base price of `$499` (`$409` after discount)—an unexpected `$80` price jump.
* **Root Cause:**
  RocketRez's schedule API is too slow and rate-limited to query live on every user click. To keep the site fast, RocketRez schedules must be synced periodically into a database cache table (`rocket_rez_products_events`). When an admin updates prices in RocketRez (from `$419` to `$499`), the cached schedule data remains stale until the next background sync runs, whereas the "Add to Cart" button hits RocketRez's live cart API directly. Additionally, RocketRez returns four overlapping price fields (`price`, `defaultPrice`, `overridePrice`, `dynamicPrice`) that frequently conflict.
* **What We Fixed Currently:**
  We aligned the price precedence logic (`overridePrice -> dynamicPrice -> defaultPrice -> price`) and refreshed the schedule cache so the storefront and cart match.
* **How the Custom Dashboard Eliminates This Forever:**
  With **Neon PostgreSQL**, there is **no third-party API cache**. The time-slot selector and the shopping cart read from the exact same database table in real time (`<10ms`). When your team changes a price from `$419` to `$499` in the custom dashboard, both the card and the cart reflect `$499` instantaneously.

---

### Problem 2: Duplicate Promotion Engines & Badge Discrepancies Across Tabs
* **What Happened:**
  1. **Date Tab vs. Experience Tab Mismatches:** Date tabs at the top of the page showed Supercar Drive badges (`UP TO $90 OFF`) even when the user switched to the **Multi-Car Packages** tab (`20%–30% OFF`), **Ride-Alongs** tab (`$10 OFF`), or **Gift Cards** tab (no Q4 discount).
  2. **Sold-Out Tier Discrepancies:** A Date tab showed `30% OFF` (from *Drive the Fleet*) or `UP TO $90 OFF` (from 9:00–9:30 AM morning slots), but when those specific morning slots or packages sold out, the remaining available cards below only showed `20% OFF` or `UP TO $70 OFF`.
  3. **Hellcat Ride-Along Showing `$0`:** Because DatoCMS stores some currency fields in cents (`9000` = `$90`) while Promotion Manager rules use whole dollars (`90` = `$90`), a flat drive discount or misconfigured rule subtracted `$90+` from an `$89` Dodge Charger Hellcat Ride-Along, resulting in a `$0` price.
  4. **Double Negative (`- $-146`) in Cart Drawer:** RocketRez returned negative discount numbers in some cart responses while our UI also prepended a minus sign.
* **Root Cause:**
  **RocketRez does not expose its promotional rules to the website before checkout.** It only calculates discounts *after* an item is placed into a live RocketRez cart session. Because of this limitation, your team has to build every promotion **twice**: once in RocketRez (for actual checkout math) and a second time in DatoCMS *Promotion Manager* (so the website can calculate badges and strikethrough prices on date tabs, car cards, and time slots).
* **What We Fixed Currently:**
  * We engineered a tab-aware discount resolver (`getScheduleDiscount` & `getDateDiscountRule`) that filters promotions specifically by active tab (**Supercar Drives**, **Multi-Car Packages**, **Ride-Alongs**, and **Gift Cards**).
  * We updated the Multi-Car Packages date badge to automatically pull the highest package discount (`30% OFF`), and forced the Gift Cards date badge to remain blank when no gift card promo exists.
  * We added unit-threshold safeguards (`discountVal >= 500`) and product-scope isolation so Supercar Drive discounts never bleed into Ride-Alongs or produce `$0` prices.
  * We normalized discount display in `CartTotals` to prevent double minus signs (`- $146`).
* **How the Custom Dashboard Eliminates This Forever:**
  In the **Custom Dashboard**, you have **one single Promotion Engine**. You configure a promotion once (e.g., *"Black Friday: $90 off 9:00–9:30 AM Supercar Drives, $70 off 10:00 AM–5:00 PM, 20–30% off Multi-Car Packages, $10 off Ride-Alongs"*). That single database rule automatically computes:
  1. The Date Tab badge (dynamically checking live inventory so sold-out tiers aren't advertised),
  2. The Experience Card badge and "From" price,
  3. The Time Slot strikethrough price, and
  4. The actual Cart & Checkout discount.
  **Zero duplicate entry, and zero chance of DatoCMS and RocketRez disagreeing.**

---

### Problem 3: Pre-Checkout "Estimated Discount" Workarounds vs. Final Review Totals
* **What Happened:**
  During Steps 2–5 of the booking wizard, RocketRez's cart object does not always apply automatic promotional rules until coupon/checkout evaluation. Customers saw full base prices in the right-hand Cart Summary even after selecting a discounted morning time slot.
* **What We Fixed Currently:**
  We built a custom metadata bridge that calculates the expected DatoCMS promotion savings (`referenceValue`, `savings`, `savingsBreakdown`) at the moment a car is added to the cart, attaches it to our local cart metadata state, and renders `"$90 off at checkout / Price after discount"` and `"Estimated subtotal"` across Steps 2–5, before handing off to RocketRez's `discountTotal` on the Review page.
* **How the Custom Dashboard Eliminates This Forever:**
  Because our custom cart engine in **Neon PostgreSQL** uses the exact same promotion tables as the schedule view, the cart calculates the true, final discounted price immediately on Step 2—no "estimated" workarounds required.

---

### Problem 4: Multi-Car Package Decomposition & Virtual Inventory Complexity
* **What Happened:**
  In RocketRez, a Multi-Car Package (such as *Track Attack*, *Italian Legends*, *Podium Package*, *Apex Package*, or *Drive the Fleet*) is not a simple single item with automatic fleet availability. To add a 3-car or 4-car package to RocketRez's cart, the frontend has to:
  1. Inspect virtual rate categories in the schedule payload to discover which individual physical cars make up the package.
  2. Check every constituent car's `seatType.available` count to determine if the package is sold out for that time slot.
  3. Send **multiple separate line items** (one per car in the package, all sharing the same `scheduleId`) to the RocketRez Cart API.
  4. Re-bundle those separate line items on the frontend so the customer sees one package instead of 4 disconnected cars.
* **What We Fixed Currently:**
  We built custom package rate resolution (`getRequiredRateIdsForSupercar`), multi-rate availability checks (`isScheduleSoldOut`), and multi-item metadata bundling during `addToCart`.
* **How the Custom Dashboard Eliminates This Forever:**
  In **Neon PostgreSQL**, a Multi-Car Package is a first-class product directly linked to its constituent supercars via relational tables. Availability is calculated in a single SQL query, and adding a package to the cart creates **one clean package order item** that atomically reserves the underlying cars in the fleet.

---

### Problem 5: Manual ID Mapping & Per-Event Seat-Type Overrides (`rocketRezSeatTypeIdOverrides`)
* **What Happened:**
  In RocketRez, the same supercar (e.g., Ferrari 296 GTB) or add-on (Damage Protection, Pit Pass, Media Package) frequently has **different internal IDs** across different tracks or different event years (2026 vs. 2027). Your staff currently has to manually copy numeric IDs from RocketRez and paste them into DatoCMS—including maintaining per-event override lists (`rocketRezSeatTypeIdOverrides`). If a single ID is mistyped or omitted for a new 2027 event, that car appears "Sold Out" or fails to book.
* **How the Custom Dashboard Eliminates This Forever:**
  Every Supercar, Package, Ride-Along, Track, and Add-On exists **once** in your database with a permanent ID. When you create a new event weekend at Atlanta Motorsports Park or NCM Motorsports Park, you simply check the boxes for which cars are attending. **No manual ID copying or override tables ever again.**

---

### Problem 6: Missing Cart Data, Slow Edit/Remove Actions & Session Workarounds
* **What Happened:**
  RocketRez's Cart API only stores barebones fields (`id`, `productId`, `rateId`, `scheduleId`, `price`, `quantity`). It has no concept of car thumbnails, lap counts (`3 Laps`, `6 Laps`, `9 Laps`), experience titles, track nicknames, or inline editing.
  * To show rich cart items (and allow **Edit** and **Remove** on desktop and the mobile Review Order Summary), we had to build a parallel metadata store (`CartLineItemMetadata`) and use `sessionStorage` (`pendingEditSeatTypeId`, `pendingEditLineItemId`) plus delete-and-re-add API sequences whenever a customer edits their lap count, time slot, or gift card amount.
* **What We Fixed Currently:**
  We added full `Edit` and `Remove` support across the Cart Drawer, Cart Aside, and Mobile Review Order Summary, wired to custom modals (`EditGiftCardModal`) and schedule re-selection flows.
* **How the Custom Dashboard Eliminates This Forever:**
  When carts live in **Neon PostgreSQL**, a cart item is directly joined to the `supercars`, `schedules`, and `tracks` tables. Editing a time slot, upgrading from 3 Laps to 6 Laps, or changing a Gift Card from `$100` to `$500` is a single instant `UPDATE` query (`<50ms`) instead of deleting and recreating items across an external API.

---

### Problem 7: CMS Content Validation & Media Delivery Issues (Blank Announcement Bars & Image 404s)
* **What Happened:**
  * When an editor left an empty card inside the Announcement Bar section in DatoCMS (or toggled it off while an empty block remained), the live site rendered an empty black bar across the top of the header.
  * Static/template images (like the Gift Card preview template) had to be managed separately from DatoCMS assets, leading to 404 errors when deployed across repositories.
* **What We Fixed Currently:**
  We added strict rendering guards in `SectionAnnouncementBar` to ignore disabled configs and filter out cards with blank titles, and ensured static fallback assets are tracked properly.
* **How the Custom Dashboard + Cloudinary Eliminates This Forever:**
  The custom dashboard includes built-in form validation that prevents saving empty announcement cards, and **Cloudinary** hosts every image, gift card template, track map, and video in one centralized CDN with automatic `WebP`/`AVIF` optimization.

---

## 3. Proposed Solution: Unified Custom Dashboard Architecture

By consolidating DatoCMS and RocketRez into **one custom-built Xtreme Xperience Admin & Operations Dashboard**, your team manages the entire business from a single login.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                 XTREME XPERIENCE UNIFIED ADMIN DASHBOARD                  │
│  • Tracks & Events   • Supercars & Packages   • Schedule & Fleet Builder  │
│  • Pricing & Promos  • Orders & Check-In      • Pages, Blogs & Banners    │
└───────────────────┬───────────────────────────────────┬───────────────────┘
                    │                                   │
                    ▼                                   ▼
     ┌──────────────────────────────┐    ┌──────────────────────────────┐
     │  NEON SERVERLESS POSTGRESQL  │    │       CLOUDINARY CDN         │
     │  • Content & SEO Pages       │    │  • Supercar Renders (WebP)   │
     │  • Event Dates & Time Slots  │    │  • Track Maps & Galleries    │
     │  • Real-Time Fleet Inventory │    │  • Hero & Promo Videos       │
     │  • Single Promotion Engine   │    │  • Gift Card Templates       │
     │  • Live Carts, Gift Cards    │    │  • On-the-fly Resizing       │
     │  • Orders & Customer Waivers │    └──────────────┬───────────────┘
     └──────────────┬───────────────┘                   │
                    │                                   │
                    └─────────────────┬─────────────────┘
                                      ▼
                    ┌───────────────────────────────────┐
                    │   NEXT.JS STOREFRONT & CHECKOUT   │
                    │  • Sub-10ms Schedule & Price Load │
                    │  • Instant Cart Add / Edit        │
                    │  • 100% Price & Badge Accuracy    │
                    │  • Direct Stripe / Auth.Net Pay   │
                    └───────────────────────────────────┘
```

### 3.1 Complete Module Breakdown of the Custom Dashboard

| Dashboard Module | Replaces | What Your Team Can Do |
| :--- | :--- | :--- |
| **1. Fleet & Experience Manager** | DatoCMS + RocketRez | Create Supercars, Multi-Car Packages, Ride-Alongs, Coverage tiers, Media Packages, and Pit Passes **once**. Upload images directly to Cloudinary, set specs (`HP`, `0-60`, `Top Speed`), and define package car combinations via a simple checklist. |
| **2. Event & Schedule Generator** | RocketRez | Pick a Track and date range (e.g., *May 21–23, 2027*), choose the attending fleet, and auto-generate all daily time slots (`8:30 AM – 5:30 PM`) with customizable seat capacities in seconds. |
| **3. Unified Pricing & Promotion Engine** | DatoCMS Promo Manager + RocketRez | Set base prices, lap-bundle pricing (`3, 6, 9 Laps`), morning vs. afternoon discounts (`9:00 & 9:30 AM`), seasonal percentage sales (`20%–30% OFF`), and coupon codes in **one place**. Automatically powers all storefront badges, time-slot prices, and final checkout totals. |
| **4. Gift Cards & Vouchers** | DatoCMS + RocketRez | Configure gift card denominations, custom imagery, balance tracking, partial or full redemption codes, and expiration rules natively. |
| **5. Orders, CRM & Track-Day Check-In** | RocketRez | Search customer orders, reschedule time slots or swap cars with 1 click, process partial/full refunds, track signed driver waivers, and export/run live track-day check-in manifests. |
| **6. Website CMS & Marketing Builder** | DatoCMS | Edit homepage hero sections, announcement bars, promotional sticky timers, track landing pages, FAQs, blog articles, and SEO metadata with live preview and strict validation. |

---

## 4. Why Neon PostgreSQL & Cloudinary Are the Ideal Stack

### 4.1 Neon Serverless PostgreSQL (Database)
* **Real-Time Single Source of Truth:** Eliminates the sync delay between schedules and carts. Every price, discount, and spot-available badge on the site is 100% live.
* **ACID Transactions & Row-Level Inventory Locking:** When a customer reserves the last spot for a Porsche 911 GT3 at 9:00 AM—whether via a single drive or inside a 3-car package—PostgreSQL atomically locks and decrements that inventory so overbooking is mathematically impossible.
* **Serverless Auto-Scaling:** Automatically scales CPU and RAM up during high-traffic campaigns (Black Friday, Cyber Monday, Father's Day) and scales down during off-hours so you only pay for what you use.
* **Instant Database Branching & Point-in-Time Recovery:** Allows developers to test new features on an isolated copy of production data in seconds and provides continuous backup recovery to any second in the past 30 days.

### 4.2 Cloudinary (Images & Videos)
* **Automatic Format & Quality Optimization:** Automatically serves `AVIF` and `WebP` images and adaptive bitrate video (`HLS`/`MP4`) tailored to each visitor's device (iPhone, Android, Retina Desktop).
* **Dramatically Faster Page Loads:** Reduces image payload sizes by **60%–80%**, directly improving Core Web Vitals, SEO rankings, and mobile conversion rates.
* **Built-In Media Widget:** Your marketing team gets a drag-and-drop media library right inside the custom dashboard—crop, resize, tag, and replace supercar renders or videos without needing developer deployments.

---

## 5. Detailed Cost & Pricing Comparison

Moving to a custom dashboard backed by Neon PostgreSQL and Cloudinary transforms your software expenditure from **high fixed enterprise SaaS contracts** into **lean, utility-priced cloud infrastructure**.

### 5.1 Monthly & Annual Recurring Cost Comparison

| Cost Category | Current Dual-Platform Setup (DatoCMS + RocketRez) | Proposed Unified Stack (Neon + Cloudinary) | Annual Savings |
| :--- | :--- | :--- | :--- |
| **Content Management System (CMS)** | **DatoCMS Professional / Enterprise**<br>`$250 – $650+ / month`<br>*(Charges extra for record limits, roles, locales, GraphQL API traffic & bandwidth overages)* | **Built into Custom Dashboard**<br>`$0 / month`<br>*(Unlimited admin users, unlimited content records, zero API overage fees)* | **`$3,000 – $7,800+ / yr`** |
| **Booking, Ticketing & Inventory Engine** | **RocketRez Platform & Licensing**<br>`$1,500 – $3,500+ / month`<br>*(Plus potential per-ticket / revenue-share fees on bookings)* | **Built into Custom Dashboard**<br>`$0 / month`<br>*(100% owned by Xtreme Xperience; zero per-ticket middleman fees)* | **`$18,000 – $42,000+ / yr`** |
| **Database Infrastructure** | **Existing Postgres Cache DB**<br>`$25 – $60 / month`<br>*(Currently used just to cache RocketRez JSON payloads)* | **Neon Serverless PostgreSQL (Scale Plan)**<br>`$19 – $69 / month`<br>*(Powers the entire CMS, schedule inventory, carts, and orders)* | **`~$0` (Replaces cache DB)** |
| **Image & Video CDN / Hosting** | **DatoCMS Asset Bandwidth Overages**<br>`$50 – $150 / month` | **Cloudinary Plus Plan**<br>`$89 / month`<br>*(Includes global CDN, video streaming & auto WebP/AVIF transformations)* | **`$0 – $700+ / yr`** |
| **Total Monthly Recurring Cost** | **`$1,825 – $4,360+ / month`** | **`$108 – $158 / month`** | — |
| **Total Annual Recurring Cost** | **`$21,900 – $52,320+ / year`** | **`$1,296 – $1,896 / year`** | **`$20,600 – $50,400+ / yr`** |

> **Bottom-Line Financial Impact:**
> * **~90% Reduction in Recurring Software Costs:** You drop from spending **`$22k–$52k+ per year`** on third-party platform fees to under **`$1,900 per year`** in raw cloud infrastructure.
> * **100% Ownership & Zero Vendor Lock-In:** You own your booking engine, customer data, and intellectual property outright—no annual license hikes or per-ticket platform surcharges.
> * **Massive Staff Time Savings:** Eliminates hours of weekly manual ID mapping, override maintenance, and double promotion setup across two systems.

---

## 6. Head-to-Head Operational Comparison

| Workflow / Capability | Current (DatoCMS + RocketRez) | Proposed Custom Dashboard (Neon + Cloudinary) |
| :--- | :--- | :--- |
| **Admin Portals to Learn & Maintain** | 2 separate platforms with different UIs | **1 unified dashboard built for Xtreme Xperience** |
| **Setting Up a New Event Weekend** | Build in RocketRez → copy IDs → create event in DatoCMS → map seat-type ID overrides | **Select track & dates → check attending cars → click Generate Schedules (under 2 minutes)** |
| **Creating a Promotion / Sale** | Configure checkout rule in RocketRez **AND** recreate display rule in DatoCMS Promotion Manager | **Create promotion once → automatically applies to Date Tabs, Car Cards, Time Slots & Checkout** |
| **Price Consistency (Card vs. Cart)** | Vulnerable to cache lag (`$419` cached vs. `$499` live cart) | **100% identical at all times (single database source)** |
| **Date Badge Accuracy When Slots Sell Out** | Requires complex frontend filtering of cached JSON payloads | **Instant SQL query reflects exact live discounts for remaining available slots** |
| **Multi-Car Package Booking** | Decomposed into 3–7 separate RocketRez rate line items and stitched back together in UI | **Native package product with automatic atomic fleet inventory deduction** |
| **Editing a Cart Item (Time / Laps / Gift Card)** | Must delete line item from RocketRez API and re-add new line item + re-sync metadata | **Instant in-place database update (`<50ms`)** |
| **Cart & Checkout Speed** | `1–3 seconds` per action waiting on external RocketRez API round-trips | **Instant (`<100ms`) direct Neon PostgreSQL queries** |
| **Image & Video Delivery** | Split across DatoCMS and static repo files | **Centralized in Cloudinary CDN with automatic WebP/AVIF & video optimization** |

---

## 7. Phased Migration Plan (Zero Downtime for Live Sales)

We will execute the transition in four safe, incremental phases so your live storefront continues taking bookings without a single minute of downtime:

### Phase 1: Foundation — Neon PostgreSQL Schema & Cloudinary Media Migration
* Provision **Neon PostgreSQL** and **Cloudinary** environments.
* Run an automated migration script to import all existing DatoCMS tracks, supercars, packages, landing pages, blog posts, and media assets into Neon and Cloudinary.
* Set up automated backups and role-based admin authentication.

### Phase 2: Content & Fleet Admin Dashboard
* Launch the custom admin dashboard for managing website content, announcement bars, tracks, supercars, multi-car packages, and Cloudinary media.
* Switch the Next.js frontend's content queries from DatoCMS GraphQL to Neon PostgreSQL (allowing you to retire **DatoCMS** first and immediately stop paying DatoCMS fees).

### Phase 3: Unified Schedule Builder, Promotion Engine & Native Cart/Checkout
* Enable the Event & Schedule Generator, Single-Source Promotion Engine, Gift Card Manager, and Native Cart in the custom dashboard.
* Connect direct payment processing (Stripe / Authorize.Net) so checkout payments go straight to your merchant account.
* Migrate active gift cards, vouchers, and upcoming event reservations from RocketRez into Neon PostgreSQL.

### Phase 4: Final Cutover & RocketRez Retirement
* Switch the booking wizard (`/booking/*` and `/checkout/*`) to run 100% on the new Neon PostgreSQL backend.
* Decommission RocketRez and realize the full **`$20,000–$50,000+/year`** cost savings.

---

## 8. Next Steps

Upon approval of this proposal, we will:
1. Finalize the database schema and admin dashboard wireframes tailored to your operations team's daily workflow.
2. Begin **Phase 1 & Phase 2** (DatoCMS → Neon PostgreSQL + Cloudinary migration) so your team can immediately experience the unified dashboard without disrupting active bookings.
