import type { FC } from 'react'

// Pin styling constants
const PIN_WIDTH = 23
const PIN_HEIGHT = 38
const PIN_COLOR = 'oklch(0.6646 0.1803 40.83)'
const PIN_SVG_PATH =
  'M11.297 0C5.057 0 0 4.963 0 11.083 0 17.205 11.297 37.28 11.297 37.28s11.297-20.075 11.297-26.197C22.594 4.963 17.534 0 11.297 0Z'

// Hex color for Mapbox Static API (oklch converted to hex)
export const PIN_COLOR_HEX = 'd9583b'

export type PinProps = {
  ariaLabel?: string
  className?: string
}

export const Pin: FC<PinProps> = ({ ariaLabel, className }) => {
  return (
    <svg
      width={PIN_WIDTH}
      height={PIN_HEIGHT}
      viewBox={`0 0 ${PIN_WIDTH} ${PIN_HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
      className={className}
    >
      <path d={PIN_SVG_PATH} fill={PIN_COLOR} />
    </svg>
  )
}

/**
 * Creates a marker DOM element for Mapbox GL JS
 * Uses the same pin styling as the Pin component
 */
export const createMarkerElement = (ariaLabel: string): HTMLDivElement => {
  const markerElement = document.createElement('div')
  markerElement.style.cursor = 'pointer'
  markerElement.style.display = 'flex'
  markerElement.style.alignItems = 'center'
  markerElement.style.justifyContent = 'center'

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', String(PIN_WIDTH))
  svg.setAttribute('height', String(PIN_HEIGHT))
  svg.setAttribute('viewBox', `0 0 ${PIN_WIDTH} ${PIN_HEIGHT}`)
  svg.setAttribute('fill', 'none')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('aria-label', ariaLabel)

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', PIN_SVG_PATH)
  path.setAttribute('fill', PIN_COLOR)

  svg.appendChild(path)
  markerElement.appendChild(svg)

  return markerElement
}
