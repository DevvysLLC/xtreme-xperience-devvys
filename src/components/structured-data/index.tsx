import { STRUCTURED_DATA_CONFIG } from './config'
import {
  generateBreadcrumbSchema,
  generateImageObjectSchema,
  generateWebPageSchema,
  generateWebSiteSchema
} from './generators'
import type {
  BreadcrumbInput,
  JsonLdGraph,
  StructuredDataDates,
  StructuredDataSeo
} from './types'

export type StructuredDataProps = {
  /**
   * The pathname of the current page (e.g., '/tracks/sonoma-raceway')
   * Used to construct the canonical URL
   */
  pathname: string
  /**
   * SEO data for the page (title, description, image)
   */
  seo?: StructuredDataSeo | null
  /**
   * Breadcrumb items from root to current page
   */
  breadcrumbs: BreadcrumbInput[]
  /**
   * Optional date information for the page
   */
  dates?: StructuredDataDates
}

/**
 * Renders JSON-LD structured data for SEO
 *
 * @example
 * ```tsx
 * // Homepage
 * <StructuredData
 *   pathname="/"
 *   seo={homepageSeo}
 *   breadcrumbs={[{ name: 'Home' }]}
 * />
 *
 * // Track detail page
 * <StructuredData
 *   pathname="/tracks/sonoma-raceway"
 *   seo={trackSeo}
 *   breadcrumbs={[
 *     { name: 'Home', url: '/' },
 *     { name: 'Tracks', url: '/tracks' },
 *     { name: 'Sonoma Raceway' }
 *   ]}
 * />
 * ```
 */
export const StructuredData = async ({
  pathname,
  seo,
  breadcrumbs,
  dates
}: StructuredDataProps) => {
  const { siteUrl } = STRUCTURED_DATA_CONFIG

  // Normalize pathname - remove trailing slashes unless it's the homepage
  // This prevents double slashes when handle is empty (e.g., '/tracks/' -> '/tracks')
  const normalizedPathname =
    pathname === '/' ? '/' : pathname.replace(/\/+$/, '')

  // Construct the full page URL
  const pageUrl = `${siteUrl}${normalizedPathname === '/' ? '' : normalizedPathname}`
  const canonicalUrl =
    normalizedPathname === '/' ? `${siteUrl}/` : `${pageUrl}/`

  const hasImage = Boolean(seo?.image?.url)

  // Fetch website schema (uses global config from CMS)
  const webSiteSchema = await generateWebSiteSchema()

  /**
   * Safely stringify JSON for embedding in a script tag.
   * Escapes characters that could close the script tag or cause XSS.
   * Uses Unicode escapes which are valid JSON and parsed correctly.
   */
  const safeJsonStringify = (data: JsonLdGraph): string =>
    JSON.stringify(data)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026')

  // Build the JSON-LD graph
  const jsonLd: JsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      // WebPage schema for this specific page
      generateWebPageSchema({
        pageUrl: canonicalUrl,
        seo: seo ?? {},
        dates,
        hasImage
      }),
      // ImageObject schema (if page has an image)
      ...(hasImage && seo?.image?.url
        ? [
            generateImageObjectSchema({
              pageUrl: canonicalUrl,
              image: {
                url: seo.image.url,
                width: seo.image.width,
                height: seo.image.height,
                alt: seo.image.alt
              }
            })
          ]
        : []),
      // BreadcrumbList schema
      generateBreadcrumbSchema({
        pageUrl: canonicalUrl,
        breadcrumbs
      }),
      // WebSite schema (same across all pages)
      webSiteSchema
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonStringify(jsonLd) }}
    />
  )
}

// Re-export types and config for convenience
export { STRUCTURED_DATA_CONFIG } from './config'
export type {
  BreadcrumbInput,
  JsonLdGraph,
  StructuredDataDates,
  StructuredDataSeo
} from './types'
