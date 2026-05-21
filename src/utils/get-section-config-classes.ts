type SectionConfig = {
  mode?: string | null
  addBottomBorder?: boolean
  addFlagPattern?: boolean
}

type StyleModule = Readonly<Record<string, string>>

/**
 * Generates CSS class names for a section based on its config.
 * Returns an array of class names that can be spread into clsx().
 *
 * @param config - The section config containing mode, addBottomBorder, addFlagPattern
 * @param styles - The CSS module styles object
 * @returns Array of class names to be used with clsx
 *
 * @example
 * ```tsx
 * <section
 *   className={clsx(
 *     styles.section,
 *     ...getSectionConfigClasses(config, styles)
 *   )}
 * >
 * ```
 */
export const getSectionConfigClasses = (
  config: SectionConfig | null | undefined,
  styles: StyleModule
): (string | undefined)[] => {
  if (!config) {
    return []
  }

  return [
    config.addBottomBorder ? styles['section--bottom-border'] : undefined,
    config.addFlagPattern ? styles['section--flag-pattern'] : undefined,
    config.mode ? styles[`section--${config.mode}`] : undefined
  ]
}
