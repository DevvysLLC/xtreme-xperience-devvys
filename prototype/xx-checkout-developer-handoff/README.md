# Xtreme Xperience checkout design handoff

Latest published prototype: version 28, October 8, 2026.
Preview: https://xx-checkout-preview-oct2026.xxtrem.chatgpt.site
Source commit: 631589aa6855e201b1ee7e9c752f645b46034994

## Included files
- `index.html`: complete working prototype, all checkout steps, with inline CSS, JavaScript, embedded car/product imagery and fonts. Open it directly in a browser. No build or installation required.
- `MESSAGE-TO-DEVELOPER.txt`: short implementation instruction to preserve production tracking and backend behavior.

## Implementation boundary
This file is a design prototype, not a replacement production checkout application. Port its presentation into the existing checkout. Keep production inventory, pricing, eligibility, scheduling, booking, payment and reservation services as the source of truth. Prototype inventory, prices, fees, cart timer and completion are demonstrations; coupons are not validated and no payment or reservation is made.

Production pixels, tag containers, event contracts and backend integration are not included or audited in this prototype. Do not replace the live application wholesale with this file. Audit the current implementation to identify the actual data-layer/event contract; do not assume GA4 or Meta standard names are the names currently used. Keep existing tracking dependencies or equivalent backward-compatible hooks in place.

## Tracking acceptance checks
Record baseline events before implementation, then compare them after the visual update, on desktop and mobile. Check car/date/time selection, Add to Cart, editing/removing items, each step, coverage and add-ons, coupon/voucher handling, payment and purchase confirmation. Verify unchanged event names, payload schemas, product identifiers, quantities, values, currencies, URL/step context and firing timing. Check no missing or duplicate events, consent behavior, attribution parameters and any browser/server event deduplication already in use. Preserve all existing integrations, including Meta/Facebook, Google Ads, GA4 and any others discovered in the live flow.

## Latest mobile presentation
Fixed orange progression CTA with white text and safe-area spacing. At review, order summary and totals come first, then optional add-ons and policies. Desktop layout remains the established two-column presentation.
