import { unstable_rethrow } from 'next/navigation'
import { logger } from '../logger/logger'

/**
 * Logs a page render error, then rethrows it. Call it from a page's `catch`.
 *
 * Rethrowing keeps the error out of the page cache: Next keeps serving the last good page and
 * retries on the next request. A rendered fallback would replace the good page in the cache.
 * `notFound()` and redirects pass straight through.
 */
export const rethrowPageError = (error: unknown, message: string, context: object = {}): never => {
  unstable_rethrow(error)
  logger.error({ error, ...context }, message)
  throw error
}
