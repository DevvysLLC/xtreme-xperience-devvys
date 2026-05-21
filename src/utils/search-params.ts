export const buildSearchParams = (
  params: Record<string, string | number | boolean | undefined>
): URLSearchParams => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value))
    }
  })

  return searchParams
}
