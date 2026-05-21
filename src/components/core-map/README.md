# Core Map

A Mapbox GL JS map component that displays an interactive map centered on specified coordinates.

## Props

- `lat: number` - Latitude coordinate (required)
- `long: number` - Longitude coordinate (required)
- `aspectRatio?: string` - CSS aspect-ratio value (e.g., "16/9", "4/3") (optional)
- `className?: string` - Additional CSS classes (optional)

## Usage

```tsx
import { CoreMap } from '@/components/core-map'

<CoreMap lat={40.7128} long={-74.0060} aspectRatio="16/9" />
```

## Environment Variables

The component requires `NEXT_PUBLIC_MAPBOX_API_KEY` to be set in your environment variables.

## Features

- Automatically loads Mapbox GL JS library if not already loaded
- Centers map on provided latitude/longitude coordinates
- Supports custom aspect ratios
- Handles loading and error states
- Cleans up map instance on unmount


