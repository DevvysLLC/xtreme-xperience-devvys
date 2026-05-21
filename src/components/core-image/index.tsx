'use client'
import type { FC } from 'react'
import { Image as DatoImage } from 'react-datocms'
import { useMediaQuery } from '../../core/viewport/use-media-query'
import type { CoreImageData, CustomizationProps, DatoImageOptions } from './io'
import { ResponsiveImage } from './responsive-image'

export type Props = {
  data: CoreImageData
  ref?: React.Ref<HTMLDivElement>
  withFallback?: boolean
} & DatoImageOptions &
  CustomizationProps

const FALLBACK_IMAGE_URL = '/images/fallback.png'
const FALLBACK_IMAGE_WIDTH = 800
const FALLBACK_IMAGE_HEIGHT = 800

const getFallbackImageData = () => ({
  url: FALLBACK_IMAGE_URL,
  width: FALLBACK_IMAGE_WIDTH,
  height: FALLBACK_IMAGE_HEIGHT,
  alt: null,
  title: null,
  format: 'png',
  focalPoint: null,
  src: FALLBACK_IMAGE_URL
})

export const CoreImage: FC<Props> = ({
  data,
  ref,
  withFallback = false,
  ...params
}) => {
  const { image, desktopImage } = data
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const imageData = desktopImage && isDesktop ? desktopImage : (image ?? null)
  const focalPoint = imageData?.focalPoint ?? null
  const objectPosition = focalPoint
    ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%`
    : 'center center'

  if (!imageData) {
    if (withFallback) {
      return (
        <DatoImage
          {...params}
          objectPosition={objectPosition}
          ref={ref}
          data={getFallbackImageData()}
        />
      )
    }

    return
  }

  if (imageData.width === null || imageData.height === null) {
    if (withFallback) {
      return (
        <DatoImage
          {...params}
          objectPosition={objectPosition}
          ref={ref}
          data={getFallbackImageData()}
        />
      )
    }

    return
  }

  if (imageData.width <= 0 || imageData.height <= 0) {
    if (withFallback) {
      return (
        <DatoImage
          {...params}
          objectPosition={objectPosition}
          ref={ref}
          data={getFallbackImageData()}
        />
      )
    }
    return
  }

  if (imageData.responsiveImage == null) {
    const { responsiveImage, url: src, ...baseData } = imageData
    void responsiveImage
    return (
      <DatoImage
        {...params}
        objectPosition={objectPosition}
        ref={ref}
        data={{
          ...baseData,
          src,
          width: imageData.width,
          height: imageData.height
        }}
      />
    )
  }

  return (
    <ResponsiveImage
      {...params}
      data={imageData}
      objectPosition={objectPosition}
    />
  )
}
