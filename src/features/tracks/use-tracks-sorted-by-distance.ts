'use client'

import { distance } from '@turf/distance'
import { useMemo } from 'react'
import type { TrackDataFragment } from '../../core/dato/fragments/track-data.typegen'
import { useLocation } from '../location'
import { useMapboxGeocode } from '../mapbox'
import { useUtilsDebouncedValue } from '../utils'
import { hasAllTracks } from './config'
import { useTracks } from './use-tracks'

const SEARCH_DEBOUNCE_MS = 500

type TrackWithDistance = {
  track: TrackDataFragment
  distance: number
  isNearestTrack?: boolean
}

type UseTracksSortedByDistanceReturn = {
  data: TrackWithDistance[]
  tracks: TrackDataFragment[]
  hasLocation: boolean
  isLoading: boolean
  isError: boolean
  isGeocoding: boolean
}

type UseTracksSortedByDistanceOptions = {
  searchQuery?: string
  /** Explicit coordinates override — skips geocoding when provided */
  coordinates?: { latitude: number; longitude: number } | null
}

export const useTracksSortedByDistance = (
  options: UseTracksSortedByDistanceOptions = {}
): UseTracksSortedByDistanceReturn => {
  const { searchQuery = '', coordinates = null } = options
  const debouncedSearchQuery = useUtilsDebouncedValue(
    searchQuery,
    SEARCH_DEBOUNCE_MS
  )
  const { data: location } = useLocation()
  const { data: tracksData, isLoading, isError } = useTracks()
  const {
    data: geocodeResult,
    isLoading: isGeocoding,
    isFetching: isGeocodeFetching
  } = useMapboxGeocode(debouncedSearchQuery)

  // Determine which coordinates to use for distance calculation
  // Priority: 1. Explicit coordinates, 2. Geocoded search result, 3. User's stored location
  const sortCoordinates = useMemo(() => {
    if (coordinates) {
      return coordinates
    }
    if (geocodeResult) {
      return {
        latitude: geocodeResult.latitude,
        longitude: geocodeResult.longitude
      }
    }
    if (location?.latitude && location?.longitude) {
      return {
        latitude: location.latitude,
        longitude: location.longitude
      }
    }
    return null
  }, [coordinates, geocodeResult, location?.latitude, location?.longitude])

  const sortedTracksByDistance = useMemo((): TrackWithDistance[] => {
    if (!tracksData || !hasAllTracks(tracksData)) {
      return []
    }

    const tracks = tracksData.allTracks
    const homeTrack = location?.track

    // Helper to prepend home track to a list
    const prependHomeTrack = (
      trackList: TrackWithDistance[]
    ): TrackWithDistance[] => {
      if (!homeTrack) {
        return trackList
      }

      const homeTrackItem = trackList.find(
        (item) => item.track.id === homeTrack.id
      )

      if (homeTrackItem) {
        const tracksWithoutHome = trackList.filter(
          (item) => item.track.id !== homeTrack.id
        )
        return [
          { ...homeTrackItem, isNearestTrack: false },
          ...tracksWithoutHome
        ]
      }

      // Home track not in list, prepend it
      return [
        { track: homeTrack, distance: 0, isNearestTrack: false },
        ...trackList
      ]
    }

    if (!sortCoordinates) {
      const tracksWithoutDistance = tracks.map((track) => ({
        track,
        distance: Number.POSITIVE_INFINITY,
        isNearestTrack: false
      }))
      return prependHomeTrack(tracksWithoutDistance)
    }

    const userCoords: [number, number] = [
      sortCoordinates.longitude,
      sortCoordinates.latitude
    ]

    const tracksWithDistance: TrackWithDistance[] = tracks.map((track) => {
      const trackLocation = track.model?.location

      if (!trackLocation?.latitude || !trackLocation?.longitude) {
        return {
          track,
          distance: Number.POSITIVE_INFINITY
        }
      }

      const trackCoords: [number, number] = [
        trackLocation.longitude,
        trackLocation.latitude
      ]

      const dist = distance(userCoords, trackCoords, { units: 'kilometers' })

      return {
        track,
        distance: dist
      }
    })

    // Sort by distance
    const sortedTracks = tracksWithDistance.sort(
      (a, b) => a.distance - b.distance
    )

    // Find the actual nearest track (first track that is not the home track)
    let nearestTrackId: string | null = null
    if (sortedTracks.length > 0) {
      const firstNonHomeTrack = homeTrack
        ? sortedTracks.find((item) => item.track.id !== homeTrack.id)
        : sortedTracks[0]
      if (firstNonHomeTrack) {
        nearestTrackId = firstNonHomeTrack.track.id
      }
    }

    // Mark the nearest track
    const tracksWithNearestFlag = sortedTracks.map((item) => ({
      ...item,
      isNearestTrack: item.track.id === nearestTrackId
    }))

    return prependHomeTrack(tracksWithNearestFlag)
  }, [tracksData, sortCoordinates, location?.track])

  // Consider debouncing in progress if the search query differs from debounced
  const isDebouncing = searchQuery !== debouncedSearchQuery

  return {
    data: sortedTracksByDistance,
    tracks: sortedTracksByDistance.map((item) => item.track),
    hasLocation: Boolean(sortCoordinates),
    isLoading,
    isError,
    isGeocoding: isDebouncing || isGeocoding || isGeocodeFetching
  }
}
