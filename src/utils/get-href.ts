import { ROUTES } from '../config/routes'

const FALLBACK_HREF = '#'

type NavigationItem = {
  path?: string | null
  link?: {
    __typename: string
    config?: { handle?: string | null } | null
    entry?: { handle?: string | null } | null
  } | null
}

const buildHrefFromRecord = (typename: string, handle: string): string => {
  switch (typename) {
    case 'SupercarRecord':
      return `${ROUTES.FRONTEND.SUPERCARS.LISTING}/${handle}`
    case 'TrackRecord':
      return `${ROUTES.FRONTEND.TRACKS.LISTING}/${handle}`
    case 'PageRecord':
      return `/${handle}`
    case 'LandingPageRecord':
      return `/landing-page/${handle}`
    default:
      return `/${handle}`
  }
}

export const getHref = (item: NavigationItem): string => {
  // Direct path takes precedence
  if (item.path) {
    return item.path
  }

  const { link } = item

  if (!link) {
    return FALLBACK_HREF
  }

  // Extract handle from config or entry (PageRecord uses entry)
  const handle = link.config?.handle ?? link.entry?.handle

  if (!handle) {
    return FALLBACK_HREF
  }

  return buildHrefFromRecord(link.__typename, handle)
}
