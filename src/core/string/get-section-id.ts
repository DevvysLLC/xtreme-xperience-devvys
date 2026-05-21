/**
 * Gets the section ID from config.customId or falls back to the default id.
 * Handles empty strings and whitespace-only strings by returning undefined.
 *
 * @param customId - The custom ID from section config (may be null or empty)
 * @param defaultId - The default section ID
 * @returns The section ID to use, or undefined if both are empty/invalid
 */
export const getSectionId = (
  customId: string | null | undefined,
  defaultId: string | null | undefined
): string | undefined => {
  const trimmedCustomId = customId?.trim()
  return trimmedCustomId || defaultId || undefined
}
