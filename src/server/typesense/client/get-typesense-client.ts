import { initLogger } from '../../../core/logger'
import { TypesenseClient } from './typesense-client'

let typesenseClientInstance: TypesenseClient | null = null

export const getTypesenseClient = (): TypesenseClient => {
  if (typesenseClientInstance) {
    return typesenseClientInstance
  }

  const apiKey = process.env.TYPESENSE_API_KEY
  const baseUrl = process.env.TYPESENSE_BASE_URL

  if (!apiKey) {
    throw new Error('TYPESENSE_API_KEY environment variable is not set')
  }

  if (!baseUrl) {
    throw new Error('TYPESENSE_BASE_URL environment variable is not set')
  }

  const logger = initLogger()

  typesenseClientInstance = new TypesenseClient({
    apiKey,
    baseUrl,
    logger
  })

  return typesenseClientInstance
}
