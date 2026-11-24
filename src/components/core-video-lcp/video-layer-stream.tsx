'use client'

import type { HlsConfig } from 'hls.js'
import { type FC, useEffect, useRef, useState } from 'react'
import type { VideoFragment } from '../../core/dato/fragments/video.typegen'
import { buildStreamingUrl } from './build-streaming-url'
import styles from './style.module.scss'

const BASE_HLS_CONFIG = {
  startFragPrefetch: true,
  progressive: true,
  enableWorker: true,
  workerPath: '/assets/js/hls.worker.js'
} satisfies Partial<HlsConfig>

type HlsConstructor = typeof import('hls.js')['default']
let hlsPromise: Promise<HlsConstructor> | null = null
const loadHls = (): Promise<HlsConstructor> => {
  if (hlsPromise == null) {
    hlsPromise = import('hls.js').then((m) => m.default)
  }
  return hlsPromise
}

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean
  }
}

const hasConnectionSupport = (
  value: Navigator
): value is NavigatorWithConnection => {
  return 'connection' in value
}

const shouldSkipAutoplayInit = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  const connection = hasConnectionSupport(navigator)
    ? navigator.connection
    : undefined
  if (connection?.saveData === true) {
    return true
  }

  return false
}

type Props = {
  video: VideoFragment['video'] | null
  desktopVideo?: VideoFragment['video'] | null
  isDesktop: boolean
  autoplay: boolean
  loop: boolean
  // optional: let parent fade poster when video is truly visible
  onVisibleChange?: (isVisible: boolean) => void
}

export const VideoLayer: FC<Props> = ({
  video,
  desktopVideo,
  isDesktop,
  autoplay,
  loop,
  onVisibleChange
}) => {
  const effectiveVideo =
    isDesktop && desktopVideo != null ? desktopVideo : video
  const streamUrl =
    effectiveVideo?.streamingUrl != null
      ? buildStreamingUrl(effectiveVideo.streamingUrl, isDesktop)
      : null
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const playPromiseRef = useRef<Promise<void> | null>(null)
  const onVisibleChangeRef = useRef<Props['onVisibleChange']>(onVisibleChange)

  useEffect(() => {
    onVisibleChangeRef.current = onVisibleChange
  }, [onVisibleChange])

  useEffect(() => {
    const videoElement = videoRef.current
    if (videoElement == null) {
      return
    }

    // Lazily load hls.js only when the stream layer actually mounts.
    const hlsLoadPromise = loadHls()

    let cancelled = false
    let hls: InstanceType<HlsConstructor> | null = null
    let onVisibilityChange: (() => void) | null = null

    const setVisible = (next: boolean): void => {
      setIsVisible(next)
      onVisibleChangeRef.current?.(next)
    }

    const cleanup = (): void => {
      playPromiseRef.current = null
      videoElement.pause()
      videoElement.removeAttribute('src')
      while (videoElement.firstChild) {
        videoElement.removeChild(videoElement.firstChild)
      }
      videoElement.load()
      setVisible(false)
    }

    const tryPlay = (): void => {
      if (!autoplay || cancelled) {
        return
      }
      if (playPromiseRef.current != null) {
        return
      }
      videoElement.muted = true
      playPromiseRef.current = videoElement
        .play()
        .then(() => undefined)
        .catch(() => undefined)
        .finally(() => {
          playPromiseRef.current = null
        })
    }

    const onPlaying = (): void => {
      // "playing" is the strongest signal that it's actually rendering frames
      setVisible(true)
    }

    const onLoadedData = (): void => {
      setVisible(true)
      tryPlay()
    }

    videoElement.addEventListener('playing', onPlaying)
    videoElement.addEventListener('loadeddata', onLoadedData)

    const supportsNativeHls = (): boolean => {
      const t = videoElement.canPlayType('application/vnd.apple.mpegurl')
      return t === 'probably' || t === 'maybe'
    }

    const init = async (): Promise<void> => {
      cleanup()
      if (cancelled || streamUrl == null) {
        return
      }

      const HlsCtor = await hlsLoadPromise
      if (cancelled) {
        return
      }

      // 1. Prefer hls.js for robust MSE playback (Chrome, Firefox, Edge, Desktop Safari)
      // Chrome 126+ returns "maybe" for canPlayType('application/vnd.apple.mpegurl')
      // even though native <video src="...m3u8"> playback is not supported without MSE.
      if (HlsCtor.isSupported()) {
        const instance = new HlsCtor(BASE_HLS_CONFIG)
        hls = instance

        // Register MANIFEST_PARSED before loadSource so the event is never missed.
        instance.on(HlsCtor.Events.MANIFEST_PARSED, () => {
          tryPlay()
        })

        // loadSource starts the manifest fetch immediately without waiting for
        // MEDIA_ATTACHED, overlapping the manifest round-trip with media setup.
        instance.loadSource(streamUrl)
        instance.attachMedia(videoElement)
        return
      }

      // 2. Fallback to Native HLS (iOS Safari where MSE is not supported)
      if (supportsNativeHls()) {
        videoElement.src = streamUrl
        videoElement.load()
        tryPlay()
      }
    }

    if (autoplay && shouldSkipAutoplayInit()) {
      return () => {
        cancelled = true
        videoElement.removeEventListener('playing', onPlaying)
        videoElement.removeEventListener('loadeddata', onLoadedData)
        cleanup()
      }
    }

    if (document.visibilityState === 'hidden') {
      onVisibilityChange = () => {
        if (document.visibilityState !== 'hidden') {
          if (onVisibilityChange != null) {
            document.removeEventListener('visibilitychange', onVisibilityChange)
          }
          void init()
        }
      }
      document.addEventListener('visibilitychange', onVisibilityChange)
    } else {
      void init()
    }

    return () => {
      cancelled = true
      if (onVisibilityChange != null) {
        document.removeEventListener('visibilitychange', onVisibilityChange)
      }
      videoElement.removeEventListener('playing', onPlaying)
      videoElement.removeEventListener('loadeddata', onLoadedData)
      if (hls != null) {
        hls.detachMedia()
        hls.destroy()
      }
      cleanup()
    }
  }, [streamUrl, autoplay])

  return (
    <video
      ref={videoRef}
      className={styles.video}
      autoPlay={autoplay}
      loop={loop}
      muted
      playsInline
      preload="none"
      controls={false}
      width={effectiveVideo?.width ?? undefined}
      height={effectiveVideo?.height ?? undefined}
      style={isVisible ? undefined : { display: 'none' }}
    />
  )
}
