export const buildUrl = (
  base: string,
  searchParams: URLSearchParams
): string => {
  const queryString = searchParams.toString()
  return queryString ? `${base}?${queryString}` : base
}
