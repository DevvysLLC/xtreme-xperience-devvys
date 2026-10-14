import type { Metadata } from 'next'
import type { SiteFragment } from '../../core/dato/fragments/site.typegen'
import { initDatoSdk } from '../../core/dato/sdk'
import { rethrowPageError } from '../../core/errors/rethrow-page-error'
import { logger } from '../../core/logger/logger'
import { extractPageSeo, mergeSeoData, seoToMetadata } from '../../utils/seo'

export type SeoComponentProps = {
  pageSeo?: {
    title?: string | null
    description?: string | null
    image?: {
      url?: string | null
      alt?: string | null
      width?: number | null
      height?: number | null
    } | null
    noIndex?: boolean | null
    twitterCard?: string | null
  } | null
  globalSeo?: SiteFragment['globalSeo'] | null
}

export const generateSeoMetadata = async (
  pageSeo?: SeoComponentProps['pageSeo']
): Promise<Metadata> => {
  try {
    const sdk = initDatoSdk()
    const siteResponse = await sdk.getSite()
    const globalSeo = siteResponse._site?.globalSeo ?? null
    const faviconTags = siteResponse._site?.faviconMetaTags ?? null

    const extractedSeo = extractPageSeo(pageSeo)
    const mergedSeo = mergeSeoData(extractedSeo, globalSeo)

    return seoToMetadata(mergedSeo, globalSeo, faviconTags)
  } catch (err) {
    return rethrowPageError(err, 'Failed to generate SEO metadata')
  }
}

export const getMergedSeoData = async (
  pageSeo?: SeoComponentProps['pageSeo']
): Promise<ReturnType<typeof mergeSeoData>> => {
  try {
    const sdk = initDatoSdk()
    const siteResponse = await sdk.getSite()
    const globalSeo = siteResponse._site?.globalSeo ?? null

    const extractedSeo = extractPageSeo(pageSeo)
    return mergeSeoData(extractedSeo, globalSeo)
  } catch (err) {
    logger.error({ error: err }, 'Failed to get merged SEO data')
    const extractedSeo = extractPageSeo(pageSeo)
    return mergeSeoData(extractedSeo, null)
  }
}
