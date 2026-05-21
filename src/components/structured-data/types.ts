/**
 * TypeScript types for JSON-LD structured data schemas
 * Based on Schema.org vocabulary
 */

export type JsonLdGraph = {
  '@context': 'https://schema.org'
  '@graph': JsonLdEntity[]
}

export type JsonLdEntity =
  | WebPageSchema
  | WebSiteSchema
  | ImageObjectSchema
  | BreadcrumbListSchema

export type WebPageSchema = {
  '@type': 'WebPage'
  '@id': string
  url: string
  name: string
  isPartOf: { '@id': string }
  primaryImageOfPage?: { '@id': string }
  image?: { '@id': string }
  thumbnailUrl?: string
  datePublished?: string
  dateModified?: string
  description?: string
  breadcrumb: { '@id': string }
  inLanguage: string
  potentialAction: ReadAction[]
}

export type ReadAction = {
  '@type': 'ReadAction'
  target: string[]
}

export type WebSiteSchema = {
  '@type': 'WebSite'
  '@id': string
  url: string
  name: string
  description: string
  potentialAction: SearchAction[]
  inLanguage: string
}

export type SearchAction = {
  '@type': 'SearchAction'
  target: {
    '@type': 'EntryPoint'
    urlTemplate: string
  }
  'query-input': {
    '@type': 'PropertyValueSpecification'
    valueRequired: boolean
    valueName: string
  }
}

export type ImageObjectSchema = {
  '@type': 'ImageObject'
  inLanguage: string
  '@id': string
  url: string
  contentUrl: string
  width?: number
  height?: number
  caption?: string
}

export type BreadcrumbListSchema = {
  '@type': 'BreadcrumbList'
  '@id': string
  itemListElement: BreadcrumbItem[]
}

export type BreadcrumbItem = {
  '@type': 'ListItem'
  position: number
  name: string
  item?: string
}

/**
 * Input types for generating structured data
 */
export type BreadcrumbInput = {
  name: string
  url?: string
}

export type StructuredDataSeo = {
  title?: string | null
  description?: string | null
  image?: {
    url?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
  } | null
}

export type StructuredDataDates = {
  datePublished?: string | null
  dateModified?: string | null
}
