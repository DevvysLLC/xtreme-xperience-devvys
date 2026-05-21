'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'
import type { EventDataFragment } from '../../../core/dato/fragments/event-data.typegen'
import type { TrackDataFragment } from '../../../core/dato/fragments/track-data.typegen'
import { initMainBus } from '../../../core/messaging/main'
import { SCROLL_TO_SECTION_MESSAGE_NAME } from '../../../core/messaging/main/messages/scrollto-section'
import { useLocation, useLocationSearchLabel } from '../../../features/location'
import {
  useTracksFiltered,
  useTracksSortedByDistance
} from '../../../features/tracks'
import { BookingLocationCta } from '../../booking-location-cta'
import { CoreMap, type MapMarker } from '../../core-map'
import { DEFAULT_LAT, DEFAULT_LONG } from '../../core-map/config'
import styles from '../style.module.scss'
import { DateRangePicker } from './date-range-picker'
import { SearchBar } from './search-bar'
import { SortSelect } from './sort-select'

export type LocationPickerCoreProps = {
  initialSearchValue?: string
  onSearchChange?: (query: string) => void
  renderEvent: (
    event: EventDataFragment,
    tracks: TrackDataFragment[],
    index: number
  ) => ReactNode
  loadingMessage?: string
  emptyMessage?: string
  title?: ReactNode
  className?: string
}

type SearchSource = 'user' | 'track' | 'location' | 'marker'

const getTomorrow = (): Date => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow
}

const normalizeToStartOfDay = (date: Date): Date => {
  const normalizedDate = new Date(date)
  normalizedDate.setHours(0, 0, 0, 0)
  return normalizedDate
}

