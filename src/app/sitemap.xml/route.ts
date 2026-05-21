import { sitemapIndexXml } from '../sitemap/_lib/entries'

export const revalidate = 3600

export const GET = (): Response =>
  new Response(sitemapIndexXml(), {
    headers: { 'Content-Type': 'application/xml' }
  })
