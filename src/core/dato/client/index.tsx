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

  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
  const datoToken = process.env.NEXT_PUBLIC_DATOCMS_READONLY_TOKEN || ''
  const datoEnvironment = process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT || ''

  if (!datoToken) {
    throw new Error('NEXT_PUBLIC_DATOCMS_READONLY_TOKEN value is missing')
  }

  const baseHeaders: Record<string, string> = {
    Authorization: datoToken,
    'X-Exclude-Invalid': 'true'
  }

  // Drafts are excluded on all environments to prevent unpublished
  // records from appearing in the frontend or API responses.
  if (datoEnvironment && !isProduction) {
    baseHeaders['X-Environment'] = datoEnvironment
  }

  return createClient({
    url: 'https://graphql.datocms.com',
    fetchOptions: { headers: baseHeaders, next: { revalidate: 60 } },
    requestPolicy: 'network-only',
    exchanges: [
      retryExchange({
        initialDelayMs: 500,
        maxDelayMs: 30_000,
        maxNumberAttempts: 5,
        retryIf: (err) => err.message.includes('THROTTLED')
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
