import { ROUTES } from '../../../../config/routes'
import { AppError } from '../../../../core/errors/app-error'
import { safeAwait } from '../../../../core/errors/safe-await'
import { logger } from '../../../../core/logger/logger'
import {
  RocketRezAddContactsResponseSchema,
  RocketRezAddCouponResponseSchema,
  RocketRezAddLineItemResponseSchema,
  RocketRezCreateCartResponseSchema,
  RocketRezGetCartResponseSchema,
  RocketRezGetPaymentGatewayClientSecretResponseSchema,
  RocketRezUpdateLineItemResponseSchema
} from '../../../../io/schemas'
import type {
  RocketRezAddContactsRequest,
  RocketRezAddContactsResponse,
  RocketRezAddCouponResponse,
  RocketRezAddLineItemRequest,
  RocketRezAddLineItemResponse,
  RocketRezCreateCartResponse,
  RocketRezGetCartResponse,
  RocketRezGetPaymentGatewayClientSecretRequest,
  RocketRezGetPaymentGatewayClientSecretResponse,
  RocketRezUpdateLineItemRequest,
  RocketRezUpdateLineItemResponse
} from '../../../../io/types'

export class CartService {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken: string,
    private readonly userGuid?: string
  ) {
    if (!this.baseUrl) {
      throw new AppError(
        'ROCKET_REZ_API_BASE_URL environment variable is not set',
        {
          traceTag: 'rocket-rez.cart-service.constructor'
        }
      )
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`
    }

    if (this.userGuid) {
      headers.RocketRezUserGuid = this.userGuid
    }

    return headers
  }

  async createCart(): Promise<RocketRezCreateCartResponse> {
    const url = `${this.baseUrl}${ROUTES.ROCKET_REZ.CART.BASE}`
    const tokenPreview = this.accessToken
      ? `${this.accessToken.slice(0, 10)}...${this.accessToken.slice(-10)}`
      : 'NO_TOKEN'

    logger.info('rocket-rez.cart-service.createCart', {
      url,
      tokenPreview,
      body: { lineItems: [] }
    })

    const [error, response] = await safeAwait(
      fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ lineItems: [] })
      })
    )

    if (error) {
      throw new AppError('Failed to create cart', {
        traceTag: 'rocket-rez.cart-service.createCart',
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AppError('Failed to create cart', {
        traceTag: 'rocket-rez.cart-service.createCart',
        status: response.status,
        statusText: response.statusText,
        errorData
      })
    }

    const jsonData: unknown = await response.json()
    logger.info(
      { response: jsonData },
      'rocket-rez.cart-service.createCart.raw-response'
    )

    const parsed = RocketRezCreateCartResponseSchema.safeParse(jsonData)
    if (parsed.success) {
      const cartTokenPreview = parsed.data.data.cartToken
        ? `${parsed.data.data.cartToken.slice(0, 10)}...${parsed.data.data.cartToken.slice(-10)}`
        : 'NO_TOKEN'
      logger.info('rocket-rez.cart-service.createCart.success', {
        cartId: parsed.data.data.cart.id,
        cartTokenPreview,
        tokenExpiry: parsed.data.data.tokenExpiry
      })
      return parsed.data
    }

    throw new AppError('Invalid response format from cart API', {
      traceTag: 'rocket-rez.cart-service.createCart',
      validationError: parsed.error
    })
  }

  async getCart(): Promise<RocketRezGetCartResponse> {
    const url = `${this.baseUrl}${ROUTES.ROCKET_REZ.CART.BASE}`

    logger.info('rocket-rez.cart-service.getCart', { url })

    const [error, response] = await safeAwait(
      fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      })
    )

    if (error) {
      throw new AppError('Failed to get cart', {
        traceTag: 'rocket-rez.cart-service.getCart',
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AppError('Failed to get cart', {
        traceTag: 'rocket-rez.cart-service.getCart',
        status: response.status,
        statusText: response.statusText,
        errorData
      })
    }

    const jsonData: unknown = await response.json()
    logger.info(
      { response: jsonData },
      'rocket-rez.cart-service.getCart.raw-response'
    )

    const parsed = RocketRezGetCartResponseSchema.safeParse(jsonData)
    if (parsed.success) {
      logger.info('rocket-rez.cart-service.getCart.success', {
        parsed: parsed.data
      })
      return parsed.data
    }

    throw new AppError('Invalid response format from cart API', {
      traceTag: 'rocket-rez.cart-service.getCart',
      validationError: parsed.error
    })
  }

  async addLineItems(
    request: RocketRezAddLineItemRequest
  ): Promise<RocketRezAddLineItemResponse> {
    if (!request.lineItems || request.lineItems.length === 0) {
      throw new AppError('No line items to add', {
        traceTag: 'rocket-rez.cart-service.addLineItems'
      })
    }

    const url = `${this.baseUrl}${ROUTES.ROCKET_REZ.CART.LINE_ITEMS}`
    const tokenPreview = this.accessToken
      ? `${this.accessToken.slice(0, 10)}...${this.accessToken.slice(-10)}`
      : 'NO_TOKEN'

    logger.info('rocket-rez.cart-service.addLineItems.start', {
      url,
      tokenPreview,
      itemCount: request.lineItems.length
    })

    let lastResult: RocketRezAddLineItemResponse | null = null

    for (const item of request.lineItems) {
      const singleItemRequest = { lineItems: [item] }
      logger.info('rocket-rez.cart-service.addLineItems.singleItem', {
        item
      })

      const [error, response] = await safeAwait(
        fetch(url, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(singleItemRequest)
        })
      )

      if (error) {
        logger.error('rocket-rez.cart-service.addLineItems.fetchError', {
          error: error.message,
          tokenPreview
        })
        throw new AppError('Failed to add line items to cart', {
          traceTag: 'rocket-rez.cart-service.addLineItems',
          originalError: error
        })
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        logger.error('rocket-rez.cart-service.addLineItems.apiError', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          tokenPreview
        })
        throw new AppError('Failed to add line items to cart', {
          traceTag: 'rocket-rez.cart-service.addLineItems',
          status: response.status,
          statusText: response.statusText,
          errorData
        })
      }

      const jsonData: unknown = await response.json()
      logger.info(
        { response: jsonData },
        'rocket-rez.cart-service.addLineItems.raw-response'
      )

      const parsed = RocketRezAddLineItemResponseSchema.safeParse(jsonData)
      if (parsed.success) {
        lastResult = parsed.data
      } else {
        throw new AppError('Invalid response format from cart API', {
          traceTag: 'rocket-rez.cart-service.addLineItems',
          validationError: parsed.error
        })
      }
    }

    if (!lastResult) {
      throw new AppError('Failed to obtain cart response', {
        traceTag: 'rocket-rez.cart-service.addLineItems'
      })
    }

    logger.info('rocket-rez.cart-service.addLineItems.success', {
      lastResult
    })

    return lastResult
  }

  async updateLineItem(
    lineItemId: number,
    request: RocketRezUpdateLineItemRequest
  ): Promise<RocketRezUpdateLineItemResponse> {
    const url = `${this.baseUrl}${ROUTES.ROCKET_REZ.CART.LINE_ITEM_BY_ID(lineItemId)}`

    logger.info('rocket-rez.cart-service.updateLineItem', {
      url,
      lineItemId,
      request
    })

    const [error, response] = await safeAwait(
      fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(request)
      })
    )

    if (error) {
      throw new AppError('Failed to update line item', {
        traceTag: 'rocket-rez.cart-service.updateLineItem',
        lineItemId,
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AppError('Failed to update line item', {
        traceTag: 'rocket-rez.cart-service.updateLineItem',
        lineItemId,
        status: response.status,
        statusText: response.statusText,
        errorData
      })
    }

    const jsonData: unknown = await response.json()
    logger.info(
      { response: jsonData },
      'rocket-rez.cart-service.updateLineItem.raw-response'
    )
    const parsed = RocketRezUpdateLineItemResponseSchema.safeParse(jsonData)

    if (parsed.success) {
      logger.info('rocket-rez.cart-service.updateLineItem.success', {
        parsed: parsed.data
      })
      return parsed.data
    }

    throw new AppError('Invalid response format from cart API', {
      traceTag: 'rocket-rez.cart-service.updateLineItem',
      validationError: parsed.error
    })
  }

  async addContacts(
    request: RocketRezAddContactsRequest
  ): Promise<RocketRezAddContactsResponse> {
    const url = `${this.baseUrl}${ROUTES.ROCKET_REZ.CART.CONTACT}`

    logger.info({ url, request }, 'rocket-rez.cart-service.addContacts')

    const [error, response] = await safeAwait(
      fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request)
      })
    )

    if (error) {
      throw new AppError('Failed to add contacts to cart', {
        traceTag: 'rocket-rez.cart-service.addContacts',
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AppError('Failed to add contacts to cart', {
        traceTag: 'rocket-rez.cart-service.addContacts',
        status: response.status,
        statusText: response.statusText,
        errorData
      })
    }

    const jsonData: unknown = await response.json()
    logger.info(
      { response: jsonData },
      'rocket-rez.cart-service.addContacts.raw-response'
    )

    logger.info(
      {
        jsonData
      },
      'rocket-rez.cart-service.addContacts.response'
    )

    const parsed = RocketRezAddContactsResponseSchema.safeParse(jsonData)
    if (parsed.success) {
      return parsed.data
    }

    throw new AppError('Invalid response format from cart API', {
      traceTag: 'rocket-rez.cart-service.addContacts',
      validationError: parsed.error
    })
  }

  async removeContact(contactId: number): Promise<void> {
    const url = `${this.baseUrl}${ROUTES.ROCKET_REZ.CART.CONTACT_BY_ID(contactId)}`

    logger.info('rocket-rez.cart-service.removeContact', { url, contactId })

    const [error, response] = await safeAwait(
      fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders()
      })
    )

    if (error) {
      throw new AppError('Failed to remove contact from cart', {
        traceTag: 'rocket-rez.cart-service.removeContact',
        contactId,
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AppError('Failed to remove contact from cart', {
        traceTag: 'rocket-rez.cart-service.removeContact',
        contactId,
        status: response.status,
        statusText: response.statusText,
        errorData
      })
    }
  }

  async addCoupon(request: {
    code?: string | null
    serial?: string | null
  }): Promise<RocketRezAddCouponResponse> {
    const url = `${this.baseUrl}${ROUTES.ROCKET_REZ.CART.COUPONS}`

    logger.info('rocket-rez.cart-service.addCoupon', { url, request })

    const payload = {
      code: request.code ?? null,
      serial: request.serial ?? null
    }

    logger.info('rocket-rez.cart-service.addCoupon.payload', { payload })

    const [error, response] = await safeAwait(
      fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      })
    )

    if (error) {
      throw new AppError('Failed to add coupon to cart', {
        traceTag: 'rocket-rez.cart-service.addCoupon',
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AppError('Failed to add coupon to cart', {
        traceTag: 'rocket-rez.cart-service.addCoupon',
        status: response.status,
        statusText: response.statusText,
        errorData
      })
    }

    const jsonData: unknown = await response.json()
    logger.info(
      { response: jsonData },
      'rocket-rez.cart-service.addCoupon.raw-response'
    )

    const parsed = RocketRezAddCouponResponseSchema.safeParse(jsonData)
    if (parsed.success) {
      return parsed.data
    }

    throw new AppError('Invalid response format from cart API', {
      traceTag: 'rocket-rez.cart-service.addCoupon',
      validationError: parsed.error
    })
  }

  async removeCoupon(id: number): Promise<void> {
    const url = `${this.baseUrl}${ROUTES.ROCKET_REZ.CART.COUPON_BY_ID(id)}`

    logger.info('rocket-rez.cart-service.removeCoupon', { url, couponId: id })

    const [error, response] = await safeAwait(
      fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders()
      })
    )

    if (error) {
      throw new AppError('Failed to remove coupon from cart', {
        traceTag: 'rocket-rez.cart-service.removeCoupon',
        id,
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AppError('Failed to remove coupon from cart', {
        traceTag: 'rocket-rez.cart-service.removeCoupon',
        id,
        status: response.status,
        statusText: response.statusText,
        errorData
      })
    }
  }

  async removeLineItem(lineItemId: number): Promise<void> {
    const url = `${this.baseUrl}${ROUTES.ROCKET_REZ.CART.LINE_ITEM_BY_ID(lineItemId)}`

    logger.info('rocket-rez.cart-service.removeLineItem', { url, lineItemId })

    const [error, response] = await safeAwait(
      fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders()
      })
    )

    if (error) {
      throw new AppError('Failed to remove line item from cart', {
        traceTag: 'rocket-rez.cart-service.removeLineItem',
        lineItemId,
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AppError('Failed to remove line item from cart', {
        traceTag: 'rocket-rez.cart-service.removeLineItem',
        lineItemId,
        status: response.status,
        statusText: response.statusText,
        errorData
      })
    }
  }

  async removeAllLineItems(): Promise<void> {
    const url = `${this.baseUrl}${ROUTES.ROCKET_REZ.CART.LINE_ITEMS}`

    logger.info('rocket-rez.cart-service.removeAllLineItems', { url })

    const [error, response] = await safeAwait(
      fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders()
      })
    )

    if (error) {
      throw new AppError('Failed to remove all line items from cart', {
        traceTag: 'rocket-rez.cart-service.removeAllLineItems',
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AppError('Failed to remove all line items from cart', {
        traceTag: 'rocket-rez.cart-service.removeAllLineItems',
        status: response.status,
        statusText: response.statusText,
        errorData
      })
    }

    logger.info('rocket-rez.cart-service.removeAllLineItems.success', { url })
  }

  async clearCart(): Promise<RocketRezCreateCartResponse> {
    // Step 1: Remove all line items from current cart
    const removeUrl = `${this.baseUrl}${ROUTES.ROCKET_REZ.CART.LINE_ITEMS}`

    logger.info('rocket-rez.cart-service.clearCart', {
      url: removeUrl
    })

    const [removeError, removeResponse] = await safeAwait(
      fetch(removeUrl, {
        method: 'DELETE',
        headers: this.getHeaders()
      })
    )

    if (removeError) {
      throw new AppError('Failed to remove all line items from cart', {
        traceTag: 'rocket-rez.cart-service.clearCart.removeError',
        originalError: removeError
      })
    }

    if (!removeResponse.ok) {
      const errorData = await removeResponse.json().catch(() => ({}))
      throw new AppError('Failed to remove all line items from cart', {
        traceTag: 'rocket-rez.cart-service.clearCart.removeLineItems',
        status: removeResponse.status,
        statusText: removeResponse.statusText,
        errorData
      })
    }

    logger.info('rocket-rez.cart-service.clearCart.removeSuccess', {
      url: removeUrl
    })

    // Step 2: Create a new empty cart
    const createUrl = `${this.baseUrl}${ROUTES.ROCKET_REZ.CART.BASE}`
    const tokenPreview = this.accessToken
      ? `${this.accessToken.slice(0, 10)}...${this.accessToken.slice(-10)}`
      : 'NO_TOKEN'

    logger.info('rocket-rez.cart-service.clearCart.createCart', {
      url: createUrl,
      tokenPreview,
      body: { lineItems: [] }
    })

    const [createError, createResponse] = await safeAwait(
      fetch(createUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ lineItems: [] })
      })
    )

    if (createError) {
      throw new AppError('Failed to create new cart', {
        traceTag: 'rocket-rez.cart-service.clearCart.createCart',
        originalError: createError
      })
    }

    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}))
      throw new AppError('Failed to create new cart', {
        traceTag: 'rocket-rez.cart-service.clearCart.createCart',
        status: createResponse.status,
        statusText: createResponse.statusText,
        errorData
      })
    }

    const jsonData: unknown = await createResponse.json()
    logger.info(
      { response: jsonData },
      'rocket-rez.cart-service.clearCart.raw-response'
    )

    const parsed = RocketRezCreateCartResponseSchema.safeParse(jsonData)
    if (parsed.success) {
      const cartTokenPreview = parsed.data.data.cartToken
        ? `${parsed.data.data.cartToken.slice(0, 10)}...${parsed.data.data.cartToken.slice(-10)}`
        : 'NO_TOKEN'
      logger.info('rocket-rez.cart-service.clearCart.success', {
        cartId: parsed.data.data.cart.id,
        cartTokenPreview,
        tokenExpiry: parsed.data.data.tokenExpiry
      })
      return parsed.data
    }

    throw new AppError('Invalid response format from cart API', {
      traceTag: 'rocket-rez.cart-service.clearCart.createCart',
      validationError: parsed.error
    })
  }

  async updateContact(
    contactId: number,
    request: RocketRezAddContactsRequest
  ): Promise<RocketRezAddContactsResponse> {
    const url = `${this.baseUrl}${ROUTES.ROCKET_REZ.CART.CONTACT}`

    logger.info(
      { contactId, request },
      'rocket-rez.cart-service.updateContact',
      {
        url,
        contactId,
        request
      }
    )

    if (request.contacts.length === 0) {
      throw new AppError('Contacts array is required', {
        traceTag: 'rocket-rez.cart-service.updateContact',
        contactId,
        request
      })
    }

    // ensure all contacts have ids
    for (const contact of request.contacts) {
      if (!contact.id) {
        throw new AppError('Contact ID is required', {
          traceTag: 'rocket-rez.cart-service.updateContact',
          contactId,
          request
        })
      }
    }

    const [error, response] = await safeAwait(
      fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(request)
      })
    )

    if (error) {
      throw new AppError('Failed to update contact in cart', {
        traceTag: 'rocket-rez.cart-service.updateContact',
        contactId,
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AppError('Failed to update contact in cart', {
        traceTag: 'rocket-rez.cart-service.updateContact',
        contactId,
        status: response.status,
        statusText: response.statusText,
        errorData
      })
    }

    const jsonData: unknown = await response.json()
    logger.info(
      { response: jsonData },
      'rocket-rez.cart-service.updateContact.raw-response'
    )

    logger.info(
      {
        jsonData
      },
      'rocket-rez.cart-service.updateContact.response'
    )

    const parsed = RocketRezAddContactsResponseSchema.safeParse(jsonData)
    if (parsed.success) {
      return parsed.data
    }

    throw new AppError('Invalid response format from cart API', {
      traceTag: 'rocket-rez.cart-service.updateContact',
      validationError: parsed.error
    })
  }

  async getPaymentGatewayClientSecret(
    request: RocketRezGetPaymentGatewayClientSecretRequest,
    cartToken: string,
    userGuid: string
  ): Promise<RocketRezGetPaymentGatewayClientSecretResponse> {
    const paymentMethodId =
      process.env.ROCKET_REZ_PAYMENTS_API_PAYMENT_METHOD_ID

    if (!paymentMethodId) {
      throw new AppError(
        'ROCKET_REZ_PAYMENTS_API_PAYMENT_METHOD_ID environment variable is not set',
        {
          traceTag: 'rocket-rez.cart-service.getPaymentGatewayClientSecret'
        }
      )
    }

    const queryParams = new URLSearchParams({
      paymentMethodId,
      isCardOnFile: 'false'
    })

    const url = `${this.baseUrl}${ROUTES.ROCKET_REZ.CART.PAYMENT_GATEWAY_CLIENT_SECRET}?${queryParams.toString()}`

    logger.info(
      {
        url,
        queryParams,
        request,
        cartTokenPreview: cartToken
          ? `${cartToken.slice(0, 10)}...${cartToken.slice(-10)}`
          : 'NO_TOKEN',
        userGuidPreview: userGuid ? `${userGuid.slice(0, 10)}...` : 'NO_GUID'
      },
      'rocket-rez.cart-service.getPaymentGatewayClientSecret'
    )

    const headers: HeadersInit = {
      Authorization: `Bearer ${cartToken}`,
      RocketRezUserGuid: userGuid
    }

    const [error, response] = await safeAwait(
      fetch(url, {
        method: 'GET',
        headers
      })
    )

    if (error) {
      throw new AppError('Failed to get payment gateway client secret', {
        traceTag: 'rocket-rez.cart-service.getPaymentGatewayClientSecret',
        originalError: error
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AppError('Failed to get payment gateway client secret', {
        traceTag: 'rocket-rez.cart-service.getPaymentGatewayClientSecret',
        status: response.status,
        statusText: response.statusText,
        errorData
      })
    }

    const jsonData: unknown = await response.json()
    logger.info(
      { response: jsonData },
      'rocket-rez.cart-service.getPaymentGatewayClientSecret.raw-response'
    )

    const parsed =
      RocketRezGetPaymentGatewayClientSecretResponseSchema.safeParse(jsonData)
    if (!parsed.success) {
      throw new AppError('Invalid response format from payment gateway API', {
        traceTag: 'rocket-rez.cart-service.getPaymentGatewayClientSecret',
        validationError: parsed.error,
        responseData: jsonData
      })
    }

    if (!parsed.data.result.data) {
      throw new AppError(
        parsed.data.result.errorMessage ?? 'Payment gateway returned no data',
        {
          traceTag: 'rocket-rez.cart-service.getPaymentGatewayClientSecret',
          statusCode: parsed.data.result.statusCode,
          errorMessage: parsed.data.result.errorMessage,
          paymentMethodId
        }
      )
    }

    logger.info(
      'rocket-rez.cart-service.getPaymentGatewayClientSecret.success',
      {
        clientSecretPreview: parsed.data.result.data.clientSecret
          ? `${parsed.data.result.data.clientSecret.slice(0, 20)}...`
          : 'NO_SECRET'
      }
    )
    return parsed.data
  }
}
