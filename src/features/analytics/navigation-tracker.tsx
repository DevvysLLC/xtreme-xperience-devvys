'use client'

import { usePathname } from 'next/navigation'
import { type FC, useEffect, useRef } from 'react'
import { useAnalyticsGA4Event } from './use-analytics-ga4-event'

export const NavigationTracker: FC = () => {
  const pathname = usePathname()
  const prevPathname = useRef(pathname)
  const { trackPageView, trackRouterNavigate } = useAnalyticsGA4Event()

  useEffect(() => {
    if (prevPathname.current === pathname) {
      return
    }

    const from = prevPathname.current
    prevPathname.current = pathname

    trackRouterNavigate({ from, to: pathname })

    trackPageView({
      page_location: window.location.href,
      page_referrer: `${window.location.origin}${from}`,
      page_title: document.title
    })
  }, [pathname, trackPageView, trackRouterNavigate])

  return null
}
