import { HERO_POSTER_SRCSET_WIDTHS, HERO_POSTER_WIDTHS } from '../config/media'
import { isImage, isVideo } from '../core/typescript/guards'
import { parseMuxPosterImage } from './parse-mux-poster-image'

/**
 * Returns true if the URL is a Mux thumbnail (image.mux.com) so we can build
 * a responsive srcSet from it. Allows container-appropriate sizes instead of
 * loading a single large image (e.g. width=1024 on a 314px container).
 */
const isMuxThumbnailUrl = (url: string): boolean => {
  try {
    const u = new URL(url)
    return (
      u.hostname.includes('image.mux.com') === true &&
      (u.pathname.includes('/thumbnail.') === true ||
        u.pathname.endsWith('/thumbnail') === true)
    )
  } catch {
    return false
  }
}

/**
 * Returns true if the URL is a DatoCMS asset served via imgix so we can build
 * a responsive srcSet by varying the `w` parameter. DatoCMS hosts assets on
 * imgix, so width/format params work the same as any imgix URL.
 */
const isDatoCmsImgixUrl = (url: string): boolean => {
  try {
    const u = new URL(url)
    return u.hostname.includes('datocms-assets.com')
  } catch {
    return false
  }
}

/**
 * Builds a DatoCMS imgix URL with a specific width. Removes the `dpr` parameter
 * (which is a multiplier on `w`) so the width is exact. Adds `auto=format` when
 * not already present so the browser receives WebP/AVIF when supported, and sets
 * `q=75` for compression (matches ResponsiveImage defaults).
 */
const buildDatoCmsImgixUrl = (baseUrl: string, width: number): string => {
  const u = new URL(baseUrl)
  u.searchParams.set('w', String(width))
  u.searchParams.delete('dpr')
  if (!u.searchParams.has('auto')) {
    u.searchParams.set('auto', 'format')
  }
  if (!u.searchParams.has('q')) {
    u.searchParams.set('q', '75')
  }
  return u.toString()
}

/**
 * Builds mobile/desktop URLs and a full srcSet from a DatoCMS imgix URL.
 * Ensures 320w/480w exist so narrow/mobile containers don't load a large image.
 */
const buildDatoCmsPosterResult = (
  datoCmsUrl: string,
  alt: string | null = null
): { mobile: string; desktop: string; srcSet: string; alt: string | null } => {
  const mobileUrl = buildDatoCmsImgixUrl(datoCmsUrl, HERO_POSTER_WIDTHS.mobile)
  const desktopUrl = buildDatoCmsImgixUrl(
    datoCmsUrl,
    HERO_POSTER_WIDTHS.desktop
  )
  const builtSrcSet = HERO_POSTER_SRCSET_WIDTHS.map(
    (w) => `${buildDatoCmsImgixUrl(datoCmsUrl, w)} ${w}w`
  ).join(', ')
  return { mobile: mobileUrl, desktop: desktopUrl, srcSet: builtSrcSet, alt }
}

/**
 * Builds mobile/desktop URLs and a full srcSet from a Mux thumbnail URL.
 * Ensures 320w/480w exist so narrow containers (e.g. 314px) don't load 1024w.
 */
const buildMuxPosterResult = (
  muxThumbnailUrl: string,
  alt: string | null = null
): { mobile: string; desktop: string; srcSet: string; alt: string | null } => {
  const mobileUrl = parseMuxPosterImage({
    thumbnailUrl: muxThumbnailUrl,
    format: 'webp',
    time: 0,
    width: HERO_POSTER_WIDTHS.mobile
  })
  const desktopUrl = parseMuxPosterImage({
    thumbnailUrl: muxThumbnailUrl,
    format: 'webp',
    time: 0,
    width: HERO_POSTER_WIDTHS.desktop
  })
  const builtSrcSet = HERO_POSTER_SRCSET_WIDTHS.map(
    (w) =>
      `${parseMuxPosterImage({
        thumbnailUrl: muxThumbnailUrl,
        format: 'webp',
        time: 0,
        width: w
      })} ${w}w`
  ).join(', ')
  return { mobile: mobileUrl, desktop: desktopUrl, srcSet: builtSrcSet, alt }
}

/**
 * Parses a srcSet string (e.g. "url1 480w, url2 1024w") and returns the URLs
 * for the smallest (mobile) and largest (desktop) width descriptors.
 * Used to derive mobile/desktop poster URLs from Dato responsiveImage.srcSet.
 */
const parseSrcSetMobileDesktop = (
  srcSet: string
): {
  mobile: string
  desktop: string
} | null => {
  const entries = srcSet
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (entries.length === 0) {
    return null
  }

  const parsed = entries
    .map((entry) => {
      const lastSpace = entry.lastIndexOf(' ')
      const url = lastSpace >= 0 ? entry.slice(0, lastSpace).trim() : entry
      const descriptor = lastSpace >= 0 ? entry.slice(lastSpace + 1).trim() : ''
      const widthMatch = /^(\d+)w$/.exec(descriptor)
      const width = widthMatch?.[1] ? Number.parseInt(widthMatch[1], 10) : 0
      return { url, width }
    })
    .filter((p) => p.url.length > 0)

  if (parsed.length === 0) {
    return null
  }

  const byWidth = [...parsed].sort((a, b) => a.width - b.width)
  const first = byWidth[0]
  const last = byWidth[byWidth.length - 1]
  if (!first || !last) {
    return null
  }
  return { mobile: first.url, desktop: last.url }
}

