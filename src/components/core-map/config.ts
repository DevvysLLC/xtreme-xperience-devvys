// export const MAPBOX_STYLE = 'mapbox://styles/xtremexperience/cl7te570i001v15pd1t2qg9c3'
// export const MAPBOX_STYLE = 'mapbox://styles/xtremexperience/cmiovmkuc002001qme4790o49'
export const MAPBOX_STYLE = 'mapbox://styles/mapbox/light-v11'

export const MAPBOX_API_URL =
  'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js'
export const MAPBOX_CSS_URL =
  'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css'
export const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_API_KEY ?? ''

// Center of lower 48 US states
export const DEFAULT_LAT = 39.833333
export const DEFAULT_LONG = -98.585522

// US continental bounding box (with padding for Alaska/Hawaii visibility)
export const US_BOUNDS: [[number, number], [number, number]] = [
  [-125, 24], // Southwest: [longitude, latitude]
  [-66, 50] // Northeast: [longitude, latitude]
]
export const MIN_ZOOM = 2.3
export const MAX_ZOOM = 12
