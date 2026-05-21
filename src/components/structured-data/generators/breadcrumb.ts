import { STRUCTURED_DATA_CONFIG } from '../config'
import type { BreadcrumbInput, BreadcrumbListSchema } from '../types'

type GenerateBreadcrumbSchemaOptions = {
  /**
   * The canonical URL of the current page (used to create the @id)
   */
  pageUrl: string
  /**
   * Array of breadcrumb items from root to current page
   */
  breadcrumbs: BreadcrumbInput[]
}

/**
 * Generates the BreadcrumbList schema for a page
 */
export const generateBreadcrumbSchema = ({
  pageUrl,
  breadcrumbs
}: GenerateBreadcrumbSchemaOptions): BreadcrumbListSchema => {
  const { siteUrl } = STRUCTURED_DATA_CONFIG

  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: breadcrumbs.map((crumb, index) => {
      const isLast = index === breadcrumbs.length - 1

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        // Don't include item URL for the last breadcrumb (current page)
        ...(crumb.url && !isLast ? { item: `${siteUrl}${crumb.url}` } : {})
      }
    })
  }
}
