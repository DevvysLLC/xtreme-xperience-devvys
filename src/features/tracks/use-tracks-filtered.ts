'use client'

import { distance } from '@turf/distance'
import { useMemo } from 'react'
import type { EventDataFragment } from '../../core/dato/fragments/event-data.typegen'
import type { TrackDataFragment } from '../../core/dato/fragments/track-data.typegen'
import type { MapboxMapMarker, TrackWithDistance } from '../../io/types'
import { useMapboxGeocode } from '../mapbox'
import { useUtilsDebouncedValue } from '../utils'
import { hasAllTracks } from './config'
import { useTracks } from './use-tracks'

const MILES_TO_KILOMETERS = 1.60934
const FILTER_RADIUS_MILES = 200
const FILTER_RADIUS_KM = FILTER_RADIUS_MILES * MILES_TO_KILOMETERS
const SEARCH_DEBOUNCE_MS = 500

type UseFilteredTracksReturn = {
  tracks: TrackDataFragment[]
  tracksWithDistance: TrackWithDistance[]
  filteredTracks: TrackDataFragment[]
  events: EventDataFragment[]
  markers: MapboxMapMarker[]
  searchLocation: { latitude: number; longitude: number } | null
  isLoading: boolean
  isGeocoding: boolean
  error: Error | null
}

const getEventsFromTracks = (
  tracks: TrackDataFragment[]
): EventDataFragment[] => {
  const eventsMap = new Map<string, EventDataFragment>()

  for (const track of tracks) {
    const trackEvents = track.model?.events
    if (!trackEvents) {
      continue
    }

    for (const event of trackEvents) {
      if (!event.model?.enabled) {
        continue
      }

      // Use event.id as the unique key for deduplication
      // (same event may appear across multiple tracks)
      const eventId = event.model.id

      // Skip if we've already seen this event (deduplication)
      if (eventsMap.has(eventId)) {
        continue
      }

      // Store the event as-is without modification
      eventsMap.set(eventId, event)
    }
  }

  // Convert to array and sort events by start date
  return Array.from(eventsMap.values()).sort((a, b) => {
    if (!a.model?.startDate) {
      return 1
    }
    if (!b.model?.startDate) {
      return -1
    }
    return (
      new Date(a.model?.startDate ?? '').getTime() -
      new Date(b.model?.startDate ?? '').getTime()
    )
  })
}

const getMarkersFromTracks = (
  tracks: TrackDataFragment[]
): MapboxMapMarker[] => {
  const markers: MapboxMapMarker[] = []

  for (const track of tracks) {
    const location = track.model?.location
    if (!location?.latitude || !location?.longitude) {
      continue
    }

    markers.push({
      id: track.id,
      latitude: location.latitude,
      longitude: location.longitude,
      label: track.model?.nickname ?? track.config?.title ?? undefined,
      city: track.model?.city ?? undefined,
      state: track.model?.state ?? undefined,
      trackHandle: track.config?.handle ?? undefined
    })
  }

  return markers
}

// Filter tracks by matching search query against track properties
const filterTracksByName = (
  tracks: TrackDataFragment[],
  query: string
): TrackDataFragment[] => {
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) {
    return tracks
  }

  return tracks.filter((track) => {
    const nickname = track.model?.nickname?.toLowerCase() ?? ''
    const city = track.model?.city?.toLowerCase() ?? ''
    const state = track.model?.state?.toLowerCase() ?? ''
    const title = track.config?.title?.toLowerCase() ?? ''
    const address = track.model?.address?.toLowerCase() ?? ''

    return (
      nickname.includes(normalizedQuery) ||
      city.includes(normalizedQuery) ||
      state.includes(normalizedQuery) ||
      title.includes(normalizedQuery) ||
      address.includes(normalizedQuery)
    )
  })
}

