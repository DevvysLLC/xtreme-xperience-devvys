'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

const listeners = new Set<() => void>()

/** Subscribes to query-only navigations. Returns the unsubscribe function. */
export const onQueryChange = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Notifies `onQueryChange` listeners when the query string changes but the pathname
 * doesn't, for example on policy tab links or `router.push('?tab=x')`.
 *
 * Render it once, inside its own `<Suspense>`. It calls useSearchParams(), which makes
 * the nearest Suspense boundary render in the browser. Here that's only this component;
 * in a hook used by the header, it would be every page.
 */
export const QueryChangePublisher = () => {
  const pathname = usePathname()
  const search = useSearchParams().toString()
  const previous = useRef({ pathname, search })

  useEffect(() => {
    const isQueryOnly = pathname === previous.current.pathname && search !== previous.current.search
    previous.current = { pathname, search }
    if (isQueryOnly) {
      listeners.forEach((listener) => listener())
    }
  }, [pathname, search])

  return null
}
