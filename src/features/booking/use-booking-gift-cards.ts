'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import type { AddonFragment } from '../../core/dato/fragments/addon.typegen'
import { DEFAULT_RETRY_CONFIG } from './config'

type GiftCardsApiResponse = {
  status: string
  data: {
    addons: AddonFragment[]
  }
}

const isGiftCardsApiResponse = (value: unknown): value is GiftCardsApiResponse => {
  if (value === null || typeof value !== 'object') {
    return false
  }

  if (!('status' in value) || value.status !== 'success') {
    return false
  }

  if (!('data' in value) || value.data === null || typeof value.data !== 'object') {
    return false
  }

  return 'addons' in value.data && Array.isArray(value.data.addons)
}

export const useBookingGiftCards = (): UseQueryResult<AddonFragment[]> => {
  return useQuery({
    queryKey: ['booking', 'gift-cards'],
    queryFn: async (): Promise<AddonFragment[]> => {
      const res = await fetch(ROUTES.API.BOOKING.ADDONS)
      if (!res.ok) {
        throw new Error('Failed to fetch gift cards')
      }
      const json: unknown = await res.json()
      if (isGiftCardsApiResponse(json)) {
        return json.data.addons
      }
      return []
    },
    staleTime: 5 * 60 * 1000,
    ...DEFAULT_RETRY_CONFIG
  })
}
