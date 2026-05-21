import { STRUCTURED_DATA_CONFIG } from '../config'
import type { ImageObjectSchema } from '../types'

type GenerateImageObjectSchemaOptions = {
  /**
   * The canonical URL of the current page (used to create the @id)
   */
  pageUrl: string
  /**
   * Image data
   */
  image: {
    url: string
    width?: number | null
    height?: number | null
    alt?: string | null
  }
}

/**
 * Generates the ImageObject schema for a page's primary image
 */
export const generateImageObjectSchema = ({
  pageUrl,
  image
}: GenerateImageObjectSchemaOptions): ImageObjectSchema => {
  const { language } = STRUCTURED_DATA_CONFIG

  return {
    '@type': 'ImageObject',
    inLanguage: language,
    '@id': `${pageUrl}#primaryimage`,
    url: image.url,
    contentUrl: image.url,
    ...(image.width ? { width: image.width } : {}),
    ...(image.height ? { height: image.height } : {}),
    ...(image.alt ? { caption: image.alt } : {})
  }
}
