/**
 * Extracts the request path from a URL pathname by removing the '/api/v1/' prefix.
 *
 * @param pathname - The URL pathname (e.g., '/api/v1/booking/ride-along')
 * @returns The request path without the '/api/v1/' prefix (e.g., 'booking/ride-along')
 *
 * @example
 * ```ts
 * const pathname = new URL(request.url).pathname
 * const requestPath = getRequestPath(pathname)
 * // Returns: 'booking/ride-along' for '/api/v1/booking/ride-along'
 * ```
 */
export const getRequestPath = (pathname: string): string => {
  return pathname.replace('/api/v1/', '')
}
