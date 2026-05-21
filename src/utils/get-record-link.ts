import { ROUTES } from '../config/routes'

type RecordType = 'track' | 'post' | 'supercar' | 'page' | 'landing-page'

export type RecordConfig = {
  handle: string | null | undefined
}

/**
 * Generates a link for a DatoCMS record based on its type and config.
 * Uses the ROUTES configuration to determine the correct prefix.
 *
 * @param config - The record config containing the handle
 * @param type - The type of record ('track', 'post', 'supercar', 'page', or 'landing-page')
 * @returns The generated link path, or null if handle is missing
 *
 * @example
 * ```ts
 * getRecordLink({ handle: 'nurburgring' }, 'track')
 * // Returns: '/tracks/nurburgring'
 *
 * getRecordLink({ handle: 'my-post' }, 'post')
 * // Returns: '/blog/my-post'
 * ```
 */
export const getRecordLink = (
  config: RecordConfig,
  type: RecordType
): string | null => {
  const { handle } = config

  if (!handle) {
    return null
  }

  switch (type) {
    case 'track':
      return `${ROUTES.FRONTEND.TRACKS.LISTING}/${handle}`
    case 'post':
      return `${ROUTES.FRONTEND.BLOG.LISTING}/${handle}`
    case 'supercar':
      return `${ROUTES.FRONTEND.SUPERCARS.LISTING}/${handle}`
    case 'page':
      // Pages use the catch-all route, so just the handle
      return `/${handle}`
    case 'landing-page':
      return `/landing-page/${handle}`
    default:
      return null
  }
}
