# Xtreme Xperience — Promotions & Pricing Presentation Guide

This guide explains how to use the **Promotions Manager** and **Discount Rules** in DatoCMS to control promotional badges, strikethrough pricing, and merchandising across the booking flow.

---

## 1. How It Works (Architecture Overview)

```
┌─────────────────────────────────┐        ┌──────────────────────────────────┐
│            DatoCMS              │        │            RocketRez             │
│   (Promotions & Merchandising)  │        │   (Transactional Pricing Engine) │
├─────────────────────────────────┤        ├──────────────────────────────────┤
│ • Badges ("$100 OFF", "SALE")   │        │ • Real-time inventory / slots    │
│ • Strikethrough compare-at price│        │ • Live cart totals & checkout    │
│ • Day-of-week & Morning filters │        │ • Backend order creation         │
│ • Track exclusions (e.g. COTA)  │        │                                  │
└────────────────┬────────────────┘        └────────────────┬─────────────────┘
                 │                                          │
                 └────────────────────┬─────────────────────┘
                                      ▼
                        ┌───────────────────────────┐
                        │    Booking Flow (Web)     │
                        ├───────────────────────────┤
                        │ • Date tabs with badges   │
                        │ • "From $X" vehicle cards │
                        │ • Morning slot highlights │
                        │ • Cart savings breakdown  │
                        └───────────────────────────┘
```

> **Key Principle**: RocketRez remains the transactional source of truth for all cart charges and checkout payments. DatoCMS acts as the **Merchandising & Presentation Layer**, ensuring customers see clear promotional badges, strikethroughs, and savings (*"Standard value ~~$399~~ From $299 — Save up to $100"*) across every step of their booking journey.

---

## 2. Where to Find It in DatoCMS

1. Log into your DatoCMS project.
2. In the left navigation menu under **Content**, you will see **🏷️ Promotions Manager** (or under **Booking Settings > Discount Rules** for global booking rules).
3. Click **New record** to create a promotional campaign or configure individual rules.

---

## 3. Configuring a Promotion

Each Promotion has campaign-level settings and nested **Discount Rules**:

| Field | Description | Example |
| :--- | :--- | :--- |
| **Promotion Name** | Internal name for the marketing campaign | `Spring Speed Sale` |
| **Active** | Master toggle to turn the campaign on/off | `Checked (Active)` |
| **Start / End Date** | Optional schedule window for time-limited sales | `2026-05-01` to `2026-05-15` |
| **Badge Label** | Campaign badge shown on vehicle cards & dates | `"$100 OFF"` or `"SPRING SALE"` |
| **Headline** | Marketing banner headline (optional) | `"Save up to $100 on Morning Sessions"` |
| **Discount Rules** | Modular block(s) defining the exact pricing rules | *(See below)* |

---

## 4. Configuring Discount Rules

Within each Promotion (or under Booking Settings), you can add one or more **Discount Rules**. Each rule controls targeting, timing, exclusions, and display values:

### A. Targeting & Exclusions
- **Target Product Type**:
  - `All Products`: Applies to Supercars and Ride-Alongs.
  - `Supercars Only`: Excludes Ride-Alongs.
  - `Ride-Along Only`: Applies specifically to Ride-Along experiences (e.g. Hellcat).
- **Target Supercars**: Leave empty to apply to **all supercars**, or pick specific cars (e.g. Ferrari 488 GTB, Porsche 911 GT3 RS).
- **Target Events**: Leave enabled for **Apply To All Events**, or uncheck to target specific event dates.
- **Excluded Tracks**: Select tracks where the promotion should **NOT** apply (e.g., exclude Circuit of The Americas - COTA or Sonoma).

### B. Timing & Day-of-Week Filters
- **Days of the Week**:
  - `All Days`: Valid Monday through Sunday.
  - `Weekdays (Mon-Fri)`: Applies to any weekday event.
  - `Weekdays (Mon-Thu)`: Special Monday–Thursday pricing.
  - `Weekends (Sat-Sun)`: Saturday & Sunday only.
  - `Friday Only`, `Saturday Only`, `Sunday Only`: Target specific days.
- **Time Window**:
  - `Morning (8:00 AM - 9:30/10:00 AM)`: Automatically targets early morning sessions.
  - `Afternoon (10:00 AM - 5:30 PM)`: Standard midday sessions.
  - `All Day`: Applies to all timeslots.
  - `Custom Window`: Enter custom 24-hour start and end times (e.g., `08:00` to `09:30`).

### C. Discount Calculation & Strikethrough Overrides
- **Discount Type**:
  - `Percentage (%)`: Enter percentage discount (e.g., `10` for 10% off).
  - `Fixed Amount ($)`: Enter dollar discount (e.g., `50` for $50 off).
- **Compare-at Reference Price Override (optional)**:
  - Enter a custom strikethrough value (e.g., `449`) to display as the crossed-out original price (~~$449~~ $349).
- **Badge Label Override (optional)**:
  - Custom badge text for this specific rule (e.g., `"MORNING SPECIAL"`, `"SAVE $50"`).

---

## 5. Customer Experience (Where Customers See It)

### 1. Date Selector Tabs
- Event days that match an active discount display a badge pill (e.g. **`10% OFF`** or **`MORNING SPECIAL`**) right on the date tab.

### 2. Vehicle Cards ("Choose Date & Car")
- **"From $X" Display**: Shows the lowest discounted price available on that selected date.
- **Strikethrough Reference**: Displays `"Standard value ~~$399~~"` alongside `"Save up to $100"`.
- **Badges**: Displays the promotion badge (e.g., `"$100 OFF"`) on the vehicle card thumbnail.

### 3. Schedule Timeslots
- Morning timeslots (e.g., 8:00 AM, 8:45 AM, 9:30 AM) display the discounted price and the badge (e.g. `"9:00 AM — MORNING SPECIAL"`).
- Regular afternoon timeslots display standard rates.

### 4. Cart Summary & Review Screen
- An expandable **Savings Breakdown** shows the customer exactly how much they saved by item and category.
- Checkout totals and credit card transactions remain synchronized with RocketRez.

---

## 6. Common Recipes & Examples

### Recipe 1: Morning Early Bird Special ($50 OFF before 9:30 AM)
- **Time Window**: `Morning` (or Custom: `08:00` to `09:30`)
- **Discount Type**: `Fixed Amount ($)`
- **Discount Value**: `50`
- **Badge Label**: `"MORNING SPECIAL"`
- **Excluded Tracks**: Add `Circuit of The Americas` (if COTA has no discounts)

### Recipe 2: Weekday Flash Sale (15% OFF Mon–Thu)
- **Days of the Week**: `Weekdays (Mon-Thu)`
- **Time Window**: `All Day`
- **Discount Type**: `Percentage (%)`
- **Discount Value**: `15`
- **Badge Label**: `"15% OFF WEEKDAYS"`

### Recipe 3: High-Value Strikethrough Reference
- **Discount Type**: `Fixed Amount ($)`
- **Discount Value**: `100`
- **Compare-at Reference Price Override**: `499`
- **Result on Site**: ~~`$499`~~ **`$399`** (`Save $100`)
