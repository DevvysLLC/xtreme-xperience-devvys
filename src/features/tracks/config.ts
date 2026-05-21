import type { GetAllTracksDataQuery } from '../../core/dato/fragments/get-all-tracks-data.typegen'

export const TRACKS_QUERY_KEY = ['frontend', 'tracks'] as const

// Type guard to check if data has the expected structure
export const hasAllTracks = (data: unknown): data is GetAllTracksDataQuery => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'allTracks' in data &&
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    Array.isArray((data as { allTracks: unknown }).allTracks)
  )
}
