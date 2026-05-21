/**
 * Gets a non-empty string from Dato CMS data, falling back to model data.
 * The Dato value is considered valid only if it's a non-empty string after trimming.
 *
 * @param datoValue - The string value from Dato CMS (may be null, undefined, or empty)
 * @param modelValue - The fallback value from the model data
 * @param additionalFallbacks - Optional additional fallback values
 * @returns The first non-empty trimmed string from Dato, or the first truthy fallback, or null
 *
 * @example
 * ```ts
 * getDatoStringWithModelFallback('  ', 'Model Name') // 'Model Name'
 * getDatoStringWithModelFallback('Dato Title', 'Model Name') // 'Dato Title'
 * getDatoStringWithModelFallback(null, 'Model Name') // 'Model Name'
 * getDatoStringWithModelFallback(null, null) // null
 * ```
 */
export const getDatoStringWithModelFallback = (
  datoValue: string | null | undefined,
  modelValue: string | null | undefined,
  ...additionalFallbacks: (string | null | undefined)[]
): string | null => {
  const trimmedDato = datoValue?.trim()
  if (trimmedDato) {
    return trimmedDato
  }

  if (modelValue) {
    return modelValue
  }

  for (const fallback of additionalFallbacks) {
    if (fallback) {
      return fallback
    }
  }

  return null
}
