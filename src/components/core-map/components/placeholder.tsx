import { useTranslations } from 'next-intl'
import { type FC, memo, useEffect, useRef, useState } from 'react'
import { MAPBOX_API_KEY } from '../config'
import styles from '../style.module.scss'
import { Pin } from './pin'

/**
 * Generates a Mapbox Static Images API URL for the placeholder
 */
const getStaticMapUrl = (
  lat: number,
  lng: number,
  zoom: number,
  width: number,
  height: number
): string | null => {
  const apiKey = MAPBOX_API_KEY
  if (!apiKey) {
    return null
  }

  // Use a simpler style for the static placeholder
  const style = 'mapbox/light-v11'
  const clampedZoom = Math.min(zoom, 10) // Static API max zoom is lower

  return `https://api.mapbox.com/styles/v1/${style}/static/${lng},${lat},${clampedZoom},0/${width}x${height}@2x?access_token=${MAPBOX_API_KEY}`
}

export const MapPlaceholderComponent: FC<{
  lat: number
  lng: number
  zoom: number
  aspectRatio: string
  showStaticImage: boolean
}> = ({ lat, lng, zoom, aspectRatio, showStaticImage }) => {
  const t = useTranslations('core_map')
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        if (width > 0 && height > 0) {
          // Clamp dimensions for static API (max 1280x1280)
          setDimensions({
            width: Math.min(Math.round(width), 1280),
            height: Math.min(Math.round(height), 1280)
          })
        }
      }
    })
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [])

  const staticUrl = getStaticMapUrl(
    lat,
    lng,
    zoom,
    dimensions.width,
    dimensions.height
  )

  return (
    <div
      ref={containerRef}
      className={styles.placeholder}
      style={{ aspectRatio }}
    >
      {staticUrl && (
        <img
          src={staticUrl}
          alt=""
          className={styles.placeholder__image}
          loading="lazy"
        />
      )}
      <div className={styles.placeholder__pin}>
        <Pin />
      </div>
      {!showStaticImage && (
        <div className={styles.placeholder__overlay}>
          <div className={styles.placeholder__spinner} />
          <span className={styles.placeholder__text}>{t('loading')}</span>
        </div>
      )}
    </div>
  )
}

export const MapPlaceholder = memo(MapPlaceholderComponent)
