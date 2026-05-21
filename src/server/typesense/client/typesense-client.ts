import { z } from 'zod'
import type { Logger } from '../../../core/logger'

export type TypesenseClientConfig = {
  apiKey: string
  baseUrl: string
  logger: Logger
}

export class TypesenseClient {
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly logger: Logger

  constructor({ apiKey, baseUrl, logger }: TypesenseClientConfig) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
    this.logger = logger.child({ name: 'typesense-client' })
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<unknown> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      'X-TYPESENSE-API-KEY': this.apiKey,
      ...options.headers
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      })

      if (!response.ok) {
        const errorText = await response.text()
        this.logger.error(
          { status: response.status, error: errorText },
          'Typesense request failed'
        )
        throw new Error(
          `Typesense request failed: ${response.status} - ${errorText}`
        )
      }

      return await response.json()
    } catch (error) {
      this.logger.error({ error, endpoint }, 'Typesense request error')
      throw error
    }
  }

  private async requestWithSchema<T>(
    endpoint: string,
    schema: z.ZodSchema<T>,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await this.request(endpoint, options)
    const result = schema.safeParse(response)
    if (!result.success) {
      this.logger.error(
        { error: result.error, endpoint },
        'Response validation failed'
      )
      throw new Error(`Invalid response format: ${result.error.message}`)
    }
    return result.data
  }

  private validateEchoResponse<T>(response: unknown, input: T): T {
    // Typesense echoes back what was sent, but may add additional fields
    // like num_documents, created_at, etc. We validate that all input fields
    // are present in the response, but allow additional fields.
    if (typeof response !== 'object' || response === null) {
      throw new Error('Response is not an object')
    }

    const responseObj: Record<string, unknown> = {}
    const inputObj: Record<string, unknown> = {}

    // Type guard to ensure response is a record
    if (
      typeof response === 'object' &&
      response !== null &&
      !Array.isArray(response)
    ) {
      Object.assign(responseObj, response)
    } else {
      throw new Error('Response is not a valid object')
    }

    // Type guard to ensure input is a record
    if (typeof input === 'object' && input !== null && !Array.isArray(input)) {
      Object.assign(inputObj, input)
    } else {
      throw new Error('Input is not a valid object')
    }

    // Check that all input fields are present in response
    for (const key in inputObj) {
      if (!(key in responseObj)) {
        throw new Error(`Response missing field: ${key}`)
      }
    }

    // Return the response (which includes our input fields plus any extras Typesense added)
    // Create a new object starting with input (T) and adding response fields to satisfy type system
    const result: Record<string, unknown> = { ...inputObj, ...responseObj }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return result as unknown as T
  }

  async createCollection<T>(schema: T): Promise<T> {
    const schemaJson = JSON.stringify(schema)
    this.logger.debug({ schema: schemaJson }, 'Creating collection with schema')
    const response = await this.request('/collections', {
      method: 'POST',
      body: schemaJson
    })
    return this.validateEchoResponse(response, schema)
  }

  async getCollection(name: string): Promise<unknown> {
    return this.request(`/collections/${name}`)
  }

  async deleteCollection(name: string): Promise<unknown> {
    return this.request(`/collections/${name}`, {
      method: 'DELETE'
    })
  }

  async indexDocument<T>(collectionName: string, document: T): Promise<T> {
    const response = await this.request(
      `/collections/${collectionName}/documents`,
      {
        method: 'POST',
        body: JSON.stringify(document)
      }
    )
    return this.validateEchoResponse(response, document)
  }

  async indexDocuments<T>(
    collectionName: string,
    documents: T[]
  ): Promise<void> {
    const importData = documents.map((doc) => JSON.stringify(doc)).join('\n')
    const url = `${this.baseUrl}/collections/${collectionName}/documents/import?action=upsert`
    const headers = {
      'Content-Type': 'text/plain',
      'X-TYPESENSE-API-KEY': this.apiKey
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: importData,
        headers
      })

      if (!response.ok) {
        const errorText = await response.text()
        this.logger.error(
          { status: response.status, error: errorText },
          'Typesense import failed'
        )
        throw new Error(
          `Typesense import failed: ${response.status} - ${errorText}`
        )
      }

      // Import endpoint returns text/plain with one JSON object per line
      const responseText = await response.text()
      const lines = responseText.trim().split('\n')

      // Check for any errors in the response
      const ErrorResultSchema = z.object({
        success: z.literal(false),
        error: z.string().optional()
      })

      const errors = lines
        .map((line) => {
          try {
            const parsed: unknown = JSON.parse(line)
            const result = ErrorResultSchema.safeParse(parsed)
            if (result.success) {
              return result.data
            }
            return null
          } catch {
            return null
          }
        })
        .filter(
          (result): result is { success: false; error?: string } =>
            result !== null
        )

      if (errors.length > 0) {
        this.logger.error({ errors }, 'Some documents failed to import')
        throw new Error(`Failed to import ${errors.length} documents`)
      }

      this.logger.info(
        { count: documents.length },
        'Successfully imported documents'
      )
    } catch (error) {
      this.logger.error({ error, collectionName }, 'Typesense import error')
      throw error
    }
  }

  async deleteDocument(
    collectionName: string,
    documentId: string
  ): Promise<unknown> {
    return this.request(
      `/collections/${collectionName}/documents/${documentId}`,
      {
        method: 'DELETE'
      }
    )
  }

  async search<T>(
    collectionName: string,
    schema: z.ZodSchema<T>,
    searchParams: {
      q: string
      query_by: string
      filter_by?: string
      sort_by?: string
      per_page?: number
      page?: number
    }
  ): Promise<T> {
    const params = new URLSearchParams({
      q: searchParams.q,
      query_by: searchParams.query_by,
      ...(searchParams.filter_by && { filter_by: searchParams.filter_by }),
      ...(searchParams.sort_by && { sort_by: searchParams.sort_by }),
      ...(searchParams.per_page && {
        per_page: String(searchParams.per_page)
      }),
      ...(searchParams.page && { page: String(searchParams.page) })
    })

    return this.requestWithSchema<T>(
      `/collections/${collectionName}/documents/search?${params.toString()}`,
      schema
    )
  }
}