export const useTracksFiltered = (
  searchQuery: string
): UseFilteredTracksReturn => {
  const debouncedSearchQuery = useUtilsDebouncedValue(
    searchQuery,
    SEARCH_DEBOUNCE_MS
  )
  const { data: tracksData, isLoading: isLoadingTracks, error } = useTracks()
  const {
    data: geocodeResult,
    isLoading: isGeocoding,
    isFetching: isGeocodeFetching
  } = useMapboxGeocode(debouncedSearchQuery)

  const tracks = useMemo((): TrackDataFragment[] => {
    if (!tracksData || !hasAllTracks(tracksData)) {
      return []
    }
    return tracksData.allTracks
  }, [tracksData])

  const tracksWithDistance = useMemo(() => {
    if (!geocodeResult) {
      return tracks.map((track) => ({
        track,
        distance: Number.POSITIVE_INFINITY
      }))
    }

    const userCoords: [number, number] = [
      geocodeResult.longitude,
      geocodeResult.latitude
    ]

    return tracks
      .map((track) => {
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
      .sort((a, b) => a.distance - b.distance)
  }, [tracks, geocodeResult])

  // First, try to filter tracks by name matching
  const nameMatchedTracks = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return []
    }
    return filterTracksByName(tracks, debouncedSearchQuery)
  }, [tracks, debouncedSearchQuery])

  // Filter tracks by proximity (only if geocoding succeeded)
  const proximityMatchedTracks = useMemo(() => {
    if (!debouncedSearchQuery.trim() || !geocodeResult) {
      return []
    }

    return tracksWithDistance
      .filter((item) => item.distance <= FILTER_RADIUS_KM)
      .map((item) => item.track)
  }, [debouncedSearchQuery, geocodeResult, tracksWithDistance])

  // Combine name matches and proximity matches, prioritizing name matches
  const filteredTracks = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      // No search query, return all tracks
      return tracks
    }

    // If we have name matches, use those (tracks matching the search query by name)
    if (nameMatchedTracks.length > 0) {
      return nameMatchedTracks
    }

    // If no name matches but we have proximity matches, use those
    if (proximityMatchedTracks.length > 0) {
      return proximityMatchedTracks
    }

    // If nothing matches, return all tracks so pins never disappear
    return tracks
  }, [debouncedSearchQuery, tracks, nameMatchedTracks, proximityMatchedTracks])

  // When searching, show all events but with matching track events first.
  // When not searching, filteredTracks === tracks so this returns all events.
  const events = useMemo(() => {
    const filteredEvents = getEventsFromTracks(filteredTracks)

    // No search query or filteredTracks is already all tracks — just return as-is
    if (!debouncedSearchQuery.trim() || filteredTracks === tracks) {
      return filteredEvents
    }

    const allEvents = getEventsFromTracks(tracks)
    const filteredEventIds = new Set(
      filteredEvents.map((e) => e.model?.id).filter(Boolean)
    )
    const remainingEvents = allEvents.filter(
      (e) => !filteredEventIds.has(e.model?.id)
    )

    return [...filteredEvents, ...remainingEvents]
  }, [filteredTracks, tracks, debouncedSearchQuery])

  // Markers should always show tracks - never be empty while we have track data
  // This ensures pins never disappear during typing or loading states
  const markers = useMemo(() => {
    const filteredMarkers = getMarkersFromTracks(filteredTracks)
    // If filtered markers is empty but we have tracks, show all tracks
    if (filteredMarkers.length === 0 && tracks.length > 0) {
      return getMarkersFromTracks(tracks)
    }
    return filteredMarkers
  }, [filteredTracks, tracks])

  // Compute filtered markers separately for reuse in searchLocation
  const filteredMarkers = useMemo(() => {
    return getMarkersFromTracks(filteredTracks)
  }, [filteredTracks])

  // Calculate center point for map focus based on current markers
  const searchLocation = useMemo(() => {
    // If no search query, no search location (show default view)
    if (!debouncedSearchQuery.trim()) {
      return null
    }

    // Use the actual markers array (which never goes empty)
    if (markers.length > 0) {
      // For a single marker, use its location
      if (markers.length === 1) {
        const marker = markers[0]
        if (marker) {
          return {
            latitude: marker.latitude,
            longitude: marker.longitude
          }
        }
      }

      // Check if we have filtered results (not fallback to all tracks)
      if (filteredMarkers.length > 0) {
        // Focus on filtered tracks center
        if (filteredMarkers.length === 1) {
          const marker = filteredMarkers[0]
          if (marker) {
            return {
              latitude: marker.latitude,
              longitude: marker.longitude
            }
          }
        }
        const totalLat = filteredMarkers.reduce((sum, m) => sum + m.latitude, 0)
        const totalLng = filteredMarkers.reduce(
          (sum, m) => sum + m.longitude,
          0
        )
        return {
          latitude: totalLat / filteredMarkers.length,
          longitude: totalLng / filteredMarkers.length
        }
      }
    }

    // Fall back to geocoded location if available
    if (geocodeResult) {
      return {
        latitude: geocodeResult.latitude,
        longitude: geocodeResult.longitude
      }
    }

    return null
  }, [debouncedSearchQuery, geocodeResult, filteredMarkers, markers])

  // Consider debouncing in progress if the search query differs from debounced
  const isDebouncing = searchQuery !== debouncedSearchQuery

  return {
    tracks,
    tracksWithDistance,
    filteredTracks,
    events,
    markers,
    searchLocation,
    isLoading: isLoadingTracks,
    isGeocoding: isDebouncing || isGeocoding || isGeocodeFetching,
    error: error ?? null
  }
}
