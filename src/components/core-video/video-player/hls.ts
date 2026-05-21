import type { HlsConfig } from 'hls.js'

export const baseConfig = {
  enableWorker: true,
  startFragPrefetch: true,
  workerPath: '/assets/js/hls.worker.js'
} satisfies Partial<HlsConfig>

/**
 * Dynamically loads HLS.js to reduce initial bundle size.
 * The library is only loaded when video playback is needed.
 */
export const loadHls = async () => {
  const { default: Hls } = await import('hls.js')
  return Hls
}
