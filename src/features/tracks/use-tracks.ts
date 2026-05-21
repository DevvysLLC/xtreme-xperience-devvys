'use client'

import { useQuery } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import type { ApiTracksGetAllTracksData } from '../../io'
import { ApiTracksGetAllTracksResponseSchema } from '../../io'
import { TRACKS_QUERY_KEY } from './config'

export const useTracks = () => {
  return useQuery<ApiTracksGetAllTracksData>({
    queryKey: TRACKS_QUERY_KEY,
    queryFn: async (): Promise<ApiTracksGetAllTracksData> => {
      const response = await fetch(ROUTES.API.FRONTEND.TRACKS)

      if (!response.ok) {
        throw new Error('Failed to fetch tracks')
      }

      const json: unknown = await response.json()
      const schema = ApiTracksGetAllTracksResponseSchema
      const parseResult = schema.safeParse(json)

      if (!parseResult.success) {
        throw new Error('Invalid response format')
      }

      if (parseResult.data.status !== 'success') {
        throw new Error(parseResult.data.message ?? 'Failed to fetch tracks')
      }

      return parseResult.data.data
    }
  })
}
