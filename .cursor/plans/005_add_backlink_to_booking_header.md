# add backlink to booking_header
- review: src/components/booking-header
- review new booking_config fields note:
  - showBackLink
  - backLink
- when showBackLink is true & backLink has value
  - render CoreCta in the booking header
