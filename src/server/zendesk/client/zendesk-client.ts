import { AppError } from '../../../core/errors/app-error'
import { safeAwait } from '../../../core/errors/safe-await'
import { logger } from '../../../core/logger/logger'

export type ZendeskClientConfig = {
  apiEmail: string
  apiKey: string
  baseUrl: string
}

export type ZendeskRequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  body?: unknown
}

export class ZendeskClient {
  private readonly apiEmail: string
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(config: ZendeskClientConfig) {
    if (!config.apiEmail) {
      throw new AppError('ZENDESK_API_EMAIL is required', {
        traceTag: 'zendesk-client.constructor'
      })
    }

    if (!config.apiKey) {
      throw new AppError('ZENDESK_API_KEY is required', {
        traceTag: 'zendesk-client.constructor'
      })
    }

    if (!config.baseUrl) {
      throw new AppError('ZENDESK_API_BASE_URL is required', {
        traceTag: 'zendesk-client.constructor'
      })
    }

    this.apiEmail = config.apiEmail
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl.replace(/\/+$/, '')
  }

  private getHeaders(): HeadersInit {
    const credentials = Buffer.from(
      `${this.apiEmail}/token:${this.apiKey}`
    ).toString('base64')

    return {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`
    }
  }

  async request(options: ZendeskRequestOptions): Promise<unknown> {
    const url = `${this.baseUrl}${options.path}`

    logger.info('zendesk-client.request', {
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
      throw new AppError('Zendesk API request failed', {
        traceTag: 'zendesk-client.request',
        method: options.method,
        path: options.path,
        originalError: error
      })
    }

    if (response.status === 204) {
      logger.info('zendesk-client.request.success', {
        method: options.method,
        path: options.path,
        status: response.status
      })
      return null
    }

    const jsonData: unknown = await response.json().catch((jsonError) => {
      logger.error(
        { jsonError, status: response.status, statusText: response.statusText },
        'Failed to parse Zendesk API response JSON'
      )
      return null
    })

    if (!response.ok) {
      throw new AppError('Zendesk API error response', {
        traceTag: 'zendesk-client.request',
        method: options.method,
        path: options.path,
        status: response.status,
        statusText: response.statusText,
        errorData: jsonData
      })
    }

    logger.info('zendesk-client.request.success', {
      method: options.method,
      path: options.path,
      status: response.status
    })

    return jsonData
  }
}
