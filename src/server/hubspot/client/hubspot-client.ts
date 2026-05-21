import { AppError } from '../../../core/errors/app-error'
import { safeAwait } from '../../../core/errors/safe-await'
import { logger } from '../../../core/logger/logger'

export type HubspotClientConfig = {
  accessToken: string
  portalId: string
}

export type HubspotRequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  body?: unknown
}

export class HubspotClient {
  private readonly portalId: string
  private readonly accessToken: string
  private readonly baseUrl = 'https://api.hsforms.com'

  constructor(config: HubspotClientConfig) {
    if (!config.accessToken) {
      throw new AppError('HUBSPOT_ACCESS_TOKEN is required', {
        traceTag: 'hubspot-client.constructor'
      })
    }

    if (!config.portalId) {
      throw new AppError('HUBSPOT_PORTAL_ID is required', {
        traceTag: 'hubspot-client.constructor'
      })
    }

    this.accessToken = config.accessToken
    this.portalId = config.portalId
  }

  getPortalId(): string {
    return this.portalId
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`
    }
  }

  async request(options: HubspotRequestOptions): Promise<unknown> {
    const url = `${this.baseUrl}${options.path}`

    logger.info('hubspot-client.request', {
      method: options.method,
      path: options.path
    })

    const [error, response] = await safeAwait(
      fetch(url, {
        method: options.method,
        headers: this.getHeaders(),
        body: options.body ? JSON.stringify(options.body) : undefined
      })
    )

    if (error) {
      throw new AppError('HubSpot API request failed', {
        traceTag: 'hubspot-client.request',
        method: options.method,
        path: options.path,
        originalError: error
      })
    }

    // HubSpot forms API returns 204 No Content on success
    if (response.status === 204) {
      logger.info('hubspot-client.request.success', {
        method: options.method,
        path: options.path,
        status: response.status
      })
      return null
    }

    const jsonData: unknown = await response.json().catch((jsonError) => {
      logger.error(
        { jsonError, status: response.status, statusText: response.statusText },
        'Failed to parse HubSpot API response JSON'
      )
      return null
    })

    if (!response.ok) {
      throw new AppError('HubSpot API error response', {
        traceTag: 'hubspot-client.request',
        method: options.method,
        path: options.path,
        status: response.status,
        statusText: response.statusText,
        errorData: jsonData
      })
    }

    logger.info('hubspot-client.request.success', {
      method: options.method,
      path: options.path,
      status: response.status
    })

    return jsonData
  }
}
