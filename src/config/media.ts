export const HERO_POSTER_WIDTHS = {
  mobile: 480,
  desktop: 1200
} as const

export const HERO_DESKTOP_MEDIA_QUERY = '(min-width: 1024px)'

// Include intermediate DPR-friendly widths so high-density phones can avoid
export const HERO_POSTER_SRCSET_WIDTHS = [480, 640, 960, 1024, 1200] as const

/**
 * Keep mobile width aligned to 480px for LCP poster candidate selection.
 */
export const HERO_POSTER_SIZES_MOBILE_ALIGNED =
  '(max-width: 1023px) 480px, (max-width: 1439px) 1024px, 1200px'

/**
 * Default poster sizes when container width is unknown for hero video.
 */
export const HERO_VIDEO_DEFAULT_POSTER_SIZES =
  '(max-width: 1023px) 480px, (max-width: 1439px) 1024px, 1200px'
