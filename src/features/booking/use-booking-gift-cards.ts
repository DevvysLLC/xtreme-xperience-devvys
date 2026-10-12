'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import type { AddonFragment } from '../../core/dato/fragments/addon.typegen'
import { DEFAULT_RETRY_CONFIG } from './config'

export const useBookingGiftCards = (): UseQueryResult<AddonFragment[]> => {
  return useQuery({
    queryKey: ['booking', 'gift-cards'],
    queryFn: async (): Promise<AddonFragment[]> => {
      const res = await fetch(ROUTES.API.BOOKING.ADDONS)
      if (!res.ok) {
        throw new Error('Failed to fetch gift cards')
      }
      const json = await res.json()
      if (json.status !== 'success' || !json.data?.addons) {
        return []
      }
      return json.data.addons as AddonFragment[]
    },
    staleTime: 5 * 60 * 1000,
    ...DEFAULT_RETRY_CONFIG
  })
}