const addDays = (date: Date, days: number): Date => {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

const filterEventsByDateRange = (
  events: EventDataFragment[],
  filterStart: Date | null,
  filterEnd: Date | null
): EventDataFragment[] => {
  const today = normalizeToStartOfDay(new Date())
  const normalizedFilterStart = filterStart
    ? normalizeToStartOfDay(filterStart)
    : today
  const normalizedFilterEndExclusive = filterEnd
    ? addDays(normalizeToStartOfDay(filterEnd), 1)
    : null

  return events.filter((event) => {
    if (!event.model?.startDate) {
      return false
    }

    const eventStart = normalizeToStartOfDay(new Date(event.model.startDate))
    const eventEndExclusive = event.model.endDate
      ? addDays(normalizeToStartOfDay(new Date(event.model.endDate)), 1)
      : addDays(eventStart, 1)

    // Always drop events that have already ended before rendering.
    if (eventEndExclusive <= today) {
      return false
    }

    if (!normalizedFilterEndExclusive) {
      return eventEndExclusive > normalizedFilterStart
    }

    return (
      eventStart < normalizedFilterEndExclusive &&
      eventEndExclusive > normalizedFilterStart
    )
  })
}

const getEventTrackKey = (event: EventDataFragment): string =>
  event.model?.track?.config?.handle ??
  event.model?.track?.model?.nickname ??
  ''

const getEventTrackDistance = (
  event: EventDataFragment,
  tracksDistanceMap: Map<string, number>
): number => {
  const key = getEventTrackKey(event)
  if (!key) {
    return Number.POSITIVE_INFINITY
  }
  return tracksDistanceMap.get(key) ?? Number.POSITIVE_INFINITY
}

const sortEventsByDate = (events: EventDataFragment[]) => {
  return events.sort((a, b) => {
    const startDateA = a.model?.startDate
    const startDateB = b.model?.startDate
    if (!startDateA) {
      return 1
    }
    if (!startDateB) {
      return -1
    }
    const dateA = new Date(startDateA)
    const dateB = new Date(startDateB)

    return dateA.getTime() - dateB.getTime()
  })
}

const sortEventsByDistance = (
  events: EventDataFragment[],
  tracksDistanceMap: Map<string, number>
) => {
  const formattedEvents = events.map((event) => ({
    ...event,
    distance: getEventTrackDistance(event, tracksDistanceMap)
  }))
  return formattedEvents.sort((a, b) => a.distance - b.distance)
}

const sortEvents = (
  events: EventDataFragment[],
  sortBy: string,
  tracksDistanceMap: Map<string, number> | null
): EventDataFragment[] => {
  if (!events.length) {
    return events
  }

  const eventsCopy = [...events]

  switch (sortBy) {
    case 'date-asc':
      return sortEventsByDate(eventsCopy)
    case 'distance-asc': {
      if (!tracksDistanceMap?.size) {
        return eventsCopy
      }

      return sortEventsByDistance(eventsCopy, tracksDistanceMap)
    }
    default:
      return eventsCopy
  }
}

export const LocationPickerCore = ({
  initialSearchValue,
  onSearchChange,
  renderEvent,
  loadingMessage,
  emptyMessage,
  title,
  className
}: LocationPickerCoreProps) => {
  const t = useTranslations('section_event_finder')
  const { data: location } = useLocation()
  const sectionContentId = `event-finder-content-${useId()}`

  // Derive initial value: prop takes precedence, then location store track nickname
  const homeTrackNickname = location?.track?.model?.nickname
  const effectiveInitialValue = initialSearchValue ?? homeTrackNickname ?? ''

  const [searchQuery, setSearchQuery] = useState(effectiveInitialValue)
  const [filterSortBy, setFilterSortBy] = useState<string>(
    effectiveInitialValue.trim() ? 'distance-asc' : 'date-asc'
  )
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(
    getTomorrow
  )
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null)
  const [selectedMarkerCoordinates, setSelectedMarkerCoordinates] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [searchSource, setSearchSource] = useState<SearchSource>(
    effectiveInitialValue.trim() ? 'track' : 'user'
  )

  // Track the previous values to detect changes from store hydration
  const prevInitialSearchValue = useRef(initialSearchValue)
  const prevHomeTrackNickname = useRef(homeTrackNickname)

  // Sync search query when initialSearchValue or home track nickname changes
  useEffect(() => {
    // Prop value changed
    if (
      initialSearchValue &&
      initialSearchValue !== prevInitialSearchValue.current
    ) {
      setSearchSource('track')
      setSearchQuery(initialSearchValue)
      setFilterSortBy('distance-asc')
      prevInitialSearchValue.current = initialSearchValue
      return
    }

    // Home track nickname changed (e.g., after store hydration)
    if (
      !initialSearchValue &&
      homeTrackNickname &&
      homeTrackNickname !== prevHomeTrackNickname.current
    ) {
      setSearchSource('track')
      setSearchQuery(homeTrackNickname)
      setFilterSortBy('distance-asc')
      prevHomeTrackNickname.current = homeTrackNickname
    }
  }, [initialSearchValue, homeTrackNickname])

  // Sync search query when the derived location label changes
  const handleLocationLabelChange = useCallback(
    (label: string) => {
      if (label) {
        const isTrackLabel = label === location?.track?.model?.nickname
        setSearchSource(isTrackLabel ? 'track' : 'location')
        setSelectedMarkerCoordinates(null)
        setSearchQuery(label)
        setFilterSortBy('distance-asc')
        onSearchChange?.(label)
      } else {
        setSearchSource('user')
        setSelectedMarkerCoordinates(null)
        setSearchQuery('')
        setFilterSortBy('date-asc')
        onSearchChange?.('')
      }
    },
    [location?.track?.model?.nickname, onSearchChange]
  )
  useLocationSearchLabel(handleLocationLabelChange)

  const {
    tracks,
    events: trackEvents,
    filteredTracks,
    markers,
    searchLocation,
    isLoading,
    isGeocoding
  } = useTracksFiltered(searchQuery)

  // When the location store has coordinates, use them directly for distance
  // calculation instead of geocoding the search text (which may be a track
  // name that geocodes to the wrong place)
  const locationCoordinates = useMemo(() => {
    if (location?.latitude && location?.longitude) {
      return { latitude: location.latitude, longitude: location.longitude }
    }
    return null
  }, [location?.latitude, location?.longitude])

  const selectedTrackCoordinates = useMemo(() => {
    if (searchSource !== 'track') {
      return null
    }

    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (!normalizedQuery) {
      return null
    }

    const homeTrack = location?.track
    const normalizedHomeTrackNickname = homeTrack?.model?.nickname
      ?.trim()
      .toLowerCase()
    const homeTrackLocation = homeTrack?.model?.location
    if (
      normalizedHomeTrackNickname === normalizedQuery &&
      homeTrackLocation?.latitude &&
      homeTrackLocation?.longitude
    ) {
      return {
        latitude: homeTrackLocation.latitude,
        longitude: homeTrackLocation.longitude
      }
    }

    const matchedTrack = tracks.find((track) => {
      const nickname = track.model?.nickname?.trim().toLowerCase()
      return nickname === normalizedQuery
    })

    const matchedTrackLocation = matchedTrack?.model?.location
    if (matchedTrackLocation?.latitude && matchedTrackLocation?.longitude) {
      return {
        latitude: matchedTrackLocation.latitude,
        longitude: matchedTrackLocation.longitude
      }
    }

    return null
  }, [location?.track, searchQuery, searchSource, tracks])

  const { data: tracksSortedByDistance } = useTracksSortedByDistance({
    searchQuery,
    coordinates:
      selectedMarkerCoordinates ??
      selectedTrackCoordinates ??
      (searchSource === 'location' ? locationCoordinates : null)
  })

  const tracksDistanceMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of tracksSortedByDistance) {
      const key = item.track.config?.handle ?? item.track.model?.nickname ?? ''
      if (key) {
        map.set(key, item.distance)
      }
    }
    return map
  }, [tracksSortedByDistance])

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchSource('user')
      setSelectedMarkerCoordinates(null)
      setSearchQuery(query)
      setFilterSortBy(query.trim() ? 'distance-asc' : 'date-asc')
      onSearchChange?.(query)
    },
    [onSearchChange]
  )

  const handleMarkerClick = useCallback(
    (marker: MapMarker) => {
      // Use clicked marker coordinates as distance source of truth.
      setSearchSource('marker')
      setSelectedMarkerCoordinates({
        latitude: marker.latitude,
        longitude: marker.longitude
      })

      // Keep query in sync for list filtering + map centering behavior.
      if (marker.label) {
        setSearchQuery(marker.label)
        setFilterSortBy('distance-asc')
        onSearchChange?.(marker.label)
      }

      // Bring the section content (search + filters + events list) into view
      // after the click. Defer to the next frame so the re-sorted list is
      // committed before we measure its position.
      requestAnimationFrame(() => {
        initMainBus().send({
          name: SCROLL_TO_SECTION_MESSAGE_NAME,
          details: { id: sectionContentId }
        })
      })
    },
    [onSearchChange, sectionContentId]
  )

  const handleDateRangeChange = useCallback(
    (startDate: Date | null, endDate: Date | null) => {
      setFilterStartDate(startDate)
      setFilterEndDate(endDate)
    },
    []
  )

  const handleSortChange = useCallback(
    (sortBy: string) => {
      setFilterSortBy(sortBy)

      // "Soonest" should show global upcoming events without location/search bias.
      if (sortBy === 'date-asc') {
        setSearchSource('user')
        setSelectedMarkerCoordinates(null)
        setSearchQuery('')
        onSearchChange?.('')
      }
    },
    [onSearchChange]
  )

  // Filter events by date range
  const filteredEvents = useMemo(
    () => filterEventsByDateRange(trackEvents, filterStartDate, filterEndDate),
    [trackEvents, filterStartDate, filterEndDate]
  )

  // Sort events by sortBy
  const sortedEvents = useMemo(
    () => sortEvents(filteredEvents, filterSortBy, tracksDistanceMap),
    [filteredEvents, filterSortBy, tracksDistanceMap]
  )

  // Get unique track nicknames from filtered tracks to filter map markers
  const filteredTrackNicknames = useMemo(() => {
    const nicknames = new Set<string>()
    for (const track of filteredTracks) {
      const nickname = track.model?.nickname
      if (nickname) {
        nicknames.add(nickname)
      }
    }
    return nicknames
  }, [filteredTracks])

  // Prepare map markers - only show markers for tracks that have events matching the date filter
  const mapMarkers: MapMarker[] = useMemo(() => {
    return markers
      .filter(
        (marker) => marker.label && filteredTrackNicknames.has(marker.label)
      )
      .map((marker) => ({
        id: marker.id,
        latitude: marker.latitude,
        longitude: marker.longitude,
        label: marker.label
      }))
  }, [markers, filteredTrackNicknames])

  // Determine map center - use search location if available, otherwise default
  const mapCenter = useMemo(() => {
    if (searchLocation) {
      return {
        lat: searchLocation.latitude,
        long: searchLocation.longitude
      }
    }
    return {
      lat: DEFAULT_LAT,
      long: DEFAULT_LONG
    }
  }, [searchLocation])

  const displayLoadingMessage = loadingMessage ?? t('loading')
  const displayEmptyMessage = emptyMessage ?? t('no_events')

  return (
    <div className={clsx(styles.section__body, className)}>
      <div id={sectionContentId} className={styles.section__content}>
        {title}

        <div className={styles.search}>
          <SearchBar
            onSearch={handleSearchChange}
            initialValue={effectiveInitialValue}
            value={searchQuery}
          />
        </div>

        <div className={styles.filters}>
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
          <SortSelect
            value={filterSortBy}
            onSortChange={handleSortChange}
            label={t('sort.label')}
          />
        </div>

        <div className={styles.locationCta}>
          <BookingLocationCta />
        </div>

        <div className={styles.events}>
          <div className={styles.events__inner}>
            {isLoading || isGeocoding ? (
              <div className={styles.events__loading}>
                {displayLoadingMessage}
              </div>
            ) : sortedEvents.length === 0 ? (
              <div className={styles.events__empty}>{displayEmptyMessage}</div>
            ) : (
              sortedEvents.map((event, index) =>
                renderEvent(event, tracks, index)
              )
            )}
          </div>
        </div>
      </div>

      <div className={styles.section__media}>
        <CoreMap
          lat={mapCenter.lat}
          long={mapCenter.long}
          markers={mapMarkers}
          aspectRatio="1 / 1"
          zoom={searchLocation ? 12 : 3}
          onMarkerClick={handleMarkerClick}
        />
      </div>
    </div>
  )
}
