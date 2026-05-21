import { STRUCTURED_DATA_CONFIG } from '../config'
import type {
  StructuredDataDates,
  StructuredDataSeo,
  WebPageSchema
} from '../types'

type GenerateWebPageSchemaOptions = {
  /**
   * The canonical URL of the current page
   */
  pageUrl: string
  /**
   * SEO data for the page
   */
  seo: StructuredDataSeo
  /**
   * Optional date information
   */
  dates?: StructuredDataDates
  /**
   * Whether the page has a primary image
   */
  hasImage?: boolean
}

/**
 * Generates the WebPage schema for a specific page
 */
export const generateWebPageSchema = ({
  pageUrl,
  seo,
  dates,
  hasImage = false
}: GenerateWebPageSchemaOptions): WebPageSchema => {
  const { siteUrl, siteName, language } = STRUCTURED_DATA_CONFIG

  const name = seo.title ?? siteName

  return {
    '@type': 'WebPage',
    '@id': pageUrl,
    url: pageUrl,
    name,
    isPartOf: { '@id': `${siteUrl}/#website` },
    ...(hasImage
      ? {
          primaryImageOfPage: { '@id': `${pageUrl}#primaryimage` },
          image: { '@id': `${pageUrl}#primaryimage` }
        }
      : {}),
    ...(seo.image?.url ? { thumbnailUrl: seo.image.url } : {}),
    ...(dates?.datePublished ? { datePublished: dates.datePublished } : {}),
    ...(dates?.dateModified ? { dateModified: dates.dateModified } : {}),
    ...(seo.description ? { description: seo.description } : {}),
    breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
    inLanguage: language,
    potentialAction: [
      {
        '@type': 'ReadAction',
        target: [pageUrl]
      }
    ]
  }
}
