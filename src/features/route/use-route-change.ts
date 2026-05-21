'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type RouteChangeCallback = () => (() => void) | void

export const useRouteChange = (
  callback: RouteChangeCallback,
  options?: { immediate?: boolean }
): void => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const callbackRef = useRef(callback)
  const cleanupRef = useRef<(() => void) | undefined>(undefined)
  const isFirstRender = useRef(true)
  const previousPathnameRef = useRef<string | null>(null)
  const previousSearchParamsRef = useRef<string | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const currentPathname = pathname
    const currentSearchParams = searchParams.toString()

    if (isFirstRender.current) {
      isFirstRender.current = false
      previousPathnameRef.current = currentPathname
      previousSearchParamsRef.current = currentSearchParams

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
    const previousSearchParams = previousSearchParamsRef.current

    const hasPathnameChanged = previousPathname !== currentPathname
    const hasSearchParamsChanged = previousSearchParams !== currentSearchParams

    if (hasPathnameChanged || hasSearchParamsChanged) {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = undefined
      }

      const result = callbackRef.current()
      cleanupRef.current = typeof result === 'function' ? result : undefined

      previousPathnameRef.current = currentPathname
      previousSearchParamsRef.current = currentSearchParams
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = undefined
      }
    }
  }, [pathname, searchParams, options?.immediate])
}
