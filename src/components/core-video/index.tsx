'use client'

import clsx from 'clsx'
import {
  type FC,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useInView } from 'react-intersection-observer'
import { HERO_VIDEO_DEFAULT_POSTER_SIZES } from '../../config/media'
import type { VideoFragment } from '../../core/dato/fragments/video.typegen'
import {
  getVideoStore,
  useVideo,
  useVideoActions
} from '../../core/video/use-video'
import { useMediaQuery } from '../../core/viewport/use-media-query'
import { parseMuxPosterImage } from '../../utils/parse-mux-poster-image'
import { CoreVideoControls } from '../core-video-controls'
import type { CoreVideoFragment } from './core-video.typegen'
import { PosterLayer } from './poster-layer'
import styles from './style.module.scss'
import { VideoPlayer } from './video-player'

const SECOND = 1000 as const
const UNMOUNT_DELAY_SECONDS = 3 as const
/** Brief debounce before reacting to out-of-view, protects against IntersectionObserver bouncing. */
const OUT_OF_VIEW_DEBOUNCE_MS = 150 as const
/** Delay before hiding the poster after the video fires "playing", to avoid a black flash before the first frame is visible. */
const POSTER_HIDE_DELAY_MS = 600 as const

const MUX_POSTER_WIDTH_MOBILE = 320
const MUX_POSTER_WIDTH_DESKTOP = 1200
const MUX_POSTER_WIDTH_MAX = 1200

/**
 * Mobile and optional desktop poster URLs for LCP-optimized responsive poster.
 * When provided, CoreVideo renders the poster via PosterLayer.
 * Optionally include a full srcSet (e.g. "url1 480w, url2 768w, ...") so the
 * browser can pick the best size for the displayed dimensions; use with sizes.
 */
export type ServerPosterUrls = {
  mobile: string
  desktop?: string
  /** Full srcSet with multiple widths; use with sizes for optimal loading */
  srcSet?: string
  /** Optional alt text for poster image */
  alt?: string | null
}

export type Props = {
  data: CoreVideoFragment
  uniqueVideoId?: string
  hasOutsideControls?: boolean
  className?: string
  layout?: 'fill' | 'block' | undefined
  controlsClassName?: string
  isFirstSection?: boolean
  serverPosterUrls?: ServerPosterUrls | null
  disablePoster?: boolean
  posterSizes?: string | null
  preload?: 'metadata' | 'auto' | 'none'
}

/**
 * Lazy-loaded HLS video player component.
 *
 * The video player will start playing when it enters the viewport.
 *
 * After the component leaves the viewport, it will pause immediately
 * and unmount the video player after a while (default 3 seconds) if it doesn't re-enter the viewport.
 *
 * This addresses the video stuttering issue in Chrome browsers
 * when multiple videos are present on the page.
 */
