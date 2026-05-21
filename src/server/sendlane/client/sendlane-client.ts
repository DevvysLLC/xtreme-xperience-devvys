import { AppError } from '../../../core/errors/app-error'
import { safeAwait } from '../../../core/errors/safe-await'
import { logger } from '../../../core/logger/logger'

export type SendlaneClientConfig = {
  apiToken: string
  baseUrl?: string
}

export type SendlaneRequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  body?: unknown
}

export class SendlaneClient {
  private readonly baseUrl: string
  private readonly apiToken: string

  constructor(config: SendlaneClientConfig) {
    if (!config.apiToken) {
      throw new AppError('SENDLANE_API_TOKEN is required', {
        traceTag: 'sendlane-client.constructor'
      })
    }

    this.apiToken = config.apiToken
    this.baseUrl = config.baseUrl ?? 'https://api.sendlane.com/v2'
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiToken}`
    }
  }

  async request(options: SendlaneRequestOptions): Promise<unknown> {
    const url = `${this.baseUrl}${options.path}`

    logger.info('sendlane-client.request', {
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
      throw new AppError('Sendlane API request failed', {
        traceTag: 'sendlane-client.request',
        method: options.method,
        path: options.path,
        originalError: error
      })
    }

    const jsonData: unknown = await response.json().catch((jsonError) => {
      logger.error(
        { jsonError, status: response.status, statusText: response.statusText },
        'Failed to parse Sendlane API response JSON'
      )
      return null
    })

    if (!response.ok) {
      throw new AppError('Sendlane API error response', {
        traceTag: 'sendlane-client.request',
        method: options.method,
        path: options.path,
        status: response.status,
        statusText: response.statusText,
        errorData: jsonData
      })
    }

    logger.info('sendlane-client.request.success', {
      method: options.method,
      path: options.path,
      status: response.status
    })

    // Return the parsed JSON data - caller is responsible for validation
    return jsonData
  }
}
