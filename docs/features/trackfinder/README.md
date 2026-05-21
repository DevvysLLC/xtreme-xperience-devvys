# Trackfinder Feature

## Overview

The trackfinder feature enables users to find tracks by location, search for tracks by address or place name, and manage their selected home track. It integrates with Mapbox geocoding API for location search and calculates distances to sort tracks.

- User sets location → Tracks fetched → Sorted by distance → User selects track → Location state updated
- Location state persisted to localStorage and synchronized via React Query
- Mapbox geocoding used for address/place name searches with debouncing

- [Client Docs](./client/readme.md) — Client-facing, digestible overview
- [Flow Diagrams](./diagrams.md) — Technical flow diagrams for developers

## Hooks

### useTracks

Fetches all tracks from the API. Returns React Query result with tracks data.

**Location:** `src/hooks/use-tracks/use-tracks.ts`

### useTracksFiltered

Filters tracks based on search criteria or other filters.

**Location:** `src/hooks/use-tracks/use-tracks-filtered.ts`

### useTracksSortedByDistance

Sorts tracks by distance from user's location or geocoded search query. Uses Mapbox geocoding for search queries and calculates distances using Turf.js. Returns sorted tracks with distance information and nearest track flag.

**Location:** `src/hooks/use-tracks/use-tracks-sorted-by-distance.ts`

### useTracksStates

Fetches or accesses track states data.

**Location:** `src/hooks/use-tracks/use-tracks-states.ts`

### useTrackEvents

Accesses events for a specific track.

**Location:** `src/hooks/use-tracks/use-track-events.ts`

### useTrackNextEvent

Calculates the next upcoming event for a track and remaining event count. Filters enabled events with valid future dates and returns the soonest event.

**Location:** `src/hooks/use-tracks/use-track-next-event.ts`

### useLocation

Main hook to access location state. Returns React Query result with latitude, longitude, accuracy, timestamp, label, track, error, and loading state.

**Location:** `src/hooks/use-location/use-location.ts`

### useLocationBrowser

Manages browser location API integration for getting user's current location.

**Location:** `src/hooks/use-location/use-location-browser.ts`

### useLocationClear

Mutation hook to clear location state.

**Location:** `src/hooks/use-location/use-location-clear.ts`

### useLocationGetBrowserLocation

Mutation hook to get user's current location using browser geolocation API.

**Location:** `src/hooks/use-location/use-location-get-browser-location.ts`

### useLocationSetTrack

Mutation hook to set the selected track in location state. Updates location store with track data.

**Location:** `src/hooks/use-location/use-location-set-track.ts`

### useLocationUpdate

Mutation hook to update location with new coordinates, label, and accuracy data. Validates input with schema before updating.

**Location:** `src/hooks/use-location/use-location-update.ts`

### useMapboxGeocode

Query hook to geocode a search query using Mapbox Geocoding API. Returns latitude, longitude, and place name. Includes debouncing and caching (5 minutes).

**Location:** `src/hooks/use-mapbox/use-mapbox-geocode.ts`

## Components
