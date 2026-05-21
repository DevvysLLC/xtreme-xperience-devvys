import { ROUTES } from '../../../../config/routes'
import { AppError } from '../../../../core/errors/app-error'
import { safeAwait } from '../../../../core/errors/safe-await'
import { logger } from '../../../../core/logger/logger'
import {
  RocketRezAuthTokenResponseSchema,
  RocketRezRefreshCartTokenResponseSchema
} from '../../../../io/schemas'
import type {
  RocketRezAuthTokenRequest,
  RocketRezAuthTokenResponse,
  RocketRezRefreshCartTokenRequest,
  RocketRezRefreshCartTokenResponse
} from '../../../../io/types'

export class AuthService {
  constructor(private readonly baseUrl: string) {
    if (!this.baseUrl) {
      throw new AppError(
        'ROCKET_REZ_API_BASE_URL environment variable is not set',
        {
          traceTag: 'auth-service.constructor'
        }
      )
    }
  }

  async getToken(
    request: RocketRezAuthTokenRequest
  ): Promise<RocketRezAuthTokenResponse> {
    const url = `${this.baseUrl}${ROUTES.ROCKET_REZ.AUTH.TOKEN}`

    logger.info('auth-service.getToken', { url })

    const [error, response] = await safeAwait(
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })
    )

    if (error) {
      throw new AppError('Failed to authenticate', {
        traceTag: 'auth-service.getToken',
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AppError('Authentication failed', {
        traceTag: 'auth-service.getToken',
        status: response.status,
        statusText: response.statusText,
        errorData
      })
    }

    const jsonData: unknown = await response.json()

    const parsed = RocketRezAuthTokenResponseSchema.safeParse(jsonData)
    if (parsed.success) {
      logger.info('auth-service.getToken.success')
      return parsed.data
    }

    throw new AppError('Invalid response format from auth API', {
      traceTag: 'auth-service.getToken',
      validationError: parsed.error
    })
  }

  async refreshCartToken(
    request: RocketRezRefreshCartTokenRequest
  ): Promise<RocketRezRefreshCartTokenResponse> {
    const url = `${this.baseUrl}${ROUTES.ROCKET_REZ.AUTH.REFRESH_CART_TOKEN}`

    logger.info('auth-service.refreshCartToken', { url })

    const [error, response] = await safeAwait(
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })
    )

    if (error) {
      throw new AppError('Failed to refresh cart token', {
        traceTag: 'auth-service.refreshCartToken',
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AppError('Cart token refresh failed', {
        traceTag: 'auth-service.refreshCartToken',
        status: response.status,
        statusText: response.statusText,
        errorData
      })
    }

    const jsonData: unknown = await response.json()

    const parsed = RocketRezRefreshCartTokenResponseSchema.safeParse(jsonData)
    if (parsed.success) {
      logger.info('auth-service.refreshCartToken.success', {
        parsed: {
          data: {
            access_token: '[REDACTED]',
            token_type: parsed.data.data.token_type,
            expires_in: parsed.data.data.expires_in,
            expiry: parsed.data.data.expiry
          },
          statusCode: parsed.data.statusCode,
          errorMessage: parsed.data.errorMessage
        }
      })
      return parsed.data
    }

    throw new AppError('Invalid response format from auth API', {
      traceTag: 'auth-service.refreshCartToken',
      validationError: parsed.error
    })
  }
}
