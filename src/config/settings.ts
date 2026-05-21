import type { BookingLapQuantityConfig } from '../io/types'

// =============================================================================
// Booking
// =============================================================================

export const CHOOSE_ON_DRIVE_DAY_INPUT_VALUE = 'choose_on_drive_day'
export const BOOKING_LAPS_PER_SESSION = 3
export const BOOKING_LAP_QUANTITY_OPTIONS: BookingLapQuantityConfig[] = [
  {
    quantity: 1,
    label: '3 Laps',
    laps: 3,
    description: '3 laps = 1 sessions',
    booking_config_label_key: 'quantity_label_three_laps',
    badge: {
      label: 'Most Popular'
    },
    soldOutBadge: {
      label: 'Sold Out'
    }
  },
  {
    quantity: 2,
    label: '6 Laps',
    laps: 6,
    description: '6 laps = 2 sessions',
    booking_config_label_key: 'quantity_label_six_laps',
    badge: {
      label: 'Save %10'
    },
    soldOutBadge: {
      label: 'Sold Out'
    }
  },
  {
    quantity: 3,
    label: '9 Laps',
    laps: 9,
    description: '9 laps = 3 sessions',
    booking_config_label_key: 'quantity_label_nine_laps',
    soldOutBadge: {
      label: 'Sold Out'
    }
  }
]

// =============================================================================
// Search
// =============================================================================
export const ENABLE_SEARCH = false

// =============================================================================
// Settings
// =============================================================================
export const POSTS_PER_PAGE = 12
export const POSTS_PER_PAGE_FIRST = 10

// =============================================================================
// Site URL
// =============================================================================
export const SITE_URL = 'https://www.thextremexperience.com'.replace(/\/+$/, '')
