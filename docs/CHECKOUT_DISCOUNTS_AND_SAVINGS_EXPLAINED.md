# Checkout Discounts, Savings & Order Summary Architecture

This document clarifies how discounts and savings are calculated, explains the relationship between RocketRez (RR) and DatoCMS, and outlines the redesigned Order Summary.

---

## 1. Where the Previous "Day Pricing" Savings Came From

### The Mechanism
The previous **$150 in savings** ($80 on the Porsche 911 GT3 and $70 on the Ferrari 296 GTB) was **calculated purely on the frontend by client-side code**. It did **not** come from RocketRez as an applied discount rule or coupon.

### Exact Calculation:
1. **Event Benchmark (Standard Peak Value):**
   The frontend scanned all available schedules for each car across every day of the selected event (Friday, Saturday, Sunday) to find the **highest peak rate** (typically Sunday peak hours):
   - **Ferrari 296 GTB Peak Price:** `$599`
   - **Porsche 911 GT3 Peak Price:** `$499`

2. **Selected Slot Price:**
   When the customer selected a Friday slot:
   - **Ferrari 296 GTB Selected Price:** `$529`
   - **Porsche 911 GT3 Selected Price:** `$419`

3. **Frontend Comparison Math:**
   The frontend subtracted the chosen day's price from the highest peak price:
   - **Ferrari 296 GTB:** `$599 - $529 = $70` (categorized as `"Day pricing"`)
   - **Porsche 911 GT3:** `$499 - $419 = $80` (categorized as `"Day pricing"`)
   - **Total Savings Displayed:** `$70 + $80 = $150`

4. **In RocketRez:**
   There was no discount applied. RocketRez simply created the Friday schedule with a base unit price of `$529` and `$419`. RocketRez had no record of a `$70` or `$80` promotional discount.

---

## 2. RocketRez as the Single Source of Truth

To ensure complete financial accuracy, checkout savings are now directly driven by **RocketRez's verified transaction data**:

- **Line-Item Level (`cart.lineItems[]`):**
  - RocketRez reports the unit price, line subtotal, and an explicit `discountAmount` (or `discounts` array) for any promotional rule or coupon applied to that specific product.
  - The Order Summary maps each discount to its specific product name (e.g., `Full Throttle Gift Package | Discount applied: -$79`).
- **Cart Level (`cart.discountTotal` & `cart.coupons[]`):**
  - RocketRez reports the global `discountTotal` and coupon objects with detailed `lineItemDiscounts`.
  - The checkout breakdown displays real discounts validated and applied by RocketRez's pricing engine.

---

## 3. Architecture: Avoiding Duplicate Savings (DatoCMS vs. RocketRez)

### Clear Separation of Responsibilities

| System | Role | Scope |
| :--- | :--- | :--- |
| **DatoCMS** | **Marketing & Visual Display** | Communicates promotional offers across the site (car selection cards, calendar badges, strike-through price comparisons) so customers see deals before reaching checkout. |
| **RocketRez (RR)** | **Transactional Source of Truth** | Computes the actual cart prices, manages automated discount rules, validates coupon codes, and executes final payments. |

### Deduplication Rule (No Double Counting):
For major campaigns like Black Friday, discounts will be configured in RocketRez and visually highlighted via DatoCMS.

- **The Problem Avoided:**
  If the Ferrari 296 GTB has a `$50` Black Friday discount configured in RR, and DatoCMS also highlights a `$50` deal, a naive frontend might show:
  - ❌ *Ferrari 296 GTB | Day pricing: -$50*
  - ❌ *Ferrari 296 GTB | Discount applied: -$50*
  - *(Incorrectly implying a $100 total savings).*

- **The Implemented Solution:**
  When a product receives a direct discount from RocketRez (`discountAmount > 0`), the frontend **locks and disables synthetic "Day pricing" for that item**.
  - ✅ **Result (Single Entry):**
    ```
    Ferrari 296 GTB  |  Discount applied  - $50
    ```
  - Total savings: **$50**. RocketRez remains the sole authority for all charged amounts and applied discounts.

---

## 4. Redesigned Order Summary Breakdown

The Order Summary has been redesigned to consolidate all discounts into a single, unified breakdown card located near the bottom of the summary, directly above the Total. This applies to both **desktop and mobile**.

### Visual Layout:

```
Subtotal                                          $1955
Maintenance Fee                                     $68
Ticketing Fee                                        $9

▼ See savings details (Collapsible)
───────────────────────────────────────────────────────
You saved $199      Included in your prices + applied discounts
───────────────────────────────────────────────────────
Porsche 911 GT3          | Day pricing            - $20
Huracán LP610-4          | Day pricing            - $80
Ferrari 296 GTB          | Day pricing            - $20
Full Throttle Gift Package | Discount applied      - $79
───────────────────────────────────────────────────────
Total savings                                    - $199
───────────────────────────────────────────────────────

Total                                             $1953
```

### Key Features:
1. **Top Banner Removed:** Eliminated the disconnected "You saved $150" block at the top of the Order Summary.
2. **Unified Bottom Card:** Placed between Fees and the final Total, grouping all savings into one place.
3. **Structured 3-Column Rows:**
   - **Column 1 (Product):** Clean product name (e.g., `Porsche 911 GT3`, `Full Throttle Gift Package`).
   - **Column 2 (Discount Type):** Identifies the promotion source (e.g., `| Day pricing`, `| Discount applied`, `| Coupon (CODE)`).
   - **Column 3 (Amount):** Formatted negative savings value (e.g., `- $20`, `- $79`).
4. **Collapsible Header:** Includes a `▼ See savings details` toggle that customers can expand or collapse as needed.
5. **Exact Mathematical Reconciliation:** The sum of each item row in the breakdown is guaranteed to match `Total savings` and `You saved $X` down to the exact dollar.

---

## 5. Summary Checklist

- [x] **Calculations Clarified:** Documented how legacy "Day pricing" was computed vs. real RocketRez discounts.
- [x] **Single Source of Truth:** RocketRez drives all financial totals and line-item discounts.
- [x] **Deduplication Active:** Prevents DatoCMS marketing promotions from colliding with RocketRez checkout rules.
- [x] **Order Summary Redesigned:** Fully implemented in `CartSummary` across all booking steps on desktop and mobile.
