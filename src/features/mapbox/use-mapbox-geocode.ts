'use client'

import { useQuery } from '@tanstack/react-query'
import { MapboxGeocodingResponseSchema } from '../../io/schemas'

const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || null
const GEOCODE_QUERY_KEY = ['mapbox', 'geocode'] as const

type GeocodeResult = {
  latitude: number
  longitude: number
  placeName: string
} | null

export const useMapboxGeocode = (query: string) => {
  return useQuery<GeocodeResult>({
    queryKey: [...GEOCODE_QUERY_KEY, query],
    queryFn: async (): Promise<GeocodeResult> => {
      if (!query.trim() || !MAPBOX_API_KEY) {
        return null
      }

      const encodedQuery = encodeURIComponent(query.trim())
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${MAPBOX_API_KEY}&country=US&types=place,postcode,region,address&limit=1`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to geocode location')
      }

      const jsonData = await response.json()
      const parseResult = MapboxGeocodingResponseSchema.safeParse(jsonData)

      if (!parseResult.success) {
        throw new Error('Invalid geocoding response format')
      }

      const features = parseResult.data.features
      const firstFeature = features[0]
      if (!firstFeature) {
        return null
      }

      const [longitude, latitude] = firstFeature.center

      return {
        latitude,
        longitude,
        placeName: firstFeature.place_name
      }
    },
    enabled: Boolean(query.trim()) && Boolean(MAPBOX_API_KEY),
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  })
}
