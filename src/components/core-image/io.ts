import type { ImagePropTypes } from 'react-datocms'
import type { ImgixParams } from '../../core/dato/base-types'

type BaseImageData = {
  format?: string
  url: string
  width: number | null
  height: number | null
  alt?: string | null
  title?: string | null
  focalPoint?: { x: number; y: number } | null
}

type ResponsiveImageData = {
  /** A localized image URL with imgix parameters */
  src: string
  /** A base64-encoded thumbnail to offer during image loading */
  base64?: string | null
  bgColor?: string | null
}

export type ImageData = BaseImageData & {
  responsiveImage: ResponsiveImageData | null
}

export type CoreImageData = {
  id: string
  image: ImageData | null
  desktopImage: ImageData | null
}

export type DatoImageOptions = Omit<ImagePropTypes, 'data'>

export type CustomizationProps = {
  /** Imgix Rendering API parameters */
  transformations?: {
    type: 'imgix'
    params: ImgixParams
  }
  /** A custom class name for the measured div */
  responsiveWrapperClassName?: string
}

export const flattenImageData = (
  data: ImageData
): Omit<BaseImageData, 'url'> & ResponsiveImageData => {
  const { responsiveImage, url, ...rest } = data

  if (responsiveImage == null) {
    return {
      ...rest,
      src: url
    }
  }

  return {
    ...rest,
    ...responsiveImage
  }
}