export const CoreVideo: FC<Props> = ({ data: datoData, ...propsData }) => {
  const { video, desktopVideo, customPosterImage, autoplay, controls, loop } =
    datoData
  const {
    uniqueVideoId,
    hasOutsideControls,
    className,
    layout,
    controlsClassName,
    isFirstSection,
    serverPosterUrls,
    disablePoster,
    posterSizes,
    preload
  } = propsData

  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  /** False during SSR and first client render so initial HTML matches; then true to allow conditional unmount. */
  const [hasMounted, setHasMounted] = useState(false)

  // Use React's useId for deterministic ID generation (SSR-safe)
  const reactId = useId()
  const effectiveVideoId = uniqueVideoId || `video-${reactId}`
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isWiderThanBiggestIphone = useMediaQuery('(min-width: 431px)')
  const { play, pause, setMuted, setStatus, setHasStartedPlaying } =
    useVideoActions(effectiveVideoId)
  const status = useVideo(effectiveVideoId, (s) => s.status)
  const userInteracted = useVideo(effectiveVideoId, (s) => s.userInteracted)
  const userInteractedRef = useRef(false)
  userInteractedRef.current = userInteracted

  // Memoize rootMargin to avoid recreating the string on every render
  // if this is too large, videos can effect the LCP hero as they will be loaded at the same time if they have autoplay enabled
  const rootMargin = useMemo(() => '0px', [])

  // Initialize muted state based on autoplay prop.
  // A ref tracks the last-applied autoplay + videoId so the effect only runs
  // when either actually changes (not on Strict Mode re-invokes or
  // disappear/reappear cycles where deps appear unchanged but effects re-run).
  const prevMutedInitRef = useRef<{
    autoplay: boolean | undefined
    videoId: string | undefined
  }>({ autoplay: undefined, videoId: undefined })
  useEffect(() => {
    if (
      prevMutedInitRef.current.autoplay === autoplay &&
      prevMutedInitRef.current.videoId === effectiveVideoId
    ) {
      return
    }
    prevMutedInitRef.current = { autoplay, videoId: effectiveVideoId }
    if (!getVideoStore(effectiveVideoId).getState().userInteracted) {
      setMuted(autoplay)
    }
  }, [autoplay, setMuted, effectiveVideoId])

  const { ref: inViewRef, inView } = useInView({
    rootMargin
  })

  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null)
  const setContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node
      inViewRef(node)
      setContainerEl(node)
    },
    [inViewRef]
  )

  // Store timeout reference to clear it when needed
  const unmountTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hidePosterTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pauseDebounceRef = useRef<NodeJS.Timeout | null>(null)
  /** For first section: only pause when we've seen inView true at least once (avoids pausing before IntersectionObserver runs). */
  const inViewKnownRef = useRef(false)

  // Hero (first section): start playback immediately so the video element can load and paint for LCP; don't wait for inView.
  useLayoutEffect(() => {
    if (isFirstSection && autoplay) {
      play()
    }
  }, [isFirstSection, autoplay, play])

  // Pause and eventually unmount the video player when it leaves the viewport.
  // Out-of-view response is debounced to protect against IntersectionObserver
  // bouncing (rapid true/false oscillations during re-renders).
  useEffect(() => {
    if (inView) {
      inViewKnownRef.current = true
    }

    // Clear any pending debounce / unmount when viewport changes.
    // Note: hidePosterTimeoutRef is NOT cleared here — it is only cleared
    // inside the debounced out-of-view handler, so that transient inView
    // bounces don't cancel the poster-hide timer.
    if (pauseDebounceRef.current !== null) {
      clearTimeout(pauseDebounceRef.current)
      pauseDebounceRef.current = null
    }
    if (unmountTimeoutRef.current !== null) {
      clearTimeout(unmountTimeoutRef.current)
      unmountTimeoutRef.current = null
    }

    if (inView) {
      if (autoplay || userInteractedRef.current) {
        play()
      } else {
        pause()
      }
      return
    }

    // Video is out of view.
    // Keep it truly unmounted until first in-view observation to avoid eager offscreen mounts.
    if (!inViewKnownRef.current) {
      return
    }

    // Debounce the out-of-view response so that brief inView bounces
    // don't trigger a pause → state cascade → HLS teardown cycle.
    pauseDebounceRef.current = setTimeout(() => {
      pauseDebounceRef.current = null

      // Cancel poster-hide timer only when truly going out of view AND the
      // user hasn't explicitly started playback. When the user clicked play,
      // the poster should always hide regardless of transient inView bounces.
      if (!userInteractedRef.current && hidePosterTimeoutRef.current !== null) {
        clearTimeout(hidePosterTimeoutRef.current)
        hidePosterTimeoutRef.current = null
      }

      // When the user explicitly started playback, skip the immediate pause
      // so the video keeps playing during brief visibility changes.
      // Only schedule the delayed unmount for eventual cleanup.
      if (!userInteractedRef.current) {
        pause()
      }

      unmountTimeoutRef.current = setTimeout(() => {
        pause()
        setStatus('unmounted')
        unmountTimeoutRef.current = null
      }, UNMOUNT_DELAY_SECONDS * SECOND)
    }, OUT_OF_VIEW_DEBOUNCE_MS)
  }, [inView, autoplay, play, pause, setStatus, effectiveVideoId])

  // Mark as mounted after first paint so conditional unmount matches server/client (avoids hydration mismatch)
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Cleanup on unmount.
  // Note: hidePosterTimeoutRef is intentionally NOT cleared here — this cleanup
  // also runs during React's disappear/reappear cycles (Strict Mode,
  // commitMutationEffects), which would kill the poster-hide timer. The timer
  // is self-cleaning and harmless after unmount (React ignores state updates
  // on unmounted components, and the store check is safe).
  useEffect(() => {
    return () => {
      if (pauseDebounceRef.current !== null) {
        clearTimeout(pauseDebounceRef.current)
      }
      if (unmountTimeoutRef.current !== null) {
        clearTimeout(unmountTimeoutRef.current)
      }
    }
  }, [])

  // Measure container width for poster sizes when posterSizes not provided
  useEffect(() => {
    if (!containerEl) {
      return
    }
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      setContainerWidth(width != null ? Math.round(width) : null)
    })
    observer.observe(containerEl)
    return () => {
      observer.disconnect()
    }
  }, [containerEl])

  // Memoize video data selection to avoid recalculation on every render
  const videoData = useMemo<VideoFragment['video'] | null>(() => {
    if (!video) {
      return null
    }

    // When isDesktop is null (during SSR or initial render), default to mobile video
    // to avoid hydration mismatch
    return isDesktop === true && desktopVideo?.video
      ? desktopVideo.video
      : video.video || null
  }, [video, desktopVideo, isDesktop])

  // Unified poster: LCP (serverPosterUrls) > responsive (customPosterImage) > fallback (posterUrl / Mux thumbnail)
  // Must run before early return so hooks are not conditional.
  // Always pass a width for Mux thumbnails so we never load full-resolution.
  const fallbackPosterUrl = useMemo(() => {
    if (!videoData) {
      return null
    }
    if (customPosterImage?.url) {
      return customPosterImage.url
    }
    const thumbnailUrl = videoData.thumbnailUrl
    if (!thumbnailUrl) {
      return null
    }
    const width =
      containerWidth != null && containerWidth > 0
        ? Math.min(Math.ceil(containerWidth), MUX_POSTER_WIDTH_MAX)
        : isWiderThanBiggestIphone === true
          ? MUX_POSTER_WIDTH_DESKTOP
          : MUX_POSTER_WIDTH_MOBILE
    return parseMuxPosterImage({
      thumbnailUrl,
      format: 'webp',
      width,
      time: 0
    })
  }, [
    videoData,
    customPosterImage?.url,
    isWiderThanBiggestIphone,
    containerWidth
  ])

  const effectivePosterSizes =
    posterSizes ?? (containerWidth != null ? `${containerWidth}px` : undefined)

  const posterConfig = useMemo(() => {
    if (serverPosterUrls?.mobile != null) {
      return {
        variant: 'lcp' as const,
        lcpUrls: serverPosterUrls,
        uniqueVideoId: effectiveVideoId,
        priority: isFirstSection,
        sizes: effectivePosterSizes ?? HERO_VIDEO_DEFAULT_POSTER_SIZES
      }
    }
    if (!disablePoster && customPosterImage?.responsiveImage != null) {
      return {
        variant: 'responsive' as const,
        responsiveData: customPosterImage,
        uniqueVideoId: effectiveVideoId,
        priority: isFirstSection,
        sizes: effectivePosterSizes
      }
    }
    if (fallbackPosterUrl) {
      return {
        variant: 'fallback' as const,
        fallbackUrl: fallbackPosterUrl,
        uniqueVideoId: effectiveVideoId,
        priority: isFirstSection,
        sizes: effectivePosterSizes
      }
    }
    return null
  }, [
    serverPosterUrls,
    disablePoster,
    customPosterImage,
    fallbackPosterUrl,
    effectiveVideoId,
    isFirstSection,
    effectivePosterSizes
  ])

  const onEnd = useCallback(() => {
    pause()
  }, [pause])

  const onPlaying = useCallback(() => {
    if (hidePosterTimeoutRef.current !== null) {
      clearTimeout(hidePosterTimeoutRef.current)
      hidePosterTimeoutRef.current = null
    }
    hidePosterTimeoutRef.current = setTimeout(() => {
      hidePosterTimeoutRef.current = null
      if (getVideoStore(effectiveVideoId).getState().status === 'playing') {
        setHasStartedPlaying(true)
      }
    }, POSTER_HIDE_DELAY_MS)
  }, [effectiveVideoId, setHasStartedPlaying])

  const shouldRenderVideoPlayer = isFirstSection
    ? true
    : hasMounted && (inView || status !== 'unmounted')

  if (!videoData) {
    return null
  }

  return (
    <div
      ref={setContainerRef}
      className={clsx(styles.container, className, {
        [`${styles.container__fill}`]: layout === 'fill'
      })}
    >
      {/* Poster first in DOM so LCP image is discoverable and loadable earlier.
          For fallback (Mux thumbnail) variant, defer until containerWidth is known
          to avoid loading both default (480w) and measured-width URLs. */}
      {posterConfig &&
        (posterConfig.variant !== 'fallback' || containerWidth != null) && (
          <PosterLayer {...posterConfig} />
        )}

      {/* First section stays eagerly rendered for LCP. Other videos render only once in view (or while active during delayed unmount). */}
      {shouldRenderVideoPlayer ? (
        <VideoPlayer
          data={videoData}
          autoplay={autoplay}
          loop={loop}
          uniqueVideoId={effectiveVideoId}
          preload={preload}
          onEnd={onEnd}
          onPlaying={onPlaying}
        />
      ) : null}

      {!hasOutsideControls && controls ? (
        <CoreVideoControls
          uniqueVideoId={effectiveVideoId}
          className={clsx(styles.controls, controlsClassName)}
        />
      ) : null}
    </div>
  )
}
