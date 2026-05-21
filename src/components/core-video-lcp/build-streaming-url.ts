export const buildStreamingUrl = (
  streamingUrl: string,
  isDesktop: boolean
): string => {
  try {
    const url = new URL(streamingUrl)
    if (isDesktop) {
      url.searchParams.set('min_resolution', '1080p')
      url.searchParams.set('max_resolution', '1080p')
    } else {
      url.searchParams.set('min_resolution', '720p')
      url.searchParams.set('max_resolution', '720p')
    }
    return url.toString()
  } catch {
    return streamingUrl
  }
}
