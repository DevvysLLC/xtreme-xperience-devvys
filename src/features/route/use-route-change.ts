'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { onQueryChange } from './query-change'

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type RouteChangeCallback = () => (() => void) | void

// Watches the pathname, plus query-only changes published by
// QueryChangePublisher in the (frontend) layout. Calling useSearchParams() here
// would force every page that renders the header to render in the browser.
export const useRouteChange = (
  callback: RouteChangeCallback,
  options?: { immediate?: boolean }
): void => {
  const pathname = usePathname()
  const callbackRef = useRef(callback)
  const cleanupRef = useRef<(() => void) | undefined>(undefined)
  const isFirstRender = useRef(true)
  const previousPathnameRef = useRef<string | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  /** Runs the previous cleanup, then the callback, and stores its new cleanup. */
  const runCallback = useCallback(() => {
    cleanupRef.current?.()
    const result = callbackRef.current()
    cleanupRef.current = typeof result === 'function' ? result : undefined
  }, [])

  // Pathname changes run through the effect below; query-only changes arrive
  // from QueryChangePublisher.
  useEffect(() => onQueryChange(runCallback), [runCallback])

  useEffect(() => {
    const currentPathname = pathname

    if (isFirstRender.current) {
      isFirstRender.current = false
      previousPathnameRef.current = currentPathname

      if (options?.immediate) {
        const result = callbackRef.current()
        cleanupRef.current = typeof result === 'function' ? result : undefined
      }

      return () => {
        if (cleanupRef.current) {
          cleanupRef.current()
          cleanupRef.current = undefined
        }
      }
    }

    const previousPathname = previousPathnameRef.current

    const hasPathnameChanged = previousPathname !== currentPathname

    if (hasPathnameChanged) {
      runCallback()
      previousPathnameRef.current = currentPathname
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = undefined
      }
    }
  }, [pathname, options?.immediate, runCallback])
}
