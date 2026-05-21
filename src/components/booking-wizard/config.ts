import { ROUTES } from '../../config/routes'
import type { BookingState } from '../../io/types'

export type BookingWizardPageKey =
  | 'location'
  | 'date_and_car'
  | 'coverage_options'
  | 'ride_along'
  | 'media_packages'
  | 'review'

export type BookingWizardPage = {
  id: BookingWizardPageKey
  enabled: boolean
  path: string
  title?: string
  showCartAside?: boolean
  hasNoPaddings?: boolean
  showAnnouncementBar?: boolean
}

export const bookingWizardConfig = {
  pages: [
    {
      id: 'location',
      enabled: true,
      path: ROUTES.BOOKING.LOCATION,
      showCartAside: false,
      hasNoPaddings: true
    },
    {
      id: 'date_and_car',
      enabled: true,
      path: ROUTES.BOOKING.DATE_AND_CAR,
      showCartAside: true,
      hasNoPaddings: false,
      showAnnouncementBar: true
    },
    {
      id: 'coverage_options',
      enabled: true,
      path: ROUTES.BOOKING.COVERAGE_OPTIONS,
      showCartAside: true,
      hasNoPaddings: false,
      showAnnouncementBar: true
    },
    {
      id: 'ride_along',
      enabled: true,
      path: ROUTES.BOOKING.RIDE_ALONG,
      showCartAside: true,
      hasNoPaddings: false,
      showAnnouncementBar: true
    },
    {
      id: 'media_packages',
      enabled: true,
      path: ROUTES.BOOKING.MEDIA_PACKAGES,
      showCartAside: true,
      hasNoPaddings: false,
      showAnnouncementBar: true
    },
    {
      id: 'review',
      enabled: true,
      path: ROUTES.BOOKING.REVIEW,
      showCartAside: false,
      hasNoPaddings: true
    }
  ] satisfies BookingWizardPage[]
} as const

const START_TIME_24H_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/
const START_TIME_US_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: 'UTC'
})

export const formatStartTimeForUsLocale = (startTime: string): string => {
  const matchedTime = START_TIME_24H_REGEX.exec(startTime)
  if (!matchedTime) {
    return startTime
  }

  const [, hours, minutes] = matchedTime
  const hoursNumber = Number(hours)
  const minutesNumber = Number(minutes)

  const utcDate = new Date(Date.UTC(2000, 0, 1, hoursNumber, minutesNumber))
  return START_TIME_US_FORMATTER.format(utcDate).toLowerCase()
}

export const getNextPagePath = (currentPath: string): string | null => {
  const enabledPages = bookingWizardConfig.pages.filter((page) => page.enabled)
  const currentIndex = enabledPages.findIndex(
    (page) => page.path === currentPath
  )
  if (currentIndex === -1 || currentIndex === enabledPages.length - 1) {
    return null
  }
  const nextPage = enabledPages[currentIndex + 1]
  return nextPage?.path ?? null
}

export const getPreviousPagePath = (currentPath: string): string | null => {
  const enabledPages = bookingWizardConfig.pages.filter((page) => page.enabled)
  const currentIndex = enabledPages.findIndex(
    (page) => page.path === currentPath
  )
  if (currentIndex <= 0) {
    return null
  }
  const previousPage = enabledPages[currentIndex - 1]
  return previousPage?.path ?? null
}

type BookingStateDataKey = keyof Pick<
  BookingState,
  | 'track'
  | 'date_and_car'
  | 'coverage_options'
  | 'ride_along'
  | 'media_packages'
  | 'review'
>

const PAGE_TO_STATE_KEY: Record<BookingWizardPageKey, BookingStateDataKey> = {
  location: 'track',
  date_and_car: 'date_and_car',
  coverage_options: 'coverage_options',
  ride_along: 'ride_along',
  media_packages: 'media_packages',
  review: 'review'
}

const getStateKeyForPage = (
  pageId: BookingWizardPageKey
): BookingStateDataKey => {
  return PAGE_TO_STATE_KEY[pageId]
}

export const isPageDataComplete = (
  pageId: BookingWizardPageKey,
  booking: BookingState | null | undefined
): boolean => {
  if (!booking) {
    return false
  }
  if (pageId === 'location') {
    // Location is considered complete once either selector is set.
    // This prevents unwanted fallback to location while initializer
    // is seeding track/event from URL params.
    return Boolean(booking.track || booking.event)
  }
  const stateKey = getStateKeyForPage(pageId)
  const value = booking[stateKey]
  return value !== null && value !== undefined
}

type PageBlockContext = {
  hasEventOrTrack: boolean
  insuranceSessions: number
  hasOnlyRideAlongs: boolean
}

export const isPageBlockedByRules = (
  pageId: string,
  ctx: PageBlockContext
): boolean => {
  if (pageId === 'coverage_options' && ctx.insuranceSessions === 0) {
    return true
  }
  if (pageId === 'ride_along' && ctx.hasOnlyRideAlongs) {
    return true
  }
  return false
}

export const getMaxAccessiblePageIndex = (
  booking: BookingState | null | undefined
): number => {
  const enabledPages = bookingWizardConfig.pages.filter((page) => page.enabled)

  // If no booking state, only first page is accessible
  if (!booking) {
    return 0
  }

  for (let i = 1; i < enabledPages.length; i++) {
    // Get the previous page - this is what the current page requires
    const previousPage = enabledPages[i - 1]
    if (!previousPage) {
      continue
    }

    // Map the page ID to the corresponding state key
    const previousPageIsComplete = isPageDataComplete(previousPage.id, booking)
    if (!previousPageIsComplete) {
      return i - 1
    }
  }

  // All requirements met, all pages accessible
  return enabledPages.length - 1
}

export const getMaxAccessiblePagePath = (
  booking: BookingState | null | undefined
): string => {
  const enabledPages = bookingWizardConfig.pages.filter((page) => page.enabled)
  const maxIndex = getMaxAccessiblePageIndex(booking)
  return enabledPages[maxIndex]?.path ?? ROUTES.BOOKING.LOCATION
}

export const getRedirectPathIfNeeded = (
  currentPath: string,
  booking: BookingState | null | undefined
): string | null => {
  const enabledPages = bookingWizardConfig.pages.filter((page) => page.enabled)
  const currentIndex = enabledPages.findIndex(
    (page) => page.path === currentPath
  )

  // Path not found in wizard pages, don't redirect
  if (currentIndex === -1) {
    return null
  }

  const maxAccessibleIndex = getMaxAccessiblePageIndex(booking)

  // Current page is beyond what's accessible
  if (currentIndex > maxAccessibleIndex) {
    return enabledPages[maxAccessibleIndex]?.path ?? ROUTES.BOOKING.LOCATION
  }

  return null
}
