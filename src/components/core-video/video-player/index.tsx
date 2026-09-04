import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import type { VideoFragment } from '../../../core/dato/fragments/video.typegen'
import { useVideo, useVideoActions } from '../../../core/video/use-video'
import { useMediaQuery } from '../../../core/viewport/use-media-query'
import styles from '../style.module.scss'
import { buildStreamingUrl } from './build-streaming-url'
import { baseConfig, loadHls } from './hls'

export type Callbacks = {
  onPlaybackSuspended?: () => void
  onEnd?: () => void
  onPlay?: () => void
  /** Fired when the video element emits the native 'playing' event (playback has started). */
  onPlaying?: () => void
}

export type Props = {
  data: VideoFragment['video']
  autoplay?: boolean
  loop?: boolean
  uniqueVideoId: string
  preload?: 'metadata' | 'auto' | 'none'
  preferMp4?: boolean
  rawMp4Url?: string | null
} & Callbacks

// Check if browser has native HLS support
const checkNativeHlsSupport = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }
  const video = document.createElement('video')
  const support = video.canPlayType('application/vnd.apple.mpegurl')
  return support === 'probably' || support === 'maybe'
}

/**
 * Video player component for HLS video streams or MP4 fallbacks
 *
 * Related:
 * https://docs.mux.com/guides/control-playback-resolution
 */
