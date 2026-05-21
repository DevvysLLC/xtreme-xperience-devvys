# Trackfinder Feature Flow Diagrams

> **Client-facing overview:** See [Track Finding — User Journey](./client/readme.md) for a digestible, non-technical summary.

## Track Finding Flow

[View diagram source](./diagrams/track-finding-flow.mmd)

```mermaid
flowchart TD
    Start([User Searches]) --> SearchMethod{Search Method}

    SearchMethod -->|Browser Location| BrowserLoc[useLocationBrowser]
    SearchMethod -->|Manual Search| ManualSearch[Enter Address/Place]
    SearchMethod -->|Select Track| SelectTrack[Select from List]

    BrowserLoc --> BrowserAPI[Browser Geolocation API]
    BrowserAPI --> LocationStore[("Location Store<br/>localStorage")]

    SelectTrack --> SetTrack[useLocationSetTrack]
    SetTrack --> LocationStore

    ManualSearch --> Debounce[Debounce 500ms]
    Debounce --> MapboxGeocode[useMapboxGeocode]
    MapboxGeocode --> MapboxAPI[Mapbox Geocoding API]
    MapboxAPI --> FilterTracks["useTracksFiltered<br/>Name + Proximity Filter"]
    FilterTracks --> FilteredResults[Filtered Tracks + Events]

    LocationStore --> FetchTracks["useTracks<br/>Fetch All Tracks"]
    FetchTracks --> TracksAPI[Tracks API]
    TracksAPI --> TracksData[Tracks Data]

    TracksData --> SortTracks[useTracksSortedByDistance]
    LocationStore -->|Stored Coords| SortTracks
    MapboxAPI -->|Geocoded Coords| SortTracks

    SortTracks --> CalculateDistance["Calculate Distance<br/>Turf.js"]
    CalculateDistance --> SortByDistance[Sort by Distance]
    SortByDistance --> MarkNearest[Mark Nearest Track]
    MarkNearest --> PrependHome["Prepend Home Track<br/>if exists"]
    PrependHome --> SortedTracks[Sorted Tracks List]

    FilteredResults --> DisplayTracks[Display Tracks]
    SortedTracks --> DisplayTracks

    LocationStore --> ReactQuery["React Query<br/>Invalidates"]
    ReactQuery --> Components[Components Update]

    style LocationStore fill:#d0d0d0,color:#000
    style MapboxAPI fill:#b0b0b0,color:#000
    style TracksAPI fill:#b0b0b0,color:#000
    style ReactQuery fill:#b0b0b0,color:#000
```

## Location State Management

[View diagram source](./diagrams/location-state-management.mmd)

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant useLocation
    participant LocationStore
    participant BrowserAPI
    participant localStorage

    User->>Component: Requests location
    Component->>useLocation: Get location
    useLocation->>LocationStore: Read state
    LocationStore->>localStorage: Load persisted
    LocationStore-->>useLocation: Location data
    useLocation-->>Component: Return location

    alt Browser Location
        Component->>BrowserAPI: useLocationBrowser
        BrowserAPI-->>Component: Coordinates
        Component->>LocationStore: Update location
    else Select Track
        Component->>LocationStore: useLocationSetTrack
        Note over LocationStore: Sets track + label
    else Clear Location
        Component->>LocationStore: useLocationClear
        Note over LocationStore: Clears all location data
    end

    Note over Component: Manual search geocodes for<br/>filtering/sorting only and does<br/>not update Location Store

    LocationStore->>localStorage: Persist
    LocationStore->>useLocation: State change
    useLocation->>Component: Invalidate query
```

## Track Selection Flow

[View diagram source](./diagrams/track-selection-flow.mmd)

```mermaid
flowchart LR
    UserSelects[User Selects Track] --> SetTrack[useLocationSetTrack]
    SetTrack --> LocationStore[(Location Store)]
    LocationStore --> UpdateLabel["Update Label<br/>Track State/City"]
    UpdateLabel --> Persist[Persist to localStorage]
    Persist --> ReactQuery[React Query Invalidate]
    ReactQuery --> Components[Components Update]

    style LocationStore fill:#d0d0d0,color:#000
    style ReactQuery fill:#b0b0b0,color:#000
```

## Track Sorting Flow

[View diagram source](./diagrams/track-sorting-flow.mmd)

```mermaid
flowchart TD
    Start([Sort Tracks]) --> HasExplicit{"Has Explicit<br/>Coordinates?"}

    HasExplicit -->|Yes| UseExplicit[Use Provided Coordinates]
    HasExplicit -->|No| HasSearch{"Has Search<br/>Query?"}

    HasSearch -->|Yes| Geocode[Geocode Search Query]
    HasSearch -->|No| HasStored{"Location Store<br/>Has Coords?"}

    Geocode --> GeocodeOk{"Geocode<br/>Success?"}
    GeocodeOk -->|Yes| UseGeocoded[Use Geocoded Coordinates]
    GeocodeOk -->|No| HasStored

    HasStored -->|Yes| UseStored[Use Stored Coordinates]
    HasStored -->|No| NoCoords[Set Distance = Infinity]

    UseExplicit --> CalculateDistances["Calculate Distances<br/>Turf.js"]
    UseGeocoded --> CalculateDistances
    UseStored --> CalculateDistances

    NoCoords --> SortTracks[Sort Tracks]
    CalculateDistances --> SortTracks

    SortTracks --> MarkNearest[Mark Nearest Track]
    MarkNearest --> PrependHome["Prepend Home Track<br/>if exists"]
    PrependHome --> ReturnSorted[Return Sorted Tracks]

    style HasExplicit fill:#d0d0d0,color:#000
    style CalculateDistances fill:#b0b0b0,color:#000
    style SortTracks fill:#a0a0a0,color:#000
```

## Next Event Calculation

[View diagram source](./diagrams/next-event-calculation.mmd)

```mermaid
flowchart TD
    TrackSelected[Track Selected] --> GetEvents[Get Track Events]
    GetEvents --> FilterEnabled[Filter Enabled Events]
    FilterEnabled --> FilterFuture[Filter Future Dates]
    FilterFuture --> SortByDate[Sort by Start Date]
    SortByDate --> GetNext[Get Next Event]
    GetNext --> CalculateRemaining[Calculate Remaining Count]
    CalculateRemaining --> ReturnResult["Return Next Event<br/>+ Remaining Count"]

    style FilterEnabled fill:#d0d0d0,color:#000
    style SortByDate fill:#b0b0b0,color:#000
    style ReturnResult fill:#a0a0a0,color:#000
```
