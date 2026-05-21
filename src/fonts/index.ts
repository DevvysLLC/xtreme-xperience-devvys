import localFont from 'next/font/local'

/**
 * Anton font - Used for hero titles and headings
 * Automatic preload disabled; manual preload is controlled in layout.tsx.
 */
export const anton = localFont({
  src: '../../public/fonts/Anton-Regular.woff2',
  display: 'swap',
  variable: '--font-anton',
  weight: '400',
  preload: false
})

/**
 * Barlow font - Primary body font
 * Disable automatic preload so we can manually preload only the regular file.
 */
export const barlow = localFont({
  src: [
    {
      path: '../../public/fonts/Barlow-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/Barlow-Bold.woff2',
      weight: '700',
      style: 'normal'
    }
  ],
  display: 'swap',
  variable: '--font-barlow',
  preload: false
})

export const ANTON_FONT_PATH = '/fonts/Anton-Regular.woff2'

/**
 * Barlow Semi Condensed font - Used for subtitles and special text.
 * Only weights used in the app (400, 500, 600, 700) to reduce .ttf network dependency tree.
 * Not preloaded so these load on first use and don't block the critical path.
 */
export const barlowSemiCondensed = localFont({
  src: [
    {
      path: '../../public/fonts/BarlowSemiCondensed-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/BarlowSemiCondensed-Medium.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../../public/fonts/BarlowSemiCondensed-SemiBold.woff2',
      weight: '600',
      style: 'normal'
    },
    {
      path: '../../public/fonts/BarlowSemiCondensed-Bold.woff2',
      weight: '700',
      style: 'normal'
    }
  ],
  display: 'swap',
  variable: '--font-barlow-semi-condensed',
  preload: false
})

export const BARLOW_SEMI_CONDENSED_FONT_PATH =
  '/fonts/BarlowSemiCondensed-Regular.woff2'

/**
 * Combined font variables for use in className
 * Usage: <body className={fontVariables}>
 */
export const fontVariables = `${anton.variable} ${barlow.variable} ${barlowSemiCondensed.variable}`