export const VideoPlayer = memo<Props>(function VideoPlayer({
  data,
  autoplay = true,
  loop,
  uniqueVideoId,
  preload = 'metadata',
  preferMp4 = false,
  rawMp4Url = null,
  onPlaybackSuspended: _onPlaybackSuspended,
  onEnd: _onEnd,
  onPlay: _onPlay,
  onPlaying: _onPlaying
}) {
  const { streamingUrl, width, height } = data
  const [hlsStatus, setHlsStatus] = useState<'idle' | 'initialized'>('idle')
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)
  const [isNativeHlsSupported, setIsNativeHlsSupported] = useState(false)

  useEffect(() => {
    setIsNativeHlsSupported(checkNativeHlsSupport())
  }, [])

  // Stable ref to the last known video element, used to ignore transient null
  // callbacks from React's commit phase (Strict Mode double-invoke,
  // commitMutationEffectsOnFiber walking the fiber tree during parent updates).
  const videoElRef = useRef<HTMLVideoElement | null>(null)

  const videoRef = useCallback((node: HTMLVideoElement | null) => {
    if (node === null) {
      return
    }
    if (node !== videoElRef.current) {
      videoElRef.current = node
      setVideoEl(node)
    }
  }, [])

  const isMuted = useVideo(uniqueVideoId, (s) => s.muted)
  const status = useVideo(uniqueVideoId, (s) => s.status)
  const { setVideoElement } = useVideoActions(uniqueVideoId)

  // Deferred teardown for the videoElement store sync — prevents the store
  // from briefly seeing null during React's disappear/reappear cycles.
  const videoElTeardownRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (videoElTeardownRef.current != null) {
      clearTimeout(videoElTeardownRef.current)
      videoElTeardownRef.current = null
    }
    if (videoEl) {
      setVideoElement(videoEl)
    }
    return () => {
      videoElTeardownRef.current = setTimeout(() => {
        videoElTeardownRef.current = null
        setVideoElement(null)
      }, 0)
    }
  }, [videoEl, setVideoElement, uniqueVideoId])

  // Avoid thrashing the hook initialization and component render
  // in case the callbacks are not memoized
  const callbacks = useRef<Callbacks>({
    onPlaybackSuspended: _onPlaybackSuspended,
    onEnd: _onEnd,
    onPlay: _onPlay,
    onPlaying: _onPlaying
  })
  useEffect(() => {
    callbacks.current = {
      onPlaybackSuspended: _onPlaybackSuspended,
      onEnd: _onEnd,
      onPlay: _onPlay,
      onPlaying: _onPlaying
    }
  }, [_onEnd, _onPlay, _onPlaying, _onPlaybackSuspended])

  const isDesktop = useMediaQuery('(min-width: 691px)')

  // Delay URL computation until useMediaQuery resolves (isDesktop !== null)
  // to avoid a mobile→desktop URL transition that triggers HLS teardown.
  const url: string | null = useMemo(() => {
    if (isDesktop === null) {
      return null
    }
    return buildStreamingUrl(streamingUrl, !isDesktop, isNativeHlsSupported)
  }, [streamingUrl, isDesktop, isNativeHlsSupported])

  const playback = useCallback(
    (action: 'play' | 'pause'): void => {
      if (videoEl == null) {
        return
      }

      if (action === 'play') {
        videoEl
          .play()
          .catch((err: unknown) => {
            if (err instanceof Error && err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
              console.warn('VideoPlayer: play() failed', err)
            }

            if (callbacks.current.onPlaybackSuspended) {
              callbacks.current.onPlaybackSuspended()
            }
          })
          .catch(() => {})

        return
      }

      const _isPlaying =
        videoEl.currentTime > 0 &&
        !videoEl.paused &&
        !videoEl.ended &&
        videoEl.readyState > videoEl.HAVE_CURRENT_DATA

      if (_isPlaying) {
        videoEl.pause()
      }
    },
    [videoEl]
  )

  // Sync muted via DOM property (not JSX attribute) to avoid browser media
  // reloads caused by React's setAttribute handling of the muted attribute.
  // useLayoutEffect ensures muted is set before any useEffect-based play().
  useLayoutEffect(() => {
    if (videoEl != null) {
      videoEl.muted = isMuted
    }
  }, [videoEl, isMuted])

  // Sync video element's play/pause state with store status, only after HLS is ready.
  useEffect(() => {
    if (hlsStatus !== 'initialized') return

    if (status === 'playing') {
      playback('play')
    } else if (status === 'paused') {
      playback('pause')
    }
  }, [status, playback, hlsStatus])

  useEffect(() => {
    if (videoEl == null) {
      return
    }

    const controller = new AbortController()

    videoEl.addEventListener(
      'ended',
      () => {
        if (callbacks.current.onEnd) {
          callbacks.current.onEnd()
        }
      },
      { signal: controller.signal }
    )

    videoEl.addEventListener(
      'play',
      () => {
        if (callbacks.current.onPlay) {
          callbacks.current.onPlay()
        }
      },
      { signal: controller.signal }
    )

    videoEl.addEventListener(
      'playing',
      () => {
        if (callbacks.current.onPlaying) {
          callbacks.current.onPlaying()
        }
      },
      { signal: controller.signal }
    )

    return () => {
      controller.abort()
    }
  }, [videoEl, uniqueVideoId])

  // Track the active HLS session so we can skip re-initialization when React
  // re-runs effects during disappear/reappear or Strict Mode cycles.
  const activeHlsRef = useRef<{
    url: string
    hlsInstance: Awaited<ReturnType<typeof loadHls>>['prototype'] | null
  } | null>(null)
  const hlsTeardownRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Init HLS streaming with dynamic import for reduced bundle size.
  // Skips when url is null (useMediaQuery hasn't resolved yet).
  // Defers destructive cleanup so that React's disappear/reappear cycles
  // (commitMutationEffectsOnFiber, Strict Mode) don't tear down the stream.
  useEffect(() => {
    if (videoEl == null || isDesktop === null) {
      return
    }

    const mp4Url =
      rawMp4Url ??
      (isDesktop === true
        ? (data.mp4Medium ?? data.mp4High ?? data.mp4Low)
        : (data.mp4Low ?? data.mp4Medium ?? data.mp4High))

    if (preferMp4 && mp4Url) {
      if (hlsTeardownRef.current != null) {
        clearTimeout(hlsTeardownRef.current)
        hlsTeardownRef.current = null
      }

      const scheduleTeardown = () => {
        hlsTeardownRef.current = setTimeout(() => {
          hlsTeardownRef.current = null
          const active = activeHlsRef.current
          if (active != null) {
            if (videoEl != null) {
              videoEl.pause()
              videoEl.src = ''
            }
            if (active.hlsInstance != null) {
              active.hlsInstance.detachMedia()
              active.hlsInstance.destroy()
            }
            activeHlsRef.current = null
          }
        }, 0)
      }

      if (activeHlsRef.current != null && activeHlsRef.current.url === mp4Url) {
        setHlsStatus('initialized')
        return scheduleTeardown
      }

      if (activeHlsRef.current != null) {
        videoEl.pause()
        videoEl.src = ''
        if (activeHlsRef.current.hlsInstance != null) {
          activeHlsRef.current.hlsInstance.detachMedia()
          activeHlsRef.current.hlsInstance.destroy()
        }
        activeHlsRef.current = null
        setHlsStatus('idle')
      }

      videoEl.src = mp4Url
      activeHlsRef.current = { url: mp4Url, hlsInstance: null }
      setHlsStatus('initialized')
      return scheduleTeardown
    }

    if (url == null) {
      return
    }

    // Cancel any pending deferred teardown from a previous cleanup —
    // effects are re-running so HLS should stay alive.
    if (hlsTeardownRef.current != null) {
      clearTimeout(hlsTeardownRef.current)
      hlsTeardownRef.current = null
    }

    // Defer destructive cleanup — if effects re-run immediately
    // (Strict Mode, disappear/reappear), the timer gets cancelled above
    // and HLS stays alive. On true unmount the timer fires.
    const scheduleTeardown = () => {
      hlsTeardownRef.current = setTimeout(() => {
        hlsTeardownRef.current = null
        const active = activeHlsRef.current
        if (active != null) {
          if (videoEl != null) {
            videoEl.pause()
            videoEl.src = ''
          }
          if (active.hlsInstance != null) {
            active.hlsInstance.detachMedia()
            active.hlsInstance.destroy()
          }
          activeHlsRef.current = null
        }
      }, 0)
    }

    // Already initialized for this URL — skip (disappear/reappear re-run)
    if (activeHlsRef.current != null && activeHlsRef.current.url === url) {
      setHlsStatus('initialized')
      return scheduleTeardown
    }

    // URL changed — synchronously tear down previous session
    if (activeHlsRef.current != null) {
      videoEl.pause()
      videoEl.src = ''
      if (activeHlsRef.current.hlsInstance != null) {
        activeHlsRef.current.hlsInstance.detachMedia()
        activeHlsRef.current.hlsInstance.destroy()
      }
      activeHlsRef.current = null
      setHlsStatus('idle')
    }

    let isCancelled = false

    const initHls = async () => {
      const hlsSupport = videoEl.canPlayType('application/vnd.apple.mpegurl')
      const supportsNativeHls =
        hlsSupport === 'probably' || hlsSupport === 'maybe'

      if (supportsNativeHls) {
        videoEl.src = url
        activeHlsRef.current = { url, hlsInstance: null }
        if (!isCancelled) {
          setHlsStatus('initialized')
        }
        return
      }

      const Hls = await loadHls()

      if (isCancelled) {
        return
      }

      if (!Hls.isSupported()) {
        console.warn('HLS is not supported in this browser')
        return
      }

      const hlsInstance = new Hls({ ...baseConfig, progressive: true })
      hlsInstance.loadSource(url)
      hlsInstance.attachMedia(videoEl)
      activeHlsRef.current = { url, hlsInstance }
      
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!isCancelled) {
          setHlsStatus('initialized')
        }
      })
    }

    initHls().catch((err) => {
      console.error('Failed to initialize HLS:', err)
    })

    return () => {
      isCancelled = true
      scheduleTeardown()
    }
  }, [
    url,
    videoEl,
    uniqueVideoId,
    preferMp4,
    rawMp4Url,
    data.mp4High,
    data.mp4Medium,
    data.mp4Low,
    isDesktop
  ])



  return (
    <video
      ref={videoRef}
      className={styles.video}
      loop={loop}
      width={width}
      height={height}
      playsInline
      controls={false}
      preload={preload}
    />
  )
})
