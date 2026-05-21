'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import type { TrackDataFragment } from '../../core/dato/fragments/track-data.typegen'
import { BOOKING_QUERY_KEYS, DEFAULT_RETRY_CONFIG } from './config'

type TrackApiResponse = {
  status: 'success' | 'error'
  data?: {
    track: TrackDataFragment
  }
  message?: string
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const isTrackApiResponse = (value: unknown): value is TrackApiResponse => {
  if (!isRecord(value)) {
    return false
  }

  const status = value.status

  if (typeof status !== 'string') {
    return false
  }

  if (status !== 'success' && status !== 'error') {
    return false
  }

  return true
}

export type UseBookingTrackOptions = {
  handle: string
  enabled?: boolean
}

export const useBookingTrack = (
  options: UseBookingTrackOptions
): UseQueryResult<TrackDataFragment | null> => {
  const { handle, enabled = true } = options

  return useQuery({
    queryKey: BOOKING_QUERY_KEYS.tracks.detail(handle),
    queryFn: async (): Promise<TrackDataFragment | null> => {
      const url = ROUTES.API.FRONTEND.TRACK_BY_HANDLE(handle)
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch track: ${response.statusText}`)
      }

      const json = await response.json()

      if (!isTrackApiResponse(json)) {
        throw new Error('Invalid API response format')
      }

      if (json.status === 'error' || !json.data?.track) {
        throw new Error(json.message || 'Track not found')
      }

      return json.data.track
    },
    enabled: enabled && Boolean(handle),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    ...DEFAULT_RETRY_CONFIG
  })
}

export type UseBookingTrackReturn = ReturnType<typeof useBookingTrack>
