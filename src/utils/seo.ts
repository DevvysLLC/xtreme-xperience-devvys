import type { Metadata } from 'next'
import type { SeoField, Tag } from '../core/dato/base-types'
import type { SiteFragment } from '../core/dato/fragments/site.typegen'

export type SeoData = {
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
}

const extractIconsFromTags = (
  faviconTags: Tag[] | null | undefined
): Metadata['icons'] => {
  if (!faviconTags || faviconTags.length === 0) {
    return {
      icon: '/images/favicon.png'
    }
  }

  const icons: Metadata['icons'] = {}
  const iconArray: { url: string; sizes?: string; type?: string }[] = []

  for (const tag of faviconTags) {
    if (!tag.attributes) {
      continue
    }

    const rel = tag.attributes.rel
    const href = tag.attributes.href
    const sizes = tag.attributes.sizes
    const type = tag.attributes.type

    if (!href) {
      continue
    }

    if (rel === 'icon' || rel === 'shortcut icon') {
      iconArray.push({
        url: href,
        sizes: sizes || undefined,
        type: type || undefined
      })
    } else if (rel === 'apple-touch-icon') {
      icons.apple = {
        url: href,
        sizes: sizes || undefined
      }
    }
  }

  if (iconArray.length > 0) {
    icons.icon = iconArray
  }

  if (!icons.icon && !icons.apple) {
    return {
      icon: '/images/favicon.png'
    }
  }

  if (!icons.icon) {
    icons.icon = '/images/favicon.png'
  }

  return icons
}

export const mergeSeoData = (
  pageSeo: SeoData | null | undefined,
  globalSeo: SiteFragment['globalSeo'] | null | undefined
): SeoData => {
  const fallbackSeo = globalSeo?.fallbackSeo

  return {
    title: pageSeo?.title ?? fallbackSeo?.title ?? null,
    description: pageSeo?.description ?? fallbackSeo?.description ?? null,
    image: pageSeo?.image ?? fallbackSeo?.image ?? null,
    noIndex: pageSeo?.noIndex ?? fallbackSeo?.noIndex ?? null,
    twitterCard: pageSeo?.twitterCard ?? fallbackSeo?.twitterCard ?? null
  }
}

export const seoToMetadata = (
  seo: SeoData,
  globalSeo: SiteFragment['globalSeo'] | null | undefined,
  faviconTags?: Tag[] | null
): Metadata => {
  const siteName = globalSeo?.siteName ?? null
  const titleSuffix = globalSeo?.titleSuffix ?? null
  const twitterAccount = globalSeo?.twitterAccount ?? null
  const facebookPageUrl = globalSeo?.facebookPageUrl ?? null

  let title = seo.title ?? siteName ?? 'Untitled'
  if (titleSuffix && seo.title) {
    title = `${seo.title}${titleSuffix}`
  } else if (titleSuffix && !seo.title && siteName) {
    title = `${siteName}${titleSuffix}`
  }

  const metadata: Metadata = {
    title,
    description: seo.description ?? siteName ?? undefined,
    robots: seo.noIndex ? 'noindex, nofollow' : undefined,
    icons: extractIconsFromTags(faviconTags),
    openGraph: {
      title: seo.title ?? undefined,
      description: seo.description ?? undefined,
      images: seo.image?.url
        ? [
            {
              url: seo.image.url,
              alt: seo.image.alt ?? undefined,
              width: seo.image.width ?? undefined,
              height: seo.image.height ?? undefined
            }
          ]
        : undefined,
      siteName: siteName ?? undefined
    },
    twitter: {
      card:
        seo.twitterCard === 'summary' ||
        seo.twitterCard === 'summary_large_image'
          ? seo.twitterCard
          : 'summary',
      title: seo.title ?? undefined,
      description: seo.description ?? undefined,
      images: seo.image?.url ? [seo.image.url] : undefined,
      creator: twitterAccount ?? undefined,
      site: twitterAccount ?? undefined
    }
  }

  if (facebookPageUrl) {
    metadata.other = {
      'fb:app_id': facebookPageUrl
    }
  }

  return metadata
}

export const extractPageSeo = (
  pageSeo:
    | SeoField
    | {
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
      }
    | null
    | undefined
): SeoData | null => {
  if (!pageSeo) {
    return null
  }

  return {
    title: pageSeo.title ?? null,
    description: pageSeo.description ?? null,
    image: pageSeo.image
      ? {
          url: pageSeo.image.url ?? null,
          alt: pageSeo.image.alt ?? null,
          width: pageSeo.image.width ?? null,
          height: pageSeo.image.height ?? null
        }
      : null,
    noIndex: pageSeo.noIndex ?? null,
    twitterCard: pageSeo.twitterCard ?? null
  }
}
