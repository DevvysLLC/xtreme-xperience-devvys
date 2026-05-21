# Booking Legacy

RocketRez WebEngine integration for legacy booking functionality.

## Props

- `root?: string | null` - RocketRez root identifier. Falls back to URL param `?root=`
- `startDate?: string | null` - Start date (YYYY-MM-DD). Falls back to URL param `?startDate=`
- `endDate?: string | null` - End date (YYYY-MM-DD). Falls back to URL param `?endDate=`

**Note:** All three parameters are required (via props or URL). Component will not render if any are missing.

## Usage

```tsx
// With props
<BookingLegacy root="dDyX" startDate="2026-04-23" endDate="2027-12-31" />

// With URL params: ?root=dDyX&startDate=2026-04-23&endDate=2027-12-31
<BookingLegacy />
```
