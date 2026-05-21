'use client'

import clsx from 'clsx'
import { type FC, memo, useMemo } from 'react'
import { useVideo } from '../../core/video/use-video'
import { CoreImage } from '../core-image'
import type { CoreImageData, ImageData } from '../core-image/io'
import styles from './style.module.scss'

type LcpUrls = {
  mobile: string
  desktop?: string
  srcSet?: string
  alt?: string | null
}

const MOBILE_POSTER_WIDTH = 480
const DESKTOP_POSTER_WIDTH = 1600

export type ResponsivePosterData = {
  url: string
  alt: string
  width?: number
  height?: number
  responsiveImage: {
    width: number
    webpSrcSet: string
    title: string | null
    srcSet: string
    src: string
    sizes: string
    height: number
    bgColor: string | null
    base64: string | null
    aspectRatio: number
    alt: string | null
  } | null
}

export type PosterLayerProps =
  | {
      variant: 'lcp'
      lcpUrls: LcpUrls
      uniqueVideoId: string
      responsiveData?: never
      fallbackUrl?: never
      priority?: boolean
      sizes?: string
    }
  | {
      variant: 'responsive'
      responsiveData: ResponsivePosterData
      uniqueVideoId: string
      lcpUrls?: never
      fallbackUrl?: never
      priority?: boolean
      sizes?: string
    }
  | {
      variant: 'fallback'
      fallbackUrl: string
      uniqueVideoId: string
      lcpUrls?: never
      responsiveData?: never
      priority?: boolean
      sizes?: string
    }

/**
 * Single poster layer for CoreVideo. Renders LCP (picture), responsive (CoreImage),
 * or fallback (img) poster. Hides when video is playing.
 * Memoized to avoid re-renders when parent re-renders with same poster config.
 */
const PosterLayerInner: FC<PosterLayerProps> = (props) => {
  const { uniqueVideoId, variant } = props
  const hasStartedPlaying = useVideo(uniqueVideoId, (s) => s.hasStartedPlaying)

  const coreImageData = useMemo<CoreImageData | null>(() => {
    if (variant !== 'responsive' || !props.responsiveData) {
      return null
    }
    const d = props.responsiveData
    const imageData: ImageData = {
      url: d.url,
      width: d.responsiveImage?.width ?? d.width ?? null,
      height: d.responsiveImage?.height ?? d.height ?? null,
      alt: d.alt,
      title: d.responsiveImage?.title ?? null,
      focalPoint: null,
      responsiveImage: d.responsiveImage
        ? {
            src: d.responsiveImage.src,
            base64: d.responsiveImage.base64,
            bgColor: d.responsiveImage.bgColor
          }
        : null
    }
    return {
      id: `video-poster-${d.url}`,
      image: imageData,
      desktopImage: null
    }
  }, [variant, props.responsiveData])

  const hiddenAttr = hasStartedPlaying ? 'true' : 'false'

  if (variant === 'lcp' && props.lcpUrls) {
    const { mobile, desktop, srcSet: lcpSrcSet, alt } = props.lcpUrls
    const altText = alt?.trim() ?? ''
    const desktopSrc = desktop ?? mobile
    const sizes = props.sizes
    const srcSet =
      lcpSrcSet ??
      `${mobile} ${MOBILE_POSTER_WIDTH}w, ${desktopSrc} ${DESKTOP_POSTER_WIDTH}w`

    if (sizes || lcpSrcSet) {
      return (
        <img
          src={mobile}
          srcSet={srcSet}
          sizes={sizes}
          alt={altText}
          className={styles.poster}
          fetchPriority={props.priority ? 'high' : 'low'}
          loading={props.priority ? 'eager' : 'lazy'}
          decoding="async"
          aria-hidden={altText.length === 0}
          data-hidden={hiddenAttr}
        />
      )
    }

    return (
      <picture className={styles.poster} data-hidden={hiddenAttr}>
        <source media="(min-width: 1024px)" srcSet={desktopSrc} />
        <img
          src={mobile}
          alt={altText}
          fetchPriority={props.priority ? 'high' : 'low'}
          loading={props.priority ? 'eager' : 'lazy'}
          decoding="async"
          aria-hidden={altText.length === 0}
        />
      </picture>
    )
  }

  if (variant === 'responsive' && coreImageData) {
    return (
      <div
        className={clsx(styles.poster)}
        data-hidden={hiddenAttr}
        aria-hidden={hasStartedPlaying}
      >
        <CoreImage
          data={coreImageData}
          layout="fill"
          objectFit="cover"
          priority={props.priority}
        />
      </div>
    )
  }

  if (variant === 'fallback' && props.fallbackUrl) {
    return (
      <img
        src={props.fallbackUrl}
        alt=""
        className={styles.poster}
        sizes={props.sizes}
        fetchPriority={props.priority ? 'high' : 'low'}
        loading={props.priority ? 'eager' : 'lazy'}
        decoding="async"
        aria-hidden="true"
        data-hidden={hiddenAttr}
      />
    )
  }

  return null
}

export const PosterLayer = memo(PosterLayerInner)
