# Xtreme Xperience — Promotions Manager & Pricing Merchandising Guide

A comprehensive, client-friendly guide to creating and managing promotional campaigns, time-based sales, product-specific discounts (supercars, multi-car packages, add-ons, and gift cards), custom badge colors, and strikethrough pricing across the Xtreme Xperience booking platform.

---

## Table of Contents
1. [Overview & Core Concepts](#1-overview--core-concepts)
2. [Promotions Manager Architecture](#2-promotions-manager-architecture)
3. [Step-by-Step: How to Create a New Promotion](#3-step-by-step-how-to-create-a-new-promotion)
4. [Campaign-Level Settings (Promotions Manager)](#4-campaign-level-settings-promotions-manager)
5. [Discount Rule Settings (Field-by-Field Breakdown)](#5-discount-rule-settings-field-by-field-breakdown)
6. [Where Customers See the Promotion on the Website](#6-where-customers-see-the-promotion-on-the-website)
7. [Real-World Scenarios & Promotion Recipes](#7-real-world-scenarios--promotion-recipes)
8. [Best Practices & Troubleshooting Checklist](#8-best-practices--troubleshooting-checklist)

---

## 1. Overview & Core Concepts

The **Promotions Manager** gives marketing and sales teams full, real-time control over commercial promotions, seasonal deals, early-bird specials, specific product offers, and custom campaign badge colors without touching the platform codebase.

```
┌────────────────────────────────────────────────┐        ┌──────────────────────────────────┐
│              DatoCMS (Content Layer)           │        │      RocketRez (Engine Layer)    │
│             🏷️ Promotions Manager              │        │                                  │
├────────────────────────────────────────────────┤        ├──────────────────────────────────┤
│ • Campaign date windows (Start / End Date)     │        │ • Live ticket & slot inventory   │
│ • Separate Date Tab & Card badge color pickers │        │ • Real-time slot availability    │
│ • Promotional badges ("UP TO $120 OFF", etc.)  │        │ • Auto-applied checkout rules    │
│ • Specific Supercars, Packages, Add-ons & Gifts│        │ • Transactional cart charges     │
│ • Day & Time filters (Mon–Thu, Morning, etc.)  │        │ • Merchant checkout & payments   │
│ • Excluded tracks (e.g. COTA, Sonoma)          │        │                                  │
└───────────────────────┬────────────────────────┘        └────────────────┬─────────────────┘
                        │                                                  │
                        └────────────────────────┬─────────────────────────┘
                                                 ▼
                                ┌────────────────────────────────────┐
                                │      Customer Booking Website      │
                                ├────────────────────────────────────┤
                                │ • Top badges on calendar day tabs  │
                                │ • Badges & savings on product cards│
                                │ • Estimated discount in Cart Aside │
                                │ • Live RocketRez discount on Review│
                                └────────────────────────────────────┘
```

### The Merchandising Layer Principle
- **RocketRez** is the transactional source of truth for inventory, slot capacity, base charges, and auto-applied checkout discounts.
- **DatoCMS Promotions Manager** is the **Visual Merchandising & Presentation Layer**. Ensure your DatoCMS discount rules mirror the active auto-discount rules configured in RocketRez so customers see accurate pre-checkout savings across:
  - Promotional badge pills on top day/date tabs and experience/add-on/gift card cards (with independent background and text color controls).
  - Strikethrough compare-at original rates (`~~$549~~ $449`).
  - Estimated discounted prices and estimated subtotals in the booking wizard Cart Summary before reaching `/booking/review`.

---

## 2. Promotions Manager Architecture

| Feature | 🏷️ Promotions Manager (`promotion`) |
| :--- | :--- |
| **Location in DatoCMS** | Left Sidebar > **Promotions Manager** |
| **Purpose** | Dynamic campaigns (e.g., "Black Friday Sale", "Weekend Morning Sale", "Full Throttle Add-on Promo") |
| **Scheduling** | Individual **Start Date** & **End Date** per campaign with automatic activation and expiration |
| **Granular Targeting** | Target **Supercars**, **Multi-Car Packages**, **Ride-Alongs**, **Add-ons**, or **Gift Cards** — globally or down to individual items |
| **4-Color Badge System** | Independent background & text colors for **Top Date Tab Badges** (default neon green `#C6FF00` / black `#000000`) and **Card Badges** (default red `#D32F2F` / white `#FFFFFF`) |
| **Rule Order Priority** | Rules are evaluated top-to-bottom; place more specific rules (e.g., a single package or morning window) above broader fallback rules |

---

## 3. Step-by-Step: How to Create a New Promotion

1. **Log in** to your DatoCMS dashboard.
2. In the left navigation panel, click **Promotions Manager**.
3. In the top-right corner, click **+ New record**.
4. Fill in the **Campaign-Level Settings** (Name, Active toggle, optional Start/End Dates, and optional Campaign Badge Colors).
5. In the **Discount Rules** section, click **+ New Booking - Discount Rule** to define exact pricing, product targeting, days/times, and badge labels.
6. In the top-right corner, click **Save**, and then click **Publish**.
   > ⚠️ **Important**: A record saved as *Draft* will **not** appear on the live site. Always ensure the status shows **● Published**.

---

## 4. Campaign-Level Settings (Promotions Manager)

When you open a record in **Promotions Manager**, you can configure campaign-wide settings and default badge colors:

| Field Name | Type | Required? | What It Does | Example / Default |
| :--- | :--- | :--- | :--- | :--- |
| **Name** | Single-line text | Yes | Internal name of the marketing campaign for your team. | `Black Friday Sale` |
| **Active** | Boolean Toggle | Yes | Master switch. If switched OFF, the entire campaign and all its rules are instantly disabled on the live site. | `Enabled (Active)` |
| **Start Date** | Date / DateTime | No | Date/time when this promotion begins. Leave empty to start immediately upon publishing. | `2026-11-20T00:00:00Z` |
| **End Date** | Date / DateTime | No | Date/time when this promotion expires. Date-only values stay active through `23:59:59 UTC` of that day. | `2026-11-30T23:59:59Z` |
| **Headline** | Single-line text | No | Optional promotional headline for campaign reference. | `"Black Friday Track Deals"` |
| **Campaign Date Tab Badge Background Color** | Color Picker | No | Campaign-wide default background color for top day/date tab badges (unless overridden on a rule). | Default: `#C6FF00` (Neon Green) |
| **Campaign Date Tab Badge Text Color** | Color Picker | No | Campaign-wide default text color for top day/date tab badges (unless overridden on a rule). | Default: `#000000` (Black) |
| **Campaign Card Badge Background Color** | Color Picker | No | Campaign-wide default background color for experience, package, add-on, and gift card badges (unless overridden on a rule). | Default: `#D32F2F` (Red) |
| **Campaign Card Badge Text Color** | Color Picker | No | Campaign-wide default text color for experience, package, add-on, and gift card badges (unless overridden on a rule). | Default: `#FFFFFF` (White) |
| **Discount Rules** | Modular Blocks | Yes | Ordered list of **Booking - Discount Rule** blocks evaluated top-to-bottom. | *(See Section 5)* |

---

## 5. Discount Rule Settings (Field-by-Field Breakdown)

Inside each promotion, click **+ New Booking - Discount Rule**. Each rule provides fine-grained targeting, scheduling, pricing, and badge styling controls:

---

### A. Identification & Product Targeting

#### 1. Rule Name (`title`)
- **What it is**: An internal descriptive name for this specific rule.
- **Example**: `Packages – Full Fleet 30% off` or `Add-ons – Full Throttle Gift Package 20% off`

#### 2. Target Product Type (`target_type`)
Controls which category of products this rule applies to:
- **`All Products` (`all`)**: Applies across eligible product categories (unless restricted by specific item pickers below).
- **`Supercars` (`supercars`)**: Applies strictly to single-car supercar driving experiences (excludes multi-car packages, ride-alongs, add-ons, and gift cards).
- **`Multi-Car Packages` (`packages`)**: Applies strictly to multi-car package experiences (e.g., *Drive The Fleet*, *Apex Package*, *Podium Package*).
- **`Ride-Along` (`ride_along`)**: Applies strictly to passenger ride-along sessions (e.g., *Charger Hellcat Ride-Along*).
- **`Add-ons` (`addons`)**: Applies strictly to add-on products (e.g., *Full Throttle Gift Package*, *Unlimited Photo & Video*, *Video Package*, *Photo Package*, *Pit Pass*). Does not discount gift card denominations.
- **`Gift Cards` (`gift_cards`)**: Applies strictly to gift card products (e.g., *$100 Gift Card* through *$3,000 Gift Card*). Does not discount retail/media add-ons.

#### 3. Specific Product Pickers (Optional Granular Targeting)
Just like targeting specific cars, you can leave a picker **empty** to apply to **all** items in that category, or select one or more specific items:

- **Target Supercars (`supercars`)**:
  - *Leave empty*: Applies to all supercars.
  - *Select specific cars*: Only selected supercars (e.g., *Ferrari 296 GTB*, *Lamborghini Temerario*) receive the discount.
- **Target Packages (`packages`)**:
  - *Leave empty*: Applies to all multi-car packages.
  - *Select specific packages*: Only selected packages (e.g., *Drive The Fleet* at 30% off in Rule 1, while *Apex*, *Podium*, *Italian Legends*, *Porsche*, and *Track Attack* get 20% off in Rule 2) receive that rule's discount and badge.
- **Target Add-ons (`addons`)**:
  - *Leave empty*: Applies to all add-ons (when *Target Product Type* is `Add-ons`).
  - *Select specific add-ons*: Only the chosen add-ons (for example, **`Full Throttle Gift Package`** only) receive the discount, strikethrough price, and card badge. Other add-ons remain at regular price.
- **Target Gift Cards (`gift_cards`)**:
  - *Leave empty*: Applies to all gift card denominations (when *Target Product Type* is `Gift Cards`).
  - *Select specific gift cards*: Only the chosen gift card products (for example, **`$500 Gift Card`** and **`$1000 Gift Card`**) receive the discount and promo badge in the Gift Card Shop and add-on grids.

---

### B. Calendar Days & Schedule Filtering

*(Used for scheduled track experiences: Supercars, Multi-Car Packages, and Ride-Alongs)*

#### 4. Days of the Week (`days_of_week`)
- **`All Days` (`all`)**: Active Monday through Sunday.
- **`Weekdays` (`weekdays`)**: Monday through Friday.
- **`Monday – Thursday` (`monday_thursday`)**: Monday, Tuesday, Wednesday, and Thursday only.
- **`Weekends` (`weekends`)**: Saturday and Sunday only.
- **`Friday` (`friday`) / `Saturday` (`saturday`) / `Sunday` (`sunday`)**: Single specific day of the week.

#### 5. Time Window (`time_window`)
- **`All Day` (`all_day`)**: Applies to all session times from open to close.
- **`Morning` (`morning`)**: Targets early sessions (`08:00` – `10:00`).
- **`Afternoon` (`afternoon`)**: Targets midday/afternoon sessions (`10:00` – `17:30`).
- **`Custom Window` (`custom`)**: Uses **Custom Start Time** and **Custom End Time** below.

#### 6. Custom Start Time & Custom End Time (`start_time` / `end_time`)
- **When used**: Only when **Time Window** is set to `Custom Window`.
- **Format**: 24-hour clock `HH:MM` (e.g., `09:00` to `09:30` for 9:00 AM & 9:30 AM starts).

---

### C. Pricing & 4-Field Badge Styling

#### 7. Discount Type (`discount_type`) & Discount Value (`discount_value`)
- **`Percentage (%)` (`percentage`)**: Enter percentage points (e.g., `20` for 20% off, `30` for 30% off).
- **`Fixed Amount ($)` (`fixed_amount`)**: Enter fixed amount in cents per the DatoCMS field hint (e.g., `12000` for `$120.00` off, `5000` for `$50.00` off). *(Whole-dollar inputs under `100` on add-ons or under `1000` on supercars/gift cards are also normalized safely.)*

#### 8. Compare-at Reference Price Override (`compare_at_override`)
- **What it is**: Optional custom strikethrough reference price.
- **Leave Empty**: Automatically uses the product's standard base price (or existing DatoCMS compare-at price if higher) as the crossed-out price.

#### 9. Badge Label (`badge_label`)
- **What it is**: Text displayed inside the promotional badge pill for items/dates matching this rule (e.g., `"UP TO $120 OFF"`, `"30% OFF"`, `"20% OFF"`).
- **Leave Empty**: No promotional badge pill is displayed for this rule (price discount still applies).

#### 10. Separate Date Tab & Card Badge Colors (4 Fields)
To prevent color conflicts between the top day-selector badges and product card badges, each rule has **4 independent optional color pickers**:

| Field | Controls | Fallback Order if Left Empty |
| :--- | :--- | :--- |
| **Date Tab Badge Background Color** | Top badge pill on calendar day tabs (`Choose a day`) | Campaign Date Tab Badge Bg → `#C6FF00` (Neon Green) |
| **Date Tab Badge Text Color** | Text inside top calendar day tab badge | Campaign Date Tab Badge Text → `#000000` (Black) |
| **Card Badge Background Color** | Badge ribbon on Supercar, Package, Add-on & Gift Card cards | Campaign Card Badge Bg → `#D32F2F` (Red) |
| **Card Badge Text Color** | Text inside Supercar, Package, Add-on & Gift Card badges | Campaign Card Badge Text → `#FFFFFF` (White) |

---

### D. Events & Track Exclusions

#### 11. Apply To All Events (`apply_to_all_events`) & Target Events (`events`)
- **Enabled**: Applies across all events (except any **Excluded Tracks**).
- **Disabled**: Applies only to specific events chosen in **Target Events**.

#### 12. Excluded Tracks (`excluded_tracks`)
- Select any tracks where this rule must **never** apply (e.g., *Circuit of The Americas (COTA)*, *Sonoma Raceway*). Sessions at excluded tracks automatically display standard pricing.

---

## 6. Where Customers See the Promotion on the Website

### 1. Event Date Cards & Day Selector Tabs (`/booking/choose-date-and-car`)
- **Event Range Cards**: Centered single-line date range with year (e.g., `Nov 12–14, 2027`).
- **Day Selector Tabs**: Matching days display a centered top badge pill styled with **Date Tab Badge Background Color** and **Date Tab Badge Text Color**, plus the dynamic `"From $X"` lowest available price for that day and active tab (`Supercar Drives`, `Multi-Car Packages`, or `Ride-Alongs`).

### 2. Supercar & Multi-Car Package Cards
- **Accurate Per-Item Rule Matching**: Each supercar or multi-car package card evaluates rules against its own product ID, category, and available schedules—so a 30% rule on *Drive The Fleet* shows `30% OFF` only on *Drive The Fleet*, while 20% packages show `20% OFF`.
- **Card Badge**: Styled using **Card Badge Background Color** and **Card Badge Text Color** (default `#D32F2F` red / `#FFFFFF` white).
- **Time Slot Drawer**: Qualifying time slots show strikethrough original and discounted prices (`~~$549~~ $449`), standard value comparison, and savings callout.

### 3. Add-on Cards & Gift Card Shop
- **Add-on Cards** (`/booking/media-packages`, `/booking/ride-along`, standalone add-on sections, and cart upsells): Matching add-ons (such as *Full Throttle Gift Package*) display the promo badge (using Card Badge colors), crossed-out original price, and discounted price.
- **Gift Card Shop** (`GIFT CARDS` tab on `/booking/choose-date-and-car`): Matching gift card denominations display the promo badge on both the denomination button and gift card preview, crossed-out vs. discounted amount (`~~$500~~ $400`), and discounted Add to Cart CTA.

### 4. Cart Summary (Booking Wizard Steps vs. Review Step)
- **Booking Wizard Cart Summary** (`/booking/choose-date-and-car`, `/booking/coverage-options`, `/booking/ride-along`, and `/booking/media-packages`):
  - **Line Items**: Show crossed-out original price and bold discounted price side-by-side (`~~$549~~ $449`), followed by **`$100 off at checkout`** and `Price after discount`.
  - **Savings Callout Box**: Displays **`You're saving $X`** with the note: *“Discount applies automatically at checkout and is already included in the prices shown.”*
  - **Estimated Subtotal**: Displays **`Estimated subtotal`** (after discount, before fees and taxes) with the note `After discount. Before fees and taxes.`
- **Review Page (`/booking/review`)**:
  - Displays the live transactional RocketRez cart summary and actual auto-applied RocketRez discount directly from RocketRez.

---

## 7. Real-World Scenarios & Promotion Recipes

### Scenario A: Tiered Multi-Car Packages (30% OFF Full Fleet vs. 20% OFF Other Packages)
*Goal: Give 30% off "Drive The Fleet" and 20% off other multi-car packages without badge bleed.*

1. **Rule 1 (Specific Higher Tier — Placed First)**:
   - **Rule Name**: `Packages – Full Fleet 30% off`
   - **Target Product Type**: `Multi-Car Packages` (`packages`)
   - **Target Packages**: Select `Drive The Fleet`
   - **Discount Type**: `Percentage (%)` | **Discount Value**: `30`
   - **Badge Label**: `"30% OFF"`
2. **Rule 2 (Other Packages — Placed Second)**:
   - **Rule Name**: `Packages – Apex, Podium, Italian Legends, Porsche, Track Attack 20% off`
   - **Target Product Type**: `Multi-Car Packages` (`packages`)
   - **Target Packages**: Select `Apex`, `Podium`, `Italian Legends`, `Porsche`, `Track Attack`
   - **Discount Type**: `Percentage (%)` | **Discount Value**: `20`
   - **Badge Label**: `"20% OFF"`

---

### Scenario B: Promo Only on a Specific Add-on ("Full Throttle Gift Package")
*Goal: Discount only the Full Throttle Gift Package while keeping Photo, Video, and Pit Pass add-ons at regular price.*

1. **Rule Settings**:
   - **Rule Name**: `Full Throttle Gift Package – 20% Off`
   - **Target Product Type**: `Add-ons` (`addons`)
   - **Target Add-ons**: Select `Full Throttle Gift Package`
   - **Discount Type**: `Percentage (%)` | **Discount Value**: `20` *(or Fixed Amount `2500` for $25 off)*
   - **Badge Label**: `"20% OFF"`

---

### Scenario C: Promo on Specific Gift Card Products ($500 & $1,000 Gift Cards)
*Goal: Run a holiday bonus offer on $500 and $1,000 gift cards only.*

1. **Rule Settings**:
   - **Rule Name**: `Holiday Gift Cards – $50 Off $500 & $1000`
   - **Target Product Type**: `Gift Cards` (`gift_cards`)
   - **Target Gift Cards**: Select `$500 Gift Card` and `$1000 Gift Card` *(or leave empty to discount all gift cards)*
   - **Discount Type**: `Fixed Amount ($)` | **Discount Value**: `5000` *($50.00)*
   - **Badge Label**: `"$50 OFF"`

---

### Scenario D: Custom Campaign Colors Without Date Tab / Card Conflicts
*Goal: Style top day-tab badges in Purple with White text while keeping vehicle/add-on card badges in Black with Neon Green text.*

1. **On the Promotion (for the entire campaign) OR on an individual Rule**:
   - **Date Tab Badge Background Color**: `#8E24AA` (Purple)
   - **Date Tab Badge Text Color**: `#FFFFFF` (White)
   - **Card Badge Background Color**: `#000000` (Black)
   - **Card Badge Text Color**: `#C6FF00` (Neon Green)

---

### Scenario E: Weekday Morning Supercar Special ($120 OFF 9:00 & 9:30 AM Mon–Thu)
*Goal: Drive bookings into early morning weekday sessions.*

1. **Rule Settings**:
   - **Rule Name**: `Supercars – Morning (9:00 & 9:30) – Mon–Thu`
   - **Target Product Type**: `Supercars` (`supercars`)
   - **Days of the Week**: `Monday – Thursday` (`monday_thursday`)
   - **Time Window**: `Custom Window` (`custom`) | **Start Time**: `09:00` | **End Time**: `09:30`
   - **Discount Type**: `Fixed Amount ($)` | **Discount Value**: `12000` *($120.00)*
   - **Badge Label**: `"UP TO $120 OFF"`
   - **Apply To All Events**: `Enabled`

---

## 8. Best Practices & Troubleshooting Checklist

| Issue | Likely Cause | Solution |
| :--- | :--- | :--- |
| **Promotion does not show on the live site** | Record is saved as **Draft** or **Active** is OFF. | Ensure **Active** is toggled ON and click **Publish** in DatoCMS. |
| **Promotion stopped showing unexpectedly** | **End Date** has passed. | Extend **End Date** or clear it for an open-ended promotion, then re-publish. |
| **All packages show 30% OFF instead of 30% on one and 20% on others** | A broader rule with empty **Target Packages** is placed above the specific rule, or **Target Product Type** is not set to `packages`. | Put the specific package rule (`Drive The Fleet`) **above** broader package rules, or explicitly select packages in **Target Packages** on each rule. |
| **Changing badge color changed only the top tab (or only the card)** | Top day tabs and product cards use separate color fields by design to prevent conflicts. | Set **Date Tab Badge Background/Text Color** for top day tabs, and **Card Badge Background/Text Color** for Supercar, Package, Add-on, and Gift Card cards. |
| **Add-on promo discounted all add-ons instead of just Full Throttle Gift Package** | **Target Add-ons** was left empty. | Select `Full Throttle Gift Package` inside **Target Add-ons** and re-publish. |
| **Gift Card promo is not appearing in the Gift Card Shop** | **Target Product Type** is set to `Add-ons` instead of `Gift Cards`. | Set **Target Product Type** to `Gift Cards` (`gift_cards`) and optionally choose specific denominations in **Target Gift Cards**. |
| **Discount shows in Booking Wizard Cart Summary, how does Review work?** | By design, wizard steps show estimated post-discount prices before checkout, while `/booking/review` reads RocketRez's live cart discount. | Confirm the matching auto-discount rule is active in **RocketRez** so `/booking/review` and final checkout apply the same discount automatically. |

---

*Need help or custom pricing scenarios? Contact the engineering and development team for assistance.*
