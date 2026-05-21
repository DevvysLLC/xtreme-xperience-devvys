'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useLocation } from './use-location'
import { deriveSearchLabel } from './utils'

/**
 * Derives a search label from location state:
 * 1. Track nickname takes precedence when available
 * 2. Falls back to closest US state from coordinates
 * 3. Empty string when no location is set
 *
 * Calls `onChange` whenever the derived label changes.
 * Wrap `onChange` in `useCallback` to avoid unnecessary effect re-runs.
 */
export const useLocationSearchLabel = (
  onChange?: (label: string) => void
): string => {
  const { data: location } = useLocation()

  const locationSearchLabel = useMemo(
    () => deriveSearchLabel(location),
    [location]
  )

  const prevSearchLabel = useRef(locationSearchLabel)

  useEffect(() => {
    if (locationSearchLabel === prevSearchLabel.current) {
      return
    }

    prevSearchLabel.current = locationSearchLabel
    onChange?.(locationSearchLabel)
  }, [locationSearchLabel, onChange])

  return locationSearchLabel
}
