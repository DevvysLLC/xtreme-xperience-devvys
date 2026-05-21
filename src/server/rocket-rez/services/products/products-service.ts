import { ROUTES } from '../../../../config/routes'
import { AppError } from '../../../../core/errors/app-error'
import { safeAwait } from '../../../../core/errors/safe-await'
import {
  RocketRezGetEventProductResponseSchema as GetEventProductResponseSchema,
  RocketRezGetProductsResponseSchema as GetProductsResponseSchema,
  RocketRezGetRetailProductResponseSchema as GetRetailProductResponseSchema,
  RocketRezListEventSchedulesResponseSchema as ListEventSchedulesResponseSchema,
  RocketRezProductType
} from '../../../../io/schemas'
import type {
  RocketRezGetEventSchedulesRequest as GetEventSchedulesRequest,
  RocketRezGetProductRequest as GetProductRequest,
  RocketRezGetProductsRequest as GetProductsRequest,
  RocketRezGetProductsResponse as GetProductsResponse,
  RocketRezListEventSchedulesResponse as ListEventSchedulesResponse,
  RocketRezGetEventProductResponse,
  RocketRezGetRetailProductResponse
} from '../../../../io/types'
export class ProductsService {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken: string
  ) {
    if (!this.baseUrl) {
      throw new AppError(
        'ROCKET_REZ_API_BASE_URL environment variable is not set',
        {
          traceTag: 'products-service.constructor'
        }
      )
    }
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`
    }
  }

  private setSearchParams(url: URL, params: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) {
        continue
      }

      if (Array.isArray(value)) {
        if (value.length > 0) {
          url.searchParams.set(key, value.join(','))
        }
      } else {
        url.searchParams.set(key, String(value))
      }
    }
  }

  async getProducts(
    request: GetProductsRequest = {}
  ): Promise<GetProductsResponse> {
    const url = new URL(`${this.baseUrl}${ROUTES.ROCKET_REZ.PRODUCTS.BASE}`)

    this.setSearchParams(url, {
      pageSize: request.pageSize,
      pageIndex: request.pageIndex,
      type: request.type,
      category: request.category
    })

    const [error, response] = await safeAwait(
      fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders()
      })
    )

    if (error) {
      throw new AppError('Failed to get products', {
        traceTag: 'products-service.getProducts',
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      // Capture Retry-After header if present (for 429 rate limit errors)
      const retryAfter = response.headers.get('Retry-After')
      throw new AppError('Failed to get products', {
        traceTag: 'products-service.getProducts',
        status: response.status,
        statusText: response.statusText,
        errorData,
        retryAfter: retryAfter ? Number.parseInt(retryAfter, 10) : undefined
      })
    }

    const jsonData: unknown = await response.json()

    const parsed = GetProductsResponseSchema.safeParse(jsonData)
    if (parsed.success) {
      return parsed.data
    }

    throw new AppError('Invalid response format from products API', {
      traceTag: 'products-service.getProducts',
      validationError: parsed.error
    })
  }

  async getEvent(eventId: number): Promise<RocketRezGetEventProductResponse> {
    // getProduct validates and returns the correct type for Event
    const response = await this.getProduct({
      id: eventId,
      type: RocketRezProductType.EVENT
    })
    // TypeScript can't narrow the union, so we validate it's an Event response
    // This is a safety check - getProduct already validated it
    const validated = GetEventProductResponseSchema.safeParse(response)
    if (!validated.success) {
      throw new AppError('Unexpected response type from getProduct', {
        traceTag: 'products-service.getEvent',
        eventId,
        validationError: validated.error
      })
    }
    return validated.data
  }

  async getRetailProduct(
    productId: number
  ): Promise<RocketRezGetRetailProductResponse> {
    // getProduct validates and returns the correct type for Retail
    const response = await this.getProduct({
      id: productId,
      type: RocketRezProductType.RETAIL
    })
    // TypeScript can't narrow the union, so we validate it's a Retail response
    // This is a safety check - getProduct already validated it
    const validated = GetRetailProductResponseSchema.safeParse(response)
    if (!validated.success) {
      throw new AppError('Unexpected response type from getProduct', {
        traceTag: 'products-service.getRetailProduct',
        productId,
        validationError: validated.error
      })
    }
    return validated.data
  }

  async getGiftcardProduct(
    productId: number
  ): Promise<RocketRezGetRetailProductResponse> {
    // getProduct validates and returns the correct type for Giftcard
    // Giftcard API returns similar structure to Retail
    const response = await this.getProduct({
      id: productId,
      type: RocketRezProductType.GIFTCARD
    })
    // TypeScript can't narrow the union, so we validate it's a Retail-like response
    // This is a safety check - getProduct already validated it
    const validated = GetRetailProductResponseSchema.safeParse(response)
    if (!validated.success) {
      throw new AppError('Unexpected response type from getProduct', {
        traceTag: 'products-service.getGiftcardProduct',
        productId,
        validationError: validated.error
      })
    }
    return validated.data
  }

  async getProduct(
    request: GetProductRequest & { type: 'Event' | 'Retail' | 'Giftcard' }
  ): Promise<
    RocketRezGetEventProductResponse | RocketRezGetRetailProductResponse
  > {
    const url = `${this.baseUrl}${ROUTES.ROCKET_REZ.PRODUCTS.BY_TYPE_AND_ID(request.type, request.id)}`

    const [error, response] = await safeAwait(
      fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      })
    )

    if (error) {
      throw new AppError('Failed to get product', {
        traceTag: 'products-service.getProduct',
        productId: request.id,
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      // Capture Retry-After header if present (for 429 rate limit errors)
      const retryAfter = response.headers.get('Retry-After')
      throw new AppError('Failed to get product', {
        traceTag: 'products-service.getProduct',
        productId: request.id,
        status: response.status,
        statusText: response.statusText,
        errorData,
        retryAfter: retryAfter ? Number.parseInt(retryAfter, 10) : undefined
      })
    }

    const jsonData: unknown = await response.json()

    // Validate based on product type to catch errors early
    // This ensures we parse and validate the data structure properly
    if (request.type === RocketRezProductType.EVENT) {
      const parsed = GetEventProductResponseSchema.safeParse(jsonData)
      if (!parsed.success) {
        throw new AppError('Invalid response format from products API', {
          traceTag: 'products-service.getProduct',
          productId: request.id,
          type: request.type,
          validationError: parsed.error
        })
      }
      return parsed.data
    } else {
      // Retail or other types
      const parsed = GetRetailProductResponseSchema.safeParse(jsonData)
      if (!parsed.success) {
        throw new AppError('Invalid response format from products API', {
          traceTag: 'products-service.getProduct',
          productId: request.id,
          type: request.type,
          validationError: parsed.error
        })
      }
      return parsed.data
    }
  }

  async getEventSchedules(
    eventId: number,
    request: GetEventSchedulesRequest = {}
  ): Promise<ListEventSchedulesResponse> {
    const url = new URL(
      `${this.baseUrl}${ROUTES.ROCKET_REZ.PRODUCTS.EVENT_SCHEDULES(eventId)}`
    )

    this.setSearchParams(url, {
      pageSize: request.pageSize,
      pageIndex: request.pageIndex,
      rateId: request.rateId,
      siteId: request.siteId,
      seatTypeId: request.seatTypeId,
      type: request.type,
      startDate: request.startDate,
      endDate: request.endDate
    })

    const [error, response] = await safeAwait(
      fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders()
      })
    )

    if (error) {
      throw new AppError('Failed to get event schedules', {
        traceTag: 'products-service.getEventSchedules',
        eventId,
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      // Capture Retry-After header if present (for 429 rate limit errors)
      const retryAfter = response.headers.get('Retry-After')
      throw new AppError('Failed to get event schedules', {
        traceTag: 'products-service.getEventSchedules',
        eventId,
        status: response.status,
        statusText: response.statusText,
        errorData,
        retryAfter: retryAfter ? Number.parseInt(retryAfter, 10) : undefined
      })
    }

    const jsonData: unknown = await response.json()

    const parsed = ListEventSchedulesResponseSchema.safeParse(jsonData)
    if (parsed.success) {
      return parsed.data
    }

    throw new AppError('Invalid response format from event schedules API', {
      traceTag: 'products-service.getEventSchedules',
      validationError: parsed.error
    })
  }
}
