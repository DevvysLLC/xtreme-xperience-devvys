import { initDatoSdk } from '../../../core/dato/sdk'
import { safeAwait } from '../../../core/errors/safe-await'
import { STRUCTURED_DATA_CONFIG } from '../config'
import type { WebSiteSchema } from '../types'

/**
 * Generates the WebSite schema for the site
 * This schema is the same across all pages
 *
 * Fetches site name/description from CMS with graceful fallback to static config.
 * CMS failures are logged but don't prevent page rendering since structured data
 * is SEO metadata and shouldn't crash the page.
 */
export const generateWebSiteSchema = async (): Promise<WebSiteSchema> => {
  const { siteUrl, language, siteName, siteDescription } =
    STRUCTURED_DATA_CONFIG

  // Fetch global config from CMS with error handling
  // Falls back to static config values if CMS fetch fails
  let seoSiteName: string | null | undefined
  let seoSiteDescription: string | null | undefined

  const sdk = initDatoSdk()
  const [error, result] = await safeAwait(sdk.getGlobalConfig())

  if (!error) {
    seoSiteName = result.globalConfig?.seoSiteName
    seoSiteDescription = result.globalConfig?.seoSiteDescription
  }

  return {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: seoSiteName || siteName,
    description: seoSiteDescription || siteDescription,
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/?s={search_term_string}`
        },
        'query-input': {
          '@type': 'PropertyValueSpecification',
          valueRequired: true,
          valueName: 'search_term_string'
        }
      }
    ],
    inLanguage: language
  }
}
