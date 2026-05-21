'use client'

import clsx from 'clsx'
import { createElement, type FC, useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { SupercarModelFragment } from '../../../core/dato/fragments/supercar-model.typegen'
import { logger } from '../../../core/logger/logger'
import { scheduleOnIdle } from '../../../utils/schedule-on-idle'
import styles from '../style.module.scss'

type Props = {
  modelViewer3d: NonNullable<SupercarModelFragment['modelViewer3d']>
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

/**
 * Lazy-loaded 3D model viewer component.
 *
 * The model viewer library is only loaded when the component is about to enter
 * the viewport, reducing initial page load time and bundle size.
 */
export const ModelViewer3d: FC<Props> = ({ modelViewer3d, className }) => {
  const { url, alt } = modelViewer3d
  const [isIdleReady, setIsIdleReady] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Memoize rootMargin to avoid recreating the string on every render
  // Start loading when component is 200px away from viewport
  const rootMargin = useMemo(() => '200px 0px', [])

  const { ref, inView } = useInView({
    rootMargin,
    triggerOnce: true // Only trigger once when first entering viewport
  })

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
    // Only load library when idle and component is about to enter viewport
    if (
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
  }, [isIdleReady, inView, isLoaded, hasError])

  if (!url) {
    return null
  }

  // Show loading placeholder to prevent layout shift
  if (!isLoaded && !hasError) {
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

  // If library failed to load, show placeholder
  if (hasError) {
    return (
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

  return createElement('model-viewer', {
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
  })
}
