import type { CSSProperties } from 'react'

const SECTION_STYLE_CONFIG: Record<string, `--${string}`> = {
  highlightColor: '--section-highlight-color',
  contrastColor: '--section-contrast-color'
}

type SectionConfigStyles = CSSProperties & Record<`--${string}`, string>

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const toCssVarValue = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmedValue = value.trim()

  return trimmedValue.length > 0 ? trimmedValue : undefined
}

/**
 * Generates inline CSS custom properties for a section based on config.
 * Reusable across section components to scope style overrides.
 */
export const getSectionConfigStyles = (
  config: unknown
): SectionConfigStyles | undefined => {
  if (!isRecord(config)) {
    return undefined
  }

  const sectionStyles: SectionConfigStyles = {}

  Object.entries(SECTION_STYLE_CONFIG).forEach(([configKey, cssVariable]) => {
    const cssValue = toCssVarValue(config[configKey])
    if (cssValue) {
      sectionStyles[cssVariable] = cssValue
    }
  })

  return Object.keys(sectionStyles).length > 0 ? sectionStyles : undefined
}
