import {
  type Client,
  cacheExchange,
  createClient,
  errorExchange,
  fetchExchange
} from '@urql/core'
import { retryExchange } from '@urql/exchange-retry'
import type { Logger } from '../../logger'

export type { AnyVariables, Client } from '@urql/core'

export type ClientFactoryProps = {
  logger: Logger
}

export const _makeClient = ({
  logger: parentLogger
}: ClientFactoryProps): Client => {
  const logger = parentLogger.child({ name: 'dato-api' })

  const datoToken = process.env.NEXT_PUBLIC_DATOCMS_READONLY_TOKEN || ''
  // Server-only, so the environment name stays out of the browser bundle. Like
  // every Vercel variable, a change takes effect only after a redeploy. Vercel
  // Production ignores it and always reads the primary environment. Outside
  // Vercel (local dev, GitHub Actions), it applies whenever it's set.
  const datoEnvironment = process.env.DATOCMS_ENVIRONMENT || ''
  const isVercelProduction = process.env.VERCEL_ENV === 'production'

  if (!datoToken) {
    throw new Error('NEXT_PUBLIC_DATOCMS_READONLY_TOKEN value is missing')
  }

  const baseHeaders: Record<string, string> = {
    Authorization: datoToken,
    'X-Exclude-Invalid': 'true'
  }

  // No X-Include-Drafts header is sent, so every environment returns only
  // published content.
  if (datoEnvironment && !isVercelProduction) {
    baseHeaders['X-Environment'] = datoEnvironment
  }

  return createClient({
    url: 'https://graphql.datocms.com',
    // GraphQL errors arrive as HTTP 200, so Next caches error responses for
    // this long too. Keep it short.
    fetchOptions: { headers: baseHeaders, next: { revalidate: 60 } },
    requestPolicy: 'network-only',
    exchanges: [
      retryExchange({
        initialDelayMs: 500,
        maxDelayMs: 30_000,
        maxNumberAttempts: 5,
        // Also retry network failures, such as timeouts or non-JSON 5xx
        // responses. Static pages fetch during `next build`, so one transient
        // failure would otherwise fail the deploy.
        retryIf: (err) => Boolean(err.networkError) || err.message.includes('THROTTLED')
      }),
      errorExchange({
        onError: (error, operation) => {
          const { graphQLErrors, networkError } = error

          if (networkError) {
            logger.error(
              { operationName: operation.kind, context: operation.context },
              '[%s] %s',
              networkError.name,
              networkError.message
            )
          }

          if (graphQLErrors) {
            logger.warn(
              { operationName: operation.kind },
              'GraphQL error count: %d',
              graphQLErrors.length
            )

            graphQLErrors.forEach(({ message, extensions, path }) => {
              const code = extensions.code || 'UNKNOWN'
              logger.warn(
                { code, operationName: operation.kind, path },
                '[GraphQL error]: %s - %s',
                code,
                message
              )
            })
          }
        }
      }),
      cacheExchange,
      fetchExchange
    ]
  })
}

let client: Client | null = null

export const createDatoClient = ({ logger }: ClientFactoryProps): Client => {
  client = client ?? _makeClient({ logger })
  return client
}
