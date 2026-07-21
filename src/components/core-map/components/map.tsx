'use client'

import { useTranslations } from 'next-intl'
import { type FC, useEffect, useMemo, useRef, useState } from 'react'
import { useMediaQuery } from '../../../core/viewport/use-media-query'
import {
  DEFAULT_LAT,
  DEFAULT_LONG,
  MAPBOX_API_KEY,
  MAPBOX_API_URL,
  MAPBOX_CSS_URL,
  MAPBOX_STYLE,
  MIN_ZOOM,
  US_BOUNDS
} from '../config'
import styles from '../style.module.scss'
import { createMarkerElement } from './pin'

export type MapMarker = {
  id: string
  latitude: number
  longitude: number
  label?: string
  trackHandle?: string
}

export type Props = {
  aspectRatio?: string
  lat?: number
  long?: number
  className?: string
  markers?: MapMarker[]
  zoom?: number
  onMarkerClick?: (marker: MapMarker) => void
}

type LngLatBounds = {
  extend: (lngLat: [number, number]) => LngLatBounds
}

type MapboxMap = {
  remove: () => void
  on: (event: string, callback: () => void) => void
  fitBounds: (
    bounds: LngLatBounds,
    options?: { padding?: number; maxZoom?: number }
  ) => void
  flyTo: (options: { center: [number, number]; zoom?: number }) => void
  getZoom: () => number
}

type MapboxMarker = {
  setLngLat: (lngLat: [number, number]) => MapboxMarker
  addTo: (map: MapboxMap) => MapboxMarker
  remove: () => void
}

type MapboxLngLatBounds = new () => LngLatBounds

type MapboxGL = {
  accessToken: string
  Map: new (options: {
    container: HTMLElement
    style: string
    center: [number, number]
    zoom: number
    minZoom?: number
    maxBounds?: [[number, number], [number, number]]
    cooperativeGestures?: boolean
  }) => MapboxMap
  Marker: new (options?: {
    element?: HTMLElement
    anchor?: string
  }) => MapboxMarker
  LngLatBounds: MapboxLngLatBounds
}

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    mapboxgl?: MapboxGL
  }
}

const isMapboxGL = (value: unknown): value is MapboxGL => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  if (
    !Object.hasOwn(value, 'Map') ||
    !Object.hasOwn(value, 'accessToken') ||
    !Object.hasOwn(value, 'LngLatBounds')
  ) {
    return false
  }
  const mapProperty = Object.getOwnPropertyDescriptor(value, 'Map')?.value
  return typeof mapProperty === 'function'
}

const isMapboxLoaded = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }
  return 'mapboxgl' in window && isMapboxGL(window.mapboxgl)
}

