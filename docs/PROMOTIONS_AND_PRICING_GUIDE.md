# Xtreme Xperience — Promotions Manager & Pricing Merchandising Guide

A comprehensive, client-friendly guide to creating and managing promotional campaigns, time-based sales, badges, and strikethrough pricing across the Xtreme Xperience booking platform.

---

## Table of Contents
1. [Overview & Core Concepts](#1-overview--core-concepts)
2. [Promotions Manager vs. Legacy Booking Config](#2-promotions-manager-vs-legacy-booking-config)
3. [Step-by-Step: How to Create a New Promotion](#3-step-by-step-how-to-create-a-new-promotion)
4. [Campaign-Level Settings (Promotions Manager)](#4-campaign-level-settings-promotions-manager)
5. [Discount Rule Settings (Field-by-Field Breakdown)](#5-discount-rule-settings-field-by-field-breakdown)
6. [Where Customers See the Promotion on the Website](#6-where-customers-see-the-promotion-on-the-website)
7. [Real-World Scenarios & Promotion Recipes](#7-real-world-scenarios--promotion-recipes)
8. [Best Practices & Troubleshooting Checklist](#8-best-practices--troubleshooting-checklist)

---

## 1. Overview & Core Concepts

The **Promotions Manager** gives marketing and sales teams full, real-time control over commercial promotions, seasonal deals, early-bird specials, and visual badges without touching the platform codebase.

```
┌──────────────────────────────────────────────┐        ┌──────────────────────────────────┐
│             DatoCMS (Content Layer)          │        │      RocketRez (Engine Layer)    │
│            🏷️ Promotions Manager             │        │                                  │
├──────────────────────────────────────────────┤        ├──────────────────────────────────┤
│ • Campaign date windows (Start / End Date)   │        │ • Live ticket & slot inventory   │
│ • Promotional badges ("$100 OFF", "SALE")    │        │ • Real-time slot availability    │
│ • Strikethrough pricing (~~$399~~ From $299) │        │ • Transactional cart charges     │
│ • Day filters (Weekends, Mon-Thu, etc.)      │        │ • Merchant checkout & payments   │
│ • Time filters (Morning slots vs. Afternoon) │        │                                  │
│ • Excluded tracks (e.g. COTA, Sonoma)        │        │                                  │
└──────────────────────┬───────────────────────┘        └────────────────┬─────────────────┘
                       │                                                 │
                       └───────────────────────┬─────────────────────────┘
                                               ▼
                              ┌──────────────────────────────────┐
                              │     Customer Booking Website     │
                              ├──────────────────────────────────┤
                              │ • Promo badges on calendar dates │
                              │ • "From $X" vehicle card savings │
                              │ • Discounted slot times highlighted│
                              │ • Full savings summary in cart   │
                              └──────────────────────────────────┘
```

### The Merchandising Layer Principle
- **RocketRez** is the transactional source of truth for inventory, slot capacity, and base charges.
- **DatoCMS Promotions Manager** is the **Visual Merchandising & Presentation Layer**. It controls:
  - Promotional badge pills on date tabs and car cards.
  - Strikethrough compare-at original rates (`~~$399~~`).
  - Clear customer savings cues (`"Save up to $100"`).
  - Discounted rates shown for specific morning or weekday timeslots.

---

## 2. Promotions Manager vs. Legacy Booking Config

| Feature | 🏷️ Promotions Manager Collection (Recommended) | ⚙️ Global Booking Settings (Legacy) |
| :--- | :--- | :--- |
| **Location in DatoCMS** | Left Sidebar > **🏷️ Promotions Manager** | Left Sidebar > **Booking Config** |
| **Purpose** | Dynamic campaigns (e.g., "Weekend Sale", "Spring Early Bird", "Holiday Blowout") | Fallback or permanent baseline rules |
| **Scheduling** | Individual **Start Date** & **End Date** per campaign | Permanent (runs indefinitely unless deleted) |
| **Campaign Badges** | Global badge defined once at campaign level & inherited by all rules | Badge must be typed manually on each rule |
| **Organization** | Clean list of records with publish states and run dates | Monolithic single record mixed with all site settings |
| **Priority** | **Higher Priority** — evaluated first | Evaluated as secondary fallback |

> **Recommendation**: Always create new sales, seasonal offers, and flash deals in **🏷️ Promotions Manager**. You can keep global evergreen rules in Booking Config, or migrate everything to Promotions Manager for easier on/off scheduling.

---

## 3. Step-by-Step: How to Create a New Promotion

1. **Log in** to your DatoCMS dashboard.
2. In the left navigation panel, click **🏷️ Promotions Manager**.
3. In the top-right corner, click **+ New record**.
4. Fill in the **Campaign-Level Settings** (Name, Active, Dates, Badge, Headline).
5. In the **Rules** section, click **Add new Discount Rule** to define the exact pricing, days, and vehicles.
6. In the top-right corner, click **Save**, and then click **Publish**.
   > ⚠️ **Important**: A record saved as *Draft* will **not** appear on the live site. Always ensure the status shows **● Published**.

---

## 4. Campaign-Level Settings (Promotions Manager)

When you open a record in **Promotions Manager**, you see the campaign-level fields:

| Field Name | Type | Required? | What It Does | Example |
| :--- | :--- | :--- | :--- | :--- |
| **Name** | Single-line text | Yes | Internal name of the marketing campaign for your team. | `Weekend Sale - Spring 2026` |
| **Active** | Boolean Toggle | Yes | Master switch. If switched OFF, the entire campaign and all its rules are instantly disabled on the live site. | `Checked (Active)` |
| **Start Date** | Date / DateTime | No (Optional) | The date and time when this promotion begins. Leave empty if it should start immediately upon publishing. | `2026-10-24` or `2026-10-24T00:00:00Z` |
| **End Date** | Date / DateTime | No (Optional) | The date and time when this promotion expires. Once passed, the sale automatically turns off without needing manual removal. | `2026-10-25` or `2026-10-25T23:59:59Z` |
| **Badge Label** | Single-line text | No (Optional) | Default badge text shown on date selector tabs and vehicle cards. Rules inside this promotion will automatically inherit this badge unless they specify their own. | `"$100 OFF"`, `"WEEKEND SALE"` |
| **Headline** | Single-line text | No (Optional) | Promotional headline used for marketing callouts or campaign banners. | `"Exclusive Weekend Savings on Morning Sessions"` |
| **Rules** | Modular Content (Block) | Yes | Contains one or more **Discount Rules** that specify the pricing, schedule filters, and exclusions. | *(See section 5)* |

---

## 5. Discount Rule Settings (Field-by-Field Breakdown)

Inside each promotion, click **Add new Discount Rule**. Each rule contains the following controls:

---

### A. Identification & Product Targeting

#### 1. Title
- **What it is**: An internal descriptive title for this specific rule.
- **Example**: `Saturday & Sunday Morning Supercars - $50 Off`

#### 2. Target Product Type (`targetType`)
- **Options**:
  - `All Products`: Applies to both driving experiences (supercars) and passenger experiences (ride-alongs).
  - `Supercars Only`: Applies strictly to supercar drive sessions; ride-alongs will not be discounted.
  - `Ride-Along Only`: Applies specifically to ride-along sessions (e.g. Hellcat Ride-Along). Supercar drives will not be discounted.

#### 3. Target Supercars
- **What it is**: A multi-select link to specific supercar records in your CMS (Ferrari 488, Porsche GT3 RS, Lamborghini Huracán, etc.).
- **Leave Empty**: Applies to **all supercars** in your fleet.
- **Select Specific Cars**: Only the chosen cars receive the discount. Non-selected cars stay at full regular price.

---

### B. Calendar Days & Schedule Filtering

#### 4. Days of the Week (`daysOfWeek`)
Allows you to target only specific days of the event:
- **`All Days`**: Active Monday through Sunday without restriction.
- **`Weekdays (Mon-Fri)`**: Valid on any Monday through Friday event session.
- **`Monday - Thursday`**: Valid only on Monday, Tuesday, Wednesday, or Thursday sessions.
- **`Weekends (Sat-Sun)`**: Valid **only on Saturday and Sunday**. (Ideal for weekend sales!).
- **`Friday Only`**: Applies exclusively to Friday sessions.
- **`Saturday Only`**: Applies exclusively to Saturday sessions.
- **`Sunday Only`**: Applies exclusively to Sunday sessions.

#### 5. Time Window (`timeWindow`)
Allows you to discount specific time slots within the day:
- **`All Day`**: Applies to all session slots from open to close.
- **`Morning`**: Automatically targets early morning sessions between **8:00 AM and 10:00 AM** (e.g., 8:00 AM, 8:45 AM, 9:30 AM).
- **`Afternoon`**: Automatically targets midday and afternoon sessions from **10:00 AM to 5:30 PM**.
- **`Custom`**: Enables the custom Start Time and End Time fields below.

#### 6. Start Time & End Time (`startTime` / `endTime`)
- **When used**: Only required if **Time Window** is set to `Custom`.
- **Format**: 24-hour clock `HH:MM` (e.g. `08:00` for 8:00 AM, `11:30` for 11:30 AM, `16:00` for 4:00 PM).
- **Behavior**: Any session starting between the Start Time and End Time gets the discount.

---

### C. Pricing & Badges

#### 7. Discount Type (`discountType`)
- **`Fixed Amount ($)`**: Deducts a flat dollar amount from the base price.
  - *Example*: Value `50` takes $50 off a $399 car, making it $349.
- **`Percentage (%)`**: Deducts a percentage from the base price.
  - *Example*: Value `10` takes 10% off a $400 car, making it $360.

#### 8. Discount Value (`discountValue`)
- **What it is**: The numeric value of the discount (without dollar signs or percent symbols).
- **Example**: `50` for $50, or `15` for 15%.

#### 9. Compare-At Reference Price Override (`compareAtOverride`)
- **What it is**: A custom original price to display as the crossed-out strikethrough price (`~~$449~~ From $349`).
- **When to use**: If you want to show a higher MSRP or premium standard reference price on marketing cards to emphasize massive customer savings.
- **Leave Empty**: The system will automatically use the standard base price as the compare-at price.

#### 10. Badge Label Override (`badgeLabel`)
- **What it is**: Custom text for the badge pill displayed on date tabs and car cards for this specific rule.
- **Example**: `"MORNING SPECIAL"`, `"FLASH DEAL"`, `"$50 OFF"`.
- **Leave Empty**: Automatically inherits the parent campaign's **Badge Label** (e.g., `"$100 OFF"` or `"WEEKEND SALE"`).

---

### D. Events & Track Exclusions

#### 11. Apply To All Events (`applyToAllEvents`)
- **Checked (True)**: Automatically applies across every event date on your calendar.
- **Unchecked (False)**: Limits the rule only to the specific events selected in the **Events** field below.

#### 12. Events
- **When used**: Only when **Apply To All Events** is unchecked.
- **What it is**: Select one or more specific upcoming track event dates (e.g., `Atlanta Motorsports Park - June 12-14`).

#### 13. Excluded Tracks (`excludedTracks`)
- **What it is**: Select any tracks where this promotion should **NEVER** apply (e.g., `Circuit of The Americas (COTA)`, `Sonoma Raceway`, `Laguna Seca`).
- **How it works**: Even if *Apply To All Events* is checked, sessions held at any excluded track will automatically be excluded from the sale. Customers booking at those premier tracks will see standard non-discounted pricing.

---

## 6. Where Customers See the Promotion on the Website

When an active promotion matches an event date, timeslot, or car, it automatically merchandises itself across the entire booking experience:

### 1. Date Selector Tabs
- Event dates matching the promotion display an eye-catching badge pill right above the day/date (e.g., **`WEEKEND SALE`** or **`10% OFF`**).
- Dates outside the promotion show standard tab styling.

### 2. Vehicle Cards ("Choose Date & Car")
- **"From $X" Dynamic Starting Price**: Automatically calculates and displays the lowest available price on that day (including qualifying morning or promotional slots).
- **Strikethrough Original Price**: Shows `"Standard value ~~$399~~"` alongside the discounted price.
- **Promotional Badge Ribbon**: The badge (e.g. `"$100 OFF"`) appears on the car thumbnail.
- **Savings Callout**: Shows `"Save up to $100"` in green.

### 3. Schedule Selection Step ("Choose Your Time")
- Qualifying timeslots (e.g., morning 8:00 AM, 8:45 AM, 9:30 AM) display the discounted price and the badge next to the time:
  ```
  [ 08:45 AM ]  $299  [ $100 OFF ]
  [ 09:30 AM ]  $299  [ $100 OFF ]
  [ 10:15 AM ]  $399  (Standard Afternoon Rate)
  ```

### 4. Global Cart & Review Step
- Strikethrough pricing appears on qualifying car line items.
- An expandable **Savings Summary** highlights the customer's total discounts.

---

## 7. Real-World Scenarios & Promotion Recipes

Here are ready-to-use recipes for common marketing campaigns:

---

### Scenario A: Weekend Morning Sale ($100 OFF Saturday & Sunday Morning Sessions)
*Goal: Boost early morning slot sales on high-demand weekend events.*

1. **Campaign-Level Settings**:
   - **Name**: `Weekend Morning Supercar Blowout`
   - **Active**: `Checked`
   - **Badge Label**: `"$100 OFF"`
2. **Rule 1 Settings**:
   - **Title**: `Weekend Mornings - $100 Off`
   - **Target Product Type**: `Supercars Only`
   - **Days of Week**: `Weekends (Sat-Sun)`
   - **Time Window**: `Morning` *(covers 8:00 AM – 10:00 AM)*
   - **Discount Type**: `Fixed Amount ($)`
   - **Discount Value**: `100`
   - **Apply To All Events**: `Checked`
   - **Excluded Tracks**: Add `Circuit of The Americas` (optional)

---

### Scenario B: Weekday Flash Sale (15% OFF Monday–Thursday All Day)
*Goal: Fill weekday track days with a site-wide percentage discount.*

1. **Campaign-Level Settings**:
   - **Name**: `Weekday Speed Deal`
   - **Active**: `Checked`
   - **Start Date**: `2026-05-01`
   - **End Date**: `2026-05-31`
   - **Badge Label**: `"15% OFF"`
2. **Rule 1 Settings**:
   - **Title**: `Monday to Thursday 15% Off All Day`
   - **Target Product Type**: `All Products`
   - **Days of Week**: `Monday - Thursday`
   - **Time Window**: `All Day`
   - **Discount Type**: `Percentage (%)`
   - **Discount Value**: `15`
   - **Apply To All Events**: `Checked`

---

### Scenario C: Friday Special ($50 OFF Afternoon Sessions)
*Goal: Encourage bookings for Friday afternoon sessions before the weekend rush.*

1. **Campaign-Level Settings**:
   - **Name**: `Friday Afternoon Kickoff`
   - **Active**: `Checked`
   - **Badge Label**: `"FRIDAY DEAL"`
2. **Rule 1 Settings**:
   - **Title**: `Friday Afternoon $50 Off`
   - **Target Product Type**: `Supercars Only`
   - **Days of Week**: `Friday Only`
   - **Time Window**: `Afternoon` *(covers 10:00 AM – 5:30 PM)*
   - **Discount Type**: `Fixed Amount ($)`
   - **Discount Value**: `50`
   - **Apply To All Events**: `Checked`

---

### Scenario D: High-Performance Showcase (Porsche & Ferrari Feature with Custom Strikethrough)
*Goal: Merchandise top-tier cars with high perceived value strikethrough pricing.*

1. **Campaign-Level Settings**:
   - **Name**: `Supercar Elite Showcase`
   - **Active**: `Checked`
   - **Badge Label**: `"SAVE $75"`
2. **Rule 1 Settings**:
   - **Title**: `Porsche & Ferrari $75 Off`
   - **Target Product Type**: `Supercars Only`
   - **Target Supercars**: Select `Ferrari 488 GTB`, `Porsche 911 GT3 RS`
   - **Days of Week**: `All Days`
   - **Time Window**: `All Day`
   - **Discount Type**: `Fixed Amount ($)`
   - **Discount Value**: `75`
   - **Compare-At Price Override**: `499` *(displays ~~$499~~ From $424)*
   - **Apply To All Events**: `Checked`

---

### Scenario E: Hellcat Ride-Along Promo ($20 OFF Passenger Laps)
*Goal: Upsell ride-along experiences to friends and family joining drivers.*

1. **Campaign-Level Settings**:
   - **Name**: `Thrill Ride Promo`
   - **Active**: `Checked`
   - **Badge Label**: `"$20 OFF"`
2. **Rule 1 Settings**:
   - **Title**: `Ride-Along $20 Discount`
   - **Target Product Type**: `Ride-Along Only`
   - **Days of Week**: `All Days`
   - **Time Window**: `All Day`
   - **Discount Type**: `Fixed Amount ($)`
   - **Discount Value**: `20`
   - **Apply To All Events**: `Checked`

---

### Scenario F: Multi-Tier Promotion (Different Morning vs. Afternoon Discounts)
*Goal: Offer $100 off morning slots AND $50 off afternoon slots inside a single campaign.*

1. **Campaign-Level Settings**:
   - **Name**: `Summer Speed Blowout`
   - **Active**: `Checked`
   - **Badge Label**: `"SUMMER SALE"`
2. **Rule 1 (Morning Tier)**:
   - **Title**: `Morning Sessions Tier`
   - **Days of Week**: `All Days`
   - **Time Window**: `Morning`
   - **Discount Value**: `100` (Fixed Amount)
   - **Badge Label Override**: `"$100 OFF"`
3. **Rule 2 (Afternoon Tier)**:
   - **Title**: `Afternoon Sessions Tier`
   - **Days of Week**: `All Days`
   - **Time Window**: `Afternoon`
   - **Discount Value**: `50` (Fixed Amount)
   - **Badge Label Override**: `"$50 OFF"`

---

## 8. Best Practices & Troubleshooting Checklist

| Issue | Likely Cause | Solution |
| :--- | :--- | :--- |
| **Promotion does not show on the live site** | The record is in **Draft** state. | Click the green **Publish** button at the top right of the record in DatoCMS. |
| **Promotion does not show on the live site** | The **Active** toggle is OFF. | Open the promotion, check the **Active** box, and re-publish. |
| **Promotion stopped showing unexpectedly** | The **End Date** has passed. | Check the **End Date** field. Extend the date or leave it empty if the sale should run indefinitely. |
| **Sale shows on Saturday but not Sunday** | **Days of Week** is set to `Saturday Only`. | Change **Days of Week** to `Weekends (Sat-Sun)` and publish. |
| **Sale applies to afternoon slots when only mornings were wanted** | **Time Window** is set to `All Day`. | Set **Time Window** to `Morning` (8:00 AM – 10:00 AM) or use `Custom` (e.g. `08:00` to `09:30`). |
| **A premier track is showing discounts by mistake** | Track was not added to exclusions. | Edit the rule, click **Excluded Tracks**, add the track (e.g., *Circuit of The Americas*), and re-publish. |
| **Ride-along is discounted when only drivers should be** | **Target Product Type** is set to `All Products`. | Change **Target Product Type** to `Supercars Only`. |
| **Two promotions are running at the same time** | Both are marked **Active**. | If you have multiple active promotions, rules are evaluated in order. Deactivate or unpublish campaigns that should no longer run. |

---

*Need help or custom pricing scenarios? Contact the engineering and development team for assistance.*