/**
 * Type representing a media object that can be used for LCP image extraction.
 * This matches the structure of CoreImageRecord and CoreVideoRecord fragments.
 * Uses structural typing to be compatible with both fragment types and base types.
 */
type HeroMedia =
  | {
      __typename: 'CoreImageRecord'
      image: {
        responsiveImage: { src: string; alt?: string | null } | null
        url: string
        alt?: string | null
      } | null
      desktopImage: {
        responsiveImage: { src: string; alt?: string | null } | null
        url: string
        alt?: string | null
      } | null
    }
  | {
      __typename: 'CoreVideoRecord'
      customPosterImage: {
        responsiveImage: {
          src: string
          srcSet?: string
          webpSrcSet?: string
          alt?: string | null
        } | null
        url: string
        alt?: string | null
      } | null
      video: { video: { thumbnailUrl: string } | null } | null
      desktopVideo: { video: { thumbnailUrl: string } | null } | null
    }
  | null

export type HeroLcpImagesResult = {
  mobile: string | null
  desktop: string | null
  /** Full srcSet with multiple widths when available; use with sizes for optimal loading */
  srcSet?: string
  alt?: string | null
}

/**
 * Returns mobile and desktop image URLs for LCP preloading.
 * When possible, also returns a full srcSet with multiple widths (480w–1600w)
 * so the browser can pick the best size for the displayed dimensions.
 *
 * @param media - A CoreImageRecord, CoreVideoRecord, or null (fragment or base type)
 * @returns Object with mobile, desktop, and optional srcSet, or null if no media
 */
export const getHeroLcpImages = (
  media: HeroMedia
): HeroLcpImagesResult | null => {
  if (!media) {
    return null
  }

  if (isImage(media)) {
    const altText =
      media.image?.responsiveImage?.alt ??
      media.image?.alt ??
      media.desktopImage?.responsiveImage?.alt ??
      media.desktopImage?.alt ??
      null

    const mobileUrl =
      media.image?.responsiveImage?.src ?? media.image?.url ?? null
    const desktopUrl =
      media.desktopImage?.responsiveImage?.src ??
      media.desktopImage?.url ??
      null

    // If we have both, return both. Otherwise, use the available one for both.
    if (mobileUrl && desktopUrl) {
      return { mobile: mobileUrl, desktop: desktopUrl, alt: altText }
    }

    const fallbackUrl = mobileUrl ?? desktopUrl
    return fallbackUrl
      ? { mobile: fallbackUrl, desktop: fallbackUrl, alt: altText }
      : null
  }

  if (isVideo(media)) {
    const responsive = media.customPosterImage?.responsiveImage
    const altText = responsive?.alt ?? media.customPosterImage?.alt ?? null
    // Prefer webpSrcSet for smaller payloads; fall back to srcSet
    const srcSet = responsive?.webpSrcSet ?? responsive?.srcSet

    if (srcSet && srcSet.length > 0) {
      const parsed = parseSrcSetMobileDesktop(srcSet)
      if (parsed) {
        // Dato may only provide large widths (e.g. 768w/1024w). Rebuild from the
        // smallest Mux URL so 320w/480w exist and mobile containers don't load 1024w.
        if (isMuxThumbnailUrl(parsed.mobile)) {
          return buildMuxPosterResult(parsed.mobile, altText)
        }
        // DatoCMS imgix: Dato srcSets often lack small widths (e.g. only 500w/2000w).
        // Rebuild with 320w–1920w so mobile gets a properly sized image.
        if (isDatoCmsImgixUrl(parsed.mobile)) {
          return buildDatoCmsPosterResult(parsed.mobile, altText)
        }
        return {
          mobile: parsed.mobile,
          desktop: parsed.desktop,
          srcSet,
          alt: altText
        }
      }
    }

    const customPoster = responsive?.src ?? media.customPosterImage?.url
    if (customPoster) {
      // Single URL with no srcSet: if it's a Mux thumbnail, build a srcSet so
      // the browser can pick container-appropriate width (e.g. 320w for 314px).
      if (isMuxThumbnailUrl(customPoster)) {
        return buildMuxPosterResult(customPoster, altText)
      }
      // DatoCMS imgix: build responsive srcSet so mobile doesn't load the
      // full-resolution image (e.g. 2000px) on a 480px-wide screen.
      if (isDatoCmsImgixUrl(customPoster)) {
        return buildDatoCmsPosterResult(customPoster, altText)
      }
      return { mobile: customPoster, desktop: customPoster, alt: altText }
    }

    const muxThumbnail =
      media.video?.video?.thumbnailUrl ??
      media.desktopVideo?.video?.thumbnailUrl

    if (muxThumbnail) {
      return buildMuxPosterResult(muxThumbnail, altText)
    }

    return null
  }

  return null
}

/**
 * Gets the hero image URL for LCP (Largest Contentful Paint) optimization.
 * Returns the URL of the image that should be preloaded for optimal LCP performance.
 *
 * For images: Prefers mobile image for preload, falls back to desktop.
 * For videos: Returns custom poster image if available, otherwise falls back to video thumbnail.
 *
 * @deprecated Use getHeroLcpImages instead for responsive preloading
 * @param media - A CoreImageRecord, CoreVideoRecord, or null (fragment or base type)
 * @returns The image URL to preload, or null if no media is available
 */
export const getHeroLcpImage = (media: HeroMedia): string | null => {
  const images = getHeroLcpImages(media)
  if (!images) {
    return null
  }

  // Prefer mobile for backward compatibility, but desktop is better for desktop users
  return images.mobile ?? images.desktop ?? null
}
