import { AppError } from '../../../core/errors/app-error'
import { MiddlewareClient } from './middleware-client'

let middlewareClientInstance: MiddlewareClient | null = null

export const getMiddlewareClient = async (): Promise<MiddlewareClient> => {
  if (middlewareClientInstance) {
    return middlewareClientInstance
  }

  const clientId = process.env.ROCKET_REZ_CLIENT_ID
  const clientSecret = process.env.ROCKET_REZ_CLIENT_SECRET
  const baseUrl = process.env.ROCKET_REZ_API_BASE_URL
  const scopes = process.env.ROCKET_REZ_API_SCOPES

  if (!clientId || !clientSecret) {
    throw new AppError('RocketRez credentials not provided', {
      traceTag: 'get-middleware-client'
    })
  }

  if (!baseUrl || !scopes) {
    throw new AppError('RocketRez environment variables not provided', {
      traceTag: 'get-middleware-client'
    })
  }

  middlewareClientInstance = new MiddlewareClient({
    baseUrl,
    clientId,
    clientSecret,
    scopes
  })

  await middlewareClientInstance.initialize()
  return middlewareClientInstance
}
