import type { MetadataRoute } from 'next'
import { SITE_URL } from '../config/settings'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/tools/']
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`
  }
}
