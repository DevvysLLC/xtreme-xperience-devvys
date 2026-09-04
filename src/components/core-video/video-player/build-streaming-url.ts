/**
 * Builds the HLS streaming URL with resolution params so preload and
 * VideoPlayer request the same URL. Keeps LCP preload (SectionHero) and
 * actual load (VideoPlayer) in sync.
 *
 * VideoPlayer uses (min-width: 691px) for desktop; mobile is the default.
 */
export const buildStreamingUrl = (
  streamingUrl: string,
  isMobile: boolean,
  isSafariNativeHls?: boolean
): string => {
  const url = new URL(streamingUrl)
  if (isMobile) {
    url.searchParams.set('max_resolution', '720p')
  } else {
    if (!isSafariNativeHls) {
      url.searchParams.set('rendition_order', 'desc')
    }
    url.searchParams.set('max_resolution', '1080p')
  }
  return url.toString()
}
