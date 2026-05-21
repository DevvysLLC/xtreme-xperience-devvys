import { useCallback, useState } from 'react'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import { NewsletterResponseSchema } from '../../io/schemas'
import type { NewsletterResponse } from '../../io/types'

type UseNewsletterReturn = {
  subscribe: (email: string) => Promise<NewsletterResponse>
  isLoading: boolean
  error: string | null
}

export const useNewsletter = (): UseNewsletterReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subscribe = useCallback(
    async (email: string): Promise<NewsletterResponse> => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(ROUTES.API.FRONTEND.NEWSLETTER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        })

        const jsonData = await response.json()
        const parseResult = NewsletterResponseSchema.safeParse(jsonData)

        if (!parseResult.success) {
          const errorMessage = 'Invalid response format'
          setError(errorMessage)
          logger.error(
            { email, jsonData, parseResult },
            'useNewsletter.subscribe.invalidResponse'
          )
          return {
            status: 'internal_error',
            message: errorMessage
          }
        }

        const data = parseResult.data

        if (!response.ok) {
          setError(data.message)
          logger.error({ email, data }, 'useNewsletter.subscribe.error')
          return data
        }

        setError(null)
        logger.info({ email, data }, 'useNewsletter.subscribe.success')
        return data
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred'
        setError(errorMessage)
        logger.error({ email, error: err }, 'useNewsletter.subscribe.exception')
        return {
          status: 'internal_error',
          message: errorMessage
        }
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    subscribe,
    isLoading,
    error
  }
}
