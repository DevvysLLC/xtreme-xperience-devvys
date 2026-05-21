'use client'

import clsx from 'clsx'
import {
  type ComponentType,
  type FC,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState
} from 'react'
import type { Props as CoreMapInternalProps, MapMarker } from './components/map'
import { MapPlaceholder } from './components/placeholder'
import styles from './style.module.scss'

// Re-export types
export type { MapMarker }

// Lazy load the internal CoreMap component
const CoreMapInternal: ComponentType<CoreMapInternalProps> = lazy(() =>
  import('./components/map').then((mod) => ({
    default: mod.CoreMapInternal
  }))
)

// Center of lower 48 US states for static placeholder
const DEFAULT_LAT = 39.833333
const DEFAULT_LONG = -98.585522

export type Props = CoreMapInternalProps & {
  /** Delay before starting to load the map (ms). Default: 0 */
  loadDelay?: number
  /** Whether to load immediately without waiting for visibility. Default: false */
  eager?: boolean
  showStaticImage?: boolean
}

/**
 * CoreMap - A performance-optimized map component
 *
 * Features:
 * - Lazy loads the Mapbox GL JS bundle
 * - Shows a static map placeholder while loading
 * - Uses Intersection Observer to defer loading until visible
 * - Reduces initial JavaScript bundle size
 *
 * @example
 * ```tsx
 * // Basic usage - loads when visible
 * <CoreMap lat={40.7128} long={-74.006} />
 *
 * // Load immediately (e.g., for above-the-fold maps)
 * <CoreMap lat={40.7128} long={-74.006} eager />
 *
 * // With markers
 * <CoreMap markers={[{ id: '1', latitude: 40.7128, longitude: -74.006 }]} />
 * ```
 */
export const CoreMap: FC<Props> = ({
  lat = DEFAULT_LAT,
  long = DEFAULT_LONG,
  zoom = 4,
  aspectRatio = '16/9',
  loadDelay = 0,
  eager = false,
  showStaticImage = false,
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(eager)
  const [shouldLoad, setShouldLoad] = useState(eager)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer to detect when map container is visible
  useEffect(() => {
    if (eager || isVisible) {
      return
    }

    const element = containerRef.current
    if (!element) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '200px', // Start loading when 200px away from viewport
        threshold: 0
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [eager, isVisible])

  // Apply load delay if specified
  useEffect(() => {
    if (!isVisible) {
      return
    }

    if (loadDelay <= 0) {
      setShouldLoad(true)
      return
    }

    const timer = setTimeout(() => {
      setShouldLoad(true)
    }, loadDelay)

    return () => {
      clearTimeout(timer)
    }
  }, [isVisible, loadDelay])

  return (
    <div ref={containerRef} className={clsx(styles.lazyWrapper, className)}>
      {shouldLoad && !showStaticImage ? (
        <Suspense
          fallback={
            <MapPlaceholder
              lat={lat}
              lng={long}
              zoom={zoom}
              aspectRatio={aspectRatio}
              showStaticImage={true}
            />
          }
        >
          <CoreMapInternal
            lat={lat}
            long={long}
            zoom={zoom}
            aspectRatio={aspectRatio}
            {...props}
          />
        </Suspense>
      ) : (
        <MapPlaceholder
          lat={lat}
          lng={long}
          zoom={zoom}
          aspectRatio={aspectRatio}
          showStaticImage={true}
        />
      )}
    </div>
  )
}