const loadMapboxDependencies = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isMapboxLoaded()) {
      resolve()
      return
    }

    const existingScript = document.querySelector(
      `script[src="${MAPBOX_API_URL}"]`
    )
    if (existingScript) {
      // Re-check if Mapbox loaded between finding the script and attaching listeners
      // This handles the race condition where the script finishes loading
      // between the initial check and event listener attachment
      if (isMapboxLoaded()) {
        resolve()
        return
      }
      existingScript.addEventListener('load', () => {
        resolve()
      })
      existingScript.addEventListener('error', reject)
      return
    }

    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.href = MAPBOX_CSS_URL
    document.head.appendChild(cssLink)

    const script = document.createElement('script')
    script.src = MAPBOX_API_URL
    script.async = true
    script.onload = () => {
      resolve()
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

/**
 * Internal CoreMap component - the actual Mapbox implementation.
 * This is lazy-loaded by the public CoreMap component.
 * @internal
 */
export const CoreMapInternal: FC<Props> = ({
  aspectRatio = '16/9',
  lat = DEFAULT_LAT,
  long = DEFAULT_LONG,
  markers,
  zoom = 4,
  onMarkerClick
}) => {
  const t = useTranslations('core_map')
  const tIcon = useTranslations('core_icon')
  const isDesktop = useMediaQuery('(min-width: 1024px)', {
    defaultValue: false
  })
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<{
    mapboxgl: MapboxGL
    Map: MapboxMap
    markers: MapboxMarker[]
  } | null>(null)
  const onMarkerClickRef = useRef(onMarkerClick)
  const markersRef = useRef(markers)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Keep refs updated
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick
  }, [onMarkerClick])

  useEffect(() => {
    markersRef.current = markers
  }, [markers])

  // Create a stable marker key for comparison to avoid unnecessary DOM updates
  const markersKey = useMemo(() => {
    if (!markers || markers.length === 0) {
      return ''
    }
    return markers.map((m) => `${m.id}:${m.latitude}:${m.longitude}`).join('|')
  }, [markers])

  // Effect for initializing the map (only once on mount)
  useEffect(() => {
    setError(null)
    setIsLoading(true)

    if (!MAPBOX_API_KEY) {
      setError(t('error.api_key_missing'))
      setIsLoading(false)
      return
    }

    let isMounted = true

    const initializeMap = async () => {
      try {
        await loadMapboxDependencies()

        if (!isMounted || !mapContainerRef.current) {
          return
        }

        if (!('mapboxgl' in window) || !isMapboxGL(window.mapboxgl)) {
          throw new Error(t('error.failed'))
        }

        const mapboxgl = window.mapboxgl
        mapboxgl.accessToken = MAPBOX_API_KEY

        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: MAPBOX_STYLE,
          center: [DEFAULT_LONG, DEFAULT_LAT],
          zoom: 4,
          minZoom: MIN_ZOOM,
          maxBounds: US_BOUNDS,
          cooperativeGestures: !isDesktop
        })

        mapInstanceRef.current = { mapboxgl, Map: map, markers: [] }
        setError(null)
        setIsLoading(false)
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : t('error.failed'))
          setIsLoading(false)
        }
      }
    }

    initializeMap()

    return () => {
      isMounted = false
      if (mapInstanceRef.current?.markers) {
        mapInstanceRef.current.markers.forEach((marker) => {
          marker.remove()
        })
      }
      if (mapInstanceRef.current?.Map) {
        mapInstanceRef.current.Map.remove()
        mapInstanceRef.current = null
      }
    }
  }, [t, isDesktop])

  // Effect for updating map position when lat/long/zoom changes (only when no markers)
  useEffect(() => {
    const mapInstance = mapInstanceRef.current
    if (!mapInstance || isLoading) {
      return
    }

    // Only fly to new position if we have NO markers
    // Position will be handled by the markers effect with fitBounds when markers exist
    // Using ref to avoid triggering this effect when markers change
    const currentMarkers = markersRef.current
    if (currentMarkers && currentMarkers.length > 0) {
      return
    }

    // Fly to the new position for no markers case
    mapInstance.Map.flyTo({
      center: [long, lat],
      zoom
    })
  }, [lat, long, zoom, isLoading])

  // Effect for updating markers when they change
  // Uses markersKey for stable comparison to avoid unnecessary DOM recreation
  useEffect(() => {
    const mapInstance = mapInstanceRef.current
    if (!mapInstance || isLoading) {
      return
    }

    const { mapboxgl, Map: map } = mapInstance

    // Remove existing markers
    mapInstance.markers.forEach((marker) => {
      marker.remove()
    })
    mapInstance.markers = []

    // If markers array is provided, add those
    if (markers && markers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()

      for (const markerData of markers) {
        const markerElement = createMarkerElement(
          markerData.label ?? tIcon('pin')
        )

        // Add click handler to marker element
        markerElement.addEventListener('click', () => {
          onMarkerClickRef.current?.(markerData)
        })

        const marker = new mapboxgl.Marker({ element: markerElement })
          .setLngLat([markerData.longitude, markerData.latitude])
          .addTo(map)
        mapInstance.markers.push(marker)
        bounds.extend([markerData.longitude, markerData.latitude])
      }

      // Fit map to show all markers or fly to single marker
      if (markers.length > 1) {
        map.fitBounds(bounds, { padding: 50, maxZoom: 10 })
      } else if (markers.length === 1) {
        const firstMarker = markers[0]
        if (firstMarker) {
          // For single marker, fly to it with the specified zoom
          map.flyTo({
            center: [firstMarker.longitude, firstMarker.latitude],
            zoom
          })
        }
      }
    } else {
      // Add single marker at lat/long if no markers array
      const markerElement = createMarkerElement(tIcon('pin'))
      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([long, lat])
        .addTo(map)
      mapInstance.markers.push(marker)
    }
    // Using markersKey instead of markers for stable comparison
  }, [markersKey, markers, lat, long, zoom, isLoading, tIcon])

  return (
    <div className={styles.map}>
      <div
        ref={mapContainerRef}
        className={styles.container}
        style={{
          aspectRatio
        }}
      >
        {isLoading && <div className={styles.loading}>{t('loading')}</div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  )
}
