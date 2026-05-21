/**
 * Site configuration for structured data (JSON-LD)
 */

import { SITE_URL } from '../../config/settings'

export const STRUCTURED_DATA_CONFIG = {
  siteUrl: SITE_URL,
  siteName: 'Xtreme Xperience',
  siteDescription: "Race Exotic Cars on a Track Near You - It's Your Turn!",
  language: 'en-US'
} as const
