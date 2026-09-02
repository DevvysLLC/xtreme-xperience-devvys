'use client'

import clsx from 'clsx'
import { createElement, type FC, useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { CoreIcon } from '../../core-icon'
import { CoreImage } from '../../core-image'
import type { SupercarModelFragment } from '../../../core/dato/fragments/supercar-model.typegen'
import { logger } from '../../../core/logger/logger'
import { scheduleOnIdle } from '../../../utils/schedule-on-idle'
import styles from '../style.module.scss'

type Props = {
  modelViewer3d: NonNullable<SupercarModelFragment['modelViewer3d']>
  thumbnail: SupercarModelFragment['thumbnail']
  className?: string
}

// Cache the import promise to prevent multiple loads
let modelViewerImportPromise: Promise<void> | null = null

const loadModelViewer = (): Promise<void> => {
  if (modelViewerImportPromise) {
    return modelViewerImportPromise
  }

  modelViewerImportPromise = import('@google/model-viewer').then(() => {
    // Library loaded successfully
  })

  return modelViewerImportPromise
}

// Check if WebGL is supported
const checkWebGLSupport = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

// Detect Apple Safari (both mobile and desktop) where heavy 3D GLB models crash or fail
const isAppleSafari = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }
  const ua = window.navigator.userAgent.toLowerCase()
  const isSafari = ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium') && !ua.includes('android')
  const isApple = /iphone|ipad|ipod|macintosh/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  return isSafari && isApple
}

/**
 * Lazy-loaded 3D model viewer component with capability detection and Safari/WebGL fallback.
 */
export const ModelViewer3d: FC<Props> = ({ modelViewer3d, thumbnail, className }) => {
  const { url, alt } = modelViewer3d
  const [isIdleReady, setIsIdleReady] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  // Memoize rootMargin to avoid recreating the string on every render
  // Start loading when component is 200px away from viewport
  const rootMargin = useMemo(() => '200px 0px', [])

  const { ref, inView } = useInView({
    rootMargin,
    triggerOnce: true // Only trigger once when first entering viewport
  })

  // Detect support on mount
  useEffect(() => {
    const hasWebGL = checkWebGLSupport()
    // Safari fallback removed per client request to always show 3D models
    if (!hasWebGL) {
      setIsSupported(false)
    }
  }, [])

  useEffect(() => {
    const cancelScheduledLoad = scheduleOnIdle(
      () => {
        setIsIdleReady(true)
      },
      { timeoutMs: 1000, fallbackDelayMs: 150 }
    )

    return () => {
      cancelScheduledLoad()
    }
  }, [])

  useEffect(() => {
    // Only load library when idle, supported, and component is about to enter viewport
    if (
      isSupported &&
      isIdleReady &&
      inView &&
      typeof window !== 'undefined' &&
      !isLoaded &&
      !hasError
    ) {
      loadModelViewer()
        .then(() => {
          setIsLoaded(true)
        })
        .catch((error) => {
          logger.error({ error }, 'ModelViewer3d: failed to load library')
          setHasError(true)
          // Reset promise on error to allow retry
          modelViewerImportPromise = null
        })
    }
  }, [isSupported, isIdleReady, inView, isLoaded, hasError])

  if (!url) {
    return null
  }

  // Fallback to high quality static 2D image if unsupported or failed to load
  if (!isSupported || hasError) {
    return thumbnail ? (
      <CoreImage
        data={thumbnail}
        layout="fill"
        objectFit="contain"
        className={className}
      />
    ) : (
      <div
        className={clsx(
          styles.media__model,
          styles.media__placeholder,
          className
        )}
      >
        <div className={styles.media__placeholderContent} />
      </div>
    )
  }

  // Show loading placeholder to prevent layout shift
  if (!isLoaded) {
    return (
      <div
        ref={ref}
        className={clsx(
          styles.media__model,
          styles.media__placeholder,
          className
        )}
      >
        <div className={styles.media__placeholderContent} />
      </div>
    )
  }

  return (
    <>
      {createElement('model-viewer', {
        src: url,
        alt: alt ?? undefined,
        'auto-rotate': true,
        'camera-controls': true,
        'interaction-prompt': 'none',
        'camera-orbit': '-45deg auto 60%',
        'min-camera-orbit': 'auto 55deg auto',
        'max-camera-orbit': 'auto 90deg auto',
        'disable-zoom': true,
        ar: true,
        'ar-modes': 'webxr scene-viewer quick-look',
        className: clsx(styles.media__model, className)
      })}
      <div className={styles.media__icon}>
        <CoreIcon icon="3d" />
      </div>
    </>
  )
}
