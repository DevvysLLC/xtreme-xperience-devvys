'use client'

import { usePathname, useRouter } from 'next/navigation'
import { type FC, type ReactNode, useEffect, useRef, useState } from 'react'
import { ROUTES } from '../../../../config/routes'
import { logger } from '../../../../core/logger/logger'
import {
  useBookingRequestBackNavigation,
  useBookingSetCurrentPage,
  useBookingSetIntendedPage,
  useBookingWithCart
} from '../../../../features/booking'
import { CoreLoadingGuard } from '../../../core-loading-guard/index'
import { useGlobalConfig } from '../../../global-config/context'
import { isSubmittedPageValid } from '../../../wizard-contract'
import {
  bookingWizardConfig,
  getMaxAccessiblePageIndex,
  isPageBlockedByRules,
  isPageDataComplete
} from '../../config'

type Props = { children: ReactNode }

const LOG_PREFIX = 'booking-wizard-guard'
const enabledPages = bookingWizardConfig.pages.filter((p) => p.enabled)

export const BookingWizardGuard: FC<Props> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { booking, cart, isLoading, isUpdating } = useBookingWithCart()
  const { bookingEnableLegacyBooking } = useGlobalConfig()
  const { mutate: setCurrentPage } = useBookingSetCurrentPage()
  const { mutate: requestBackNavigation } = useBookingRequestBackNavigation()
  const { mutate: setIntendedPage } = useBookingSetIntendedPage()

  const currentPageConfig = enabledPages.find((p) => p.path === pathname)

  useEffect(() => {
    if (currentPageConfig) {
      setCurrentPage(currentPageConfig.id)
    }
  }, [currentPageConfig, setCurrentPage])

  const [isGuardActive, setIsGuardActive] = useState(true)
  const handledSubmitAtByPageRef = useRef<Record<string, string | null>>({})
  const lastHandledBackNavigationRequestedAtRef = useRef<string | null>(null)
  const hasReachedReadyStateRef = useRef(false)

  useEffect(() => {
    const hasEventOrTrack = Boolean(booking?.event) || Boolean(booking?.track)
    const intendedPageId = booking?.intendedPageId ?? null
    const maxAccessibleIndex = getMaxAccessiblePageIndex(booking)
    const maxAccessiblePage = enabledPages[maxAccessibleIndex]
    const currentPageIndex = enabledPages.findIndex((p) => p.path === pathname)
    const dateAndCarIndex = enabledPages.findIndex(
      (p) => p.id === 'date_and_car'
    )

    const blockCtx = {
      hasEventOrTrack,
      insuranceSessions: cart.contents.insuranceSessions,
      hasOnlyRideAlongs: cart.contents.hasOnlyRideAlongs
    }

    const isBlocked = (pageId: string) => isPageBlockedByRules(pageId, blockCtx)

    const navigateTo = (path: string) => {
      hasReachedReadyStateRef.current = false
      setIsGuardActive(true)
      router.replace(path)
    }

    // 1
    // Wait for data ...
    if (isLoading || isUpdating) {
      // Avoid spinner remounts from background refreshes once this route
      // has already reached a stable ready state.
      if (hasReachedReadyStateRef.current) {
        logger.info(
          { pathname, isLoading, isUpdating },
          `${LOG_PREFIX}: [wait] background loading while ready; keeping guard inactive`
        )
        return
      }

      logger.info(
        { pathname, isLoading, isUpdating },
        `${LOG_PREFIX}: [wait] loading booking/cart state`
      )
      setIsGuardActive(true)
      return
    }

    // 2
    // HARD REDIRECTS — always evaluated even when a navigation is in flight,
    // because state may have changed (e.g. initializer set track/event).
    // 2a: HOME route — always redirects (it's an entry point, not a page)
    if (pathname === ROUTES.BOOKING.HOME) {
      if (!hasEventOrTrack) {
        const target = bookingEnableLegacyBooking
          ? ROUTES.FRONTEND.EVENTS.LISTING
          : ROUTES.BOOKING.LOCATION
        logger.info(
          { pathname, target, hasEventOrTrack },
          `${LOG_PREFIX}: [hard-redirect] HOME with no booking`
        )
        if (target === ROUTES.BOOKING.LOCATION) {
          setIntendedPage('location')
        }
        navigateTo(target)
        return
      }

      const targetPage =
        intendedPageId !== null
          ? enabledPages.find((p) => p.id === intendedPageId)
          : null
      const intendedIsStaleLocation =
        targetPage?.id === 'location' &&
        hasEventOrTrack &&
        maxAccessibleIndex > 0
      const intendedIsAccessible =
        targetPage !== undefined &&
        targetPage !== null &&
        enabledPages.indexOf(targetPage) <= maxAccessibleIndex &&
        !isBlocked(targetPage.id) &&
        !intendedIsStaleLocation
      const resolvedPage = intendedIsAccessible ? targetPage : maxAccessiblePage
      const resolvedPath = resolvedPage?.path ?? ROUTES.BOOKING.LOCATION
      const resolvedId = resolvedPage?.id ?? 'location'

      logger.info(
        {
          pathname,
          resolvedPath,
          resolvedId,
          intendedPageId,
          maxAccessibleIndex
        },
        `${LOG_PREFIX}: [hard-redirect] HOME with booking`
      )
      if (intendedPageId !== resolvedId) {
        setIntendedPage(resolvedId)
      }
      navigateTo(resolvedPath)
      return
    }

    // 2b: No event/track on non-location page
    if (!hasEventOrTrack && pathname !== ROUTES.BOOKING.LOCATION) {
      logger.info(
        { pathname, hasEventOrTrack },
        `${LOG_PREFIX}: [hard-redirect] no event/track → location`
      )
      setIntendedPage('location')
      navigateTo(ROUTES.BOOKING.LOCATION)
      return
    }

    // 2c: No cars in cart on pages beyond date_and_car
    if (
      !cart.contents.hasCars &&
      currentPageIndex > dateAndCarIndex &&
      currentPageIndex >= 0
    ) {
      logger.info(
        {
          pathname,
          hasCars: cart.contents.hasCars,
          currentPageIndex,
          dateAndCarIndex
        },
        `${LOG_PREFIX}: [hard-redirect] no cars in cart → date_and_car`
      )
      setIntendedPage('date_and_car')
      navigateTo(ROUTES.BOOKING.DATE_AND_CAR)
      return
    }

    // 2d: Current page beyond max accessible
    if (currentPageIndex > maxAccessibleIndex && currentPageIndex >= 0) {
      const targetPath = maxAccessiblePage?.path ?? ROUTES.BOOKING.LOCATION
      const targetId = maxAccessiblePage?.id ?? 'location'
      logger.info(
        { pathname, currentPageIndex, maxAccessibleIndex, targetPath },
        `${LOG_PREFIX}: [hard-redirect] beyond max accessible`
      )
      setIntendedPage(targetId)
      navigateTo(targetPath)
      return
    }

    // 2e: Current page is blocked by cart/booking rules
    //     (location when event/track exist, coverage when no insurance
    //      sessions, ride-along when hasOnlyRideAlongs)
    const currentEnabledPage = enabledPages[currentPageIndex]
    if (
      currentPageIndex >= 0 &&
      currentEnabledPage &&
      isBlocked(currentEnabledPage.id)
    ) {
      let targetIndex = currentPageIndex + 1
      let candidate = enabledPages[targetIndex]
      while (
        targetIndex < enabledPages.length &&
        candidate &&
        isBlocked(candidate.id)
      ) {
        targetIndex++
        candidate = enabledPages[targetIndex]
      }
      const targetPage = candidate ?? enabledPages[dateAndCarIndex]

      if (targetPage) {
        logger.info(
          {
            pathname,
            blockedPageId: currentEnabledPage.id,
            targetPath: targetPage.path,
            targetId: targetPage.id,
            hasEventOrTrack,
            insuranceSessions: cart.contents.insuranceSessions,
            hasOnlyRideAlongs: cart.contents.hasOnlyRideAlongs
          },
          `${LOG_PREFIX}: [hard-redirect] page blocked by rules`
        )
        setIntendedPage(targetPage.id)
        navigateTo(targetPage.path)
        return
      }
    }

    // 3
    // BACK REQUEST
    const backNavigationRequestedAt = booking?.backNavigationRequestedAt ?? null
    const backNavigationFromPath = booking?.backNavigationFromPath ?? null
    const hasNewBackNavigationRequest = Boolean(
      backNavigationRequestedAt &&
        backNavigationRequestedAt !==
          lastHandledBackNavigationRequestedAtRef.current
    )

    if (hasNewBackNavigationRequest) {
      lastHandledBackNavigationRequestedAtRef.current =
        backNavigationRequestedAt
      requestBackNavigation(null)

      if (backNavigationFromPath === pathname) {
        let prevIndex = currentPageIndex - 1
        while (prevIndex >= 0) {
          const prev = enabledPages[prevIndex]
          if (!prev || !isBlocked(prev.id)) {
            break
          }
          prevIndex--
        }
        const previousPage = prevIndex >= 0 ? enabledPages[prevIndex] : null

        if (previousPage && prevIndex <= maxAccessibleIndex) {
          logger.info(
            {
              pathname,
              previousPath: previousPage.path,
              previousPageId: previousPage.id,
              intendedPageId
            },
            `${LOG_PREFIX}: [back-request] navigating to previous page`
          )
          setIntendedPage(previousPage.id)
          navigateTo(previousPage.path)
          return
        }

        logger.info(
          { pathname, backNavigationFromPath },
          `${LOG_PREFIX}: [back-request] no valid previous page`
        )
      } else {
        logger.info(
          { pathname, backNavigationFromPath },
          `${LOG_PREFIX}: [back-request] stale (fromPath !== pathname), ignoring`
        )
      }
    }

    // 4
    // SUBMIT EVENT ──────────────────────────────────────────
    const currentPage = enabledPages.find((p) => p.path === pathname) ?? null

    if (currentPage) {
      const currentPageIsComplete = isPageDataComplete(currentPage.id, booking)
      const currentPageState =
        currentPage.id === 'location' ? null : booking?.[currentPage.id]
      const pageWasSubmittedAndValid = isSubmittedPageValid(currentPageState)
      const currentPageSubmitAt = currentPageState?.lastSubmittedAt ?? null
      const hasSeenCurrentPage = Object.hasOwn(
        handledSubmitAtByPageRef.current,
        currentPage.id
      )

      if (!hasSeenCurrentPage) {
        logger.info(
          {
            pathname,
            pageId: currentPage.id,
            currentPageSubmitAt,
            intendedPageId
          },
          `${LOG_PREFIX}: [submit] first visit, recording baseline`
        )
        handledSubmitAtByPageRef.current[currentPage.id] = currentPageSubmitAt
      } else {
        const lastHandledSubmitAt =
          handledSubmitAtByPageRef.current[currentPage.id] ?? null
        const hasNewSubmitEvent = Boolean(
          currentPageSubmitAt && currentPageSubmitAt !== lastHandledSubmitAt
        )

        if (
          hasNewSubmitEvent &&
          currentPageIsComplete &&
          pageWasSubmittedAndValid
        ) {
          handledSubmitAtByPageRef.current[currentPage.id] = currentPageSubmitAt

          if (currentPage.id === 'review') {
            logger.info(
              {
                pathname,
                pageId: currentPage.id,
                currentPageSubmitAt,
                intendedPageId
              },
              `${LOG_PREFIX}: [submit] review complete → checkout contacts`
            )
            setIntendedPage(null)
            navigateTo(ROUTES.CHECKOUT.CONTACTS)
            return
          }

          let nextIndex = currentPageIndex + 1
          while (nextIndex < enabledPages.length) {
            const next = enabledPages[nextIndex]
            if (!next || !isBlocked(next.id)) {
              break
            }
            nextIndex++
          }
          const nextPage = enabledPages[nextIndex] ?? null

          if (nextPage) {
            logger.info(
              {
                pathname,
                nextPath: nextPage.path,
                nextPageId: nextPage.id,
                intendedPageId
              },
              `${LOG_PREFIX}: [submit] navigating to next page`
            )
            setIntendedPage(nextPage.id)
            navigateTo(nextPage.path)
            return
          }

          logger.info(
            { pathname },
            `${LOG_PREFIX}: [submit] no next page, staying on current`
          )
        } else if (hasNewSubmitEvent) {
          logger.info(
            {
              pathname,
              pageId: currentPage.id,
              currentPageIsComplete,
              pageWasSubmittedAndValid
            },
            `${LOG_PREFIX}: [submit] event ignored (incomplete or invalid)`
          )
        }
      }
    }

    // 5
    // CANONICALIZE
    if (intendedPageId === null || intendedPageId === undefined) {
      const targetPage = maxAccessiblePage
      const targetPath = targetPage?.path ?? ROUTES.BOOKING.LOCATION
      const targetId = targetPage?.id ?? 'location'

      logger.info(
        { pathname, targetPath, targetId, maxAccessibleIndex },
        `${LOG_PREFIX}: [canonicalize] no intended page set`
      )
      setIntendedPage(targetId)

      if (pathname !== targetPath) {
        navigateTo(targetPath)
        return
      }

      logger.info(
        { pathname, intendedPageId: targetId, maxAccessibleIndex },
        `${LOG_PREFIX}: [ready] canonicalized in place`
      )
      hasReachedReadyStateRef.current = true
      setIsGuardActive(false)
      return
    }

    // 6
    // ENFORCE INTENDED
    const intendedPage = enabledPages.find((p) => p.id === intendedPageId)

    if (!intendedPage) {
      logger.info(
        { pathname, intendedPageId },
        `${LOG_PREFIX}: [enforce] invalid intendedPageId, clearing`
      )
      setIntendedPage(null)
      setIsGuardActive(true)
      return
    }

    const intendedIndex = enabledPages.indexOf(intendedPage)

    if (intendedIndex > maxAccessibleIndex || isBlocked(intendedPage.id)) {
      const fallbackPath = maxAccessiblePage?.path ?? ROUTES.BOOKING.LOCATION
      const fallbackId = maxAccessiblePage?.id ?? 'location'
      logger.info(
        {
          pathname,
          intendedPageId,
          intendedIndex,
          maxAccessibleIndex,
          isBlocked: isBlocked(intendedPage.id),
          fallbackPath
        },
        `${LOG_PREFIX}: [enforce] intended page not accessible or blocked, falling back`
      )
      setIntendedPage(fallbackId)
      navigateTo(fallbackPath)
      return
    }

    if (pathname !== intendedPage.path) {
      logger.info(
        { pathname, intendedPageId, intendedPath: intendedPage.path },
        `${LOG_PREFIX}: [enforce] pathname mismatch, redirecting to intended`
      )
      navigateTo(intendedPage.path)
      return
    }

    // 7
    // READY
    logger.info(
      { pathname, intendedPageId, maxAccessibleIndex },
      `${LOG_PREFIX}: [ready] guard passed`
    )
    hasReachedReadyStateRef.current = true
    setIsGuardActive(false)
  }, [
    isLoading,
    isUpdating,
    pathname,
    router,
    booking,
    cart.contents.hasCars,
    cart.contents.insuranceSessions,
    cart.contents.hasOnlyRideAlongs,
    requestBackNavigation,
    setIntendedPage,
    bookingEnableLegacyBooking
  ])

  const shouldShowGuard = isGuardActive || isUpdating

  if (shouldShowGuard) {
    return (
      <>
        {children}
        <CoreLoadingGuard />
      </>
    )
  }

  return <>{children}</>
}
