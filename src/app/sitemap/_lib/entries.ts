import { SITE_URL } from '../../../config/settings'
import { fetchAllRecords } from '../../../core/dato/fetch-all-records'
import { initDatoSdk, type Sdk } from '../../../core/dato/sdk'
import { safeAwait } from '../../../core/errors/safe-await'
import { initLogger } from '../../../core/logger'
import { getRecordLink } from '../../../utils/get-record-link'

const makeUrl = (path: string): string => `${SITE_URL}${path}`

const logger = initLogger().child({ name: 'sitemap' })

type SitemapEntry = {
  url: string
  lastModified?: string
  changeFrequency?: string
  priority?: number
}

type ContentRecord = {
  _updatedAt: string
  config: {
    handle: string | null
    seo: { noIndex: boolean | null } | null
  }
}

const mapRecords = (
  records: ContentRecord[],
  type: Parameters<typeof getRecordLink>[1],
  defaults?: Pick<SitemapEntry, 'changeFrequency' | 'priority'>
): SitemapEntry[] =>
  records.flatMap((record) => {
    const handle = record.config.handle
    if (!handle || record.config.seo?.noIndex) {
      return []
    }

    const path = getRecordLink({ handle }, type)
    if (!path) {
      return []
    }

    return [
      {
        url: makeUrl(path),
        lastModified: record._updatedAt,
        changeFrequency: defaults?.changeFrequency ?? 'weekly',
        priority: defaults?.priority ?? 0.7
      }
    ]
  })

const getPageEntries = async (sdk: Sdk): Promise<SitemapEntry[]> => {
  const staticEntries: SitemapEntry[] = [
    { url: makeUrl('/'), changeFrequency: 'daily', priority: 1.0 },
    { url: makeUrl('/blog'), changeFrequency: 'daily', priority: 0.8 }
  ]

  const [error, pages] = await safeAwait(
    fetchAllRecords(async (vars) => {
      const { allPages } = await sdk.sitemapPages(vars)
      return allPages
    })
  )
  if (error) {
    logger.error(error, 'Failed to fetch page entries')
    return staticEntries
  }

  return [...staticEntries, ...mapRecords(pages, 'page')]
}

const getTrackEntries = async (sdk: Sdk): Promise<SitemapEntry[]> => {
  const [error, tracks] = await safeAwait(
    fetchAllRecords(async (vars) => {
      const { allTracks } = await sdk.sitemapTracks(vars)
      return allTracks
    })
  )
  if (error) {
    logger.error(error, 'Failed to fetch track entries')
    return []
  }
  return mapRecords(tracks, 'track')
}

const getSupercarEntries = async (sdk: Sdk): Promise<SitemapEntry[]> => {
  const [error, supercars] = await safeAwait(
    fetchAllRecords(async (vars) => {
      const { allSupercars } = await sdk.sitemapSupercars(vars)
      return allSupercars
    })
  )
  if (error) {
    logger.error(error, 'Failed to fetch supercar entries')
    return []
  }
  const filtered = supercars.filter((sc) => {
    const handle = sc.config?.handle ?? ''
    return !handle.endsWith('-or') && handle !== 'drift-xperience-by-team-oneil'
  })
  return mapRecords(filtered, 'supercar')
}

const getBlogEntries = async (sdk: Sdk): Promise<SitemapEntry[]> => {
  const [error, posts] = await safeAwait(
    fetchAllRecords(async (vars) => {
      const { allPosts } = await sdk.sitemapPosts(vars)
      return allPosts
    })
  )
  if (error) {
    logger.error(error, 'Failed to fetch blog entries')
    return []
  }
  return mapRecords(posts, 'post', {
    changeFrequency: 'monthly',
    priority: 0.6
  })
}

export const SEGMENTS = ['pages', 'tracks', 'supercars', 'blog'] as const
export type Segment = (typeof SEGMENTS)[number]

const SEGMENT_SET: ReadonlySet<string> = new Set(SEGMENTS)
export const isSegment = (value: string): value is Segment =>
  SEGMENT_SET.has(value)

const SEGMENT_FETCHERS: Record<Segment, (sdk: Sdk) => Promise<SitemapEntry[]>> =
  {
    pages: getPageEntries,
    tracks: getTrackEntries,
    supercars: getSupercarEntries,
    blog: getBlogEntries
  }

export const getEntriesForSegment = (
  segment: Segment
): Promise<SitemapEntry[]> => {
  const sdk = initDatoSdk()
  return SEGMENT_FETCHERS[segment](sdk)
}

const escapeXml = (str: string): string =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const entriesToXml = (entries: SitemapEntry[]): string => {
  const urls = entries
    .map((entry) => {
      const parts = [`    <loc>${escapeXml(entry.url)}</loc>`]
      if (entry.lastModified) {
        parts.push(`    <lastmod>${entry.lastModified}</lastmod>`)
      }
      if (entry.changeFrequency) {
        parts.push(`    <changefreq>${entry.changeFrequency}</changefreq>`)
      }
      if (entry.priority !== undefined) {
        parts.push(`    <priority>${entry.priority}</priority>`)
      }
      return `  <url>\n${parts.join('\n')}\n  </url>`
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>'
  ].join('\n')
}

export const sitemapIndexXml = (): string => {
  const sitemaps = SEGMENTS.map(
    (name) =>
      `  <sitemap>\n    <loc>${escapeXml(SITE_URL)}/sitemap/${name}.xml</loc>\n  </sitemap>`
  ).join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/sitemap-index.xsl"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    sitemaps,
    '</sitemapindex>'
  ].join('\n')
}
