import { AppError } from '../../../../core/errors/app-error'
import { logger } from '../../../../core/logger/logger'
import { RocketRezProductType } from '../../../../io/schemas'
import type {
  CartLineItemMetadata,
  MiddlewareCartResponse,
  OrderResponse,
  PersistedLocationState,
  RocketRezAddContactsRequest,
  RocketRezAddCouponRequest,
  RocketRezAddLineItemRequest,
  RocketRezUpdateLineItemRequest
} from '../../../../io/types'
import { CartKeyHelpers } from '../../../../utils/cart-key'
import type { RocketRezClient } from '../../../rocket-rez/index'
import type { CartService as RocketRezCartService } from '../../../rocket-rez/services/cart/cart-service'
import type { OrderService } from '../order-service'

type RefreshedCartContext = {
  cartService: RocketRezCartService
  cartToken: string
  tokenExpiry: string | null
}

const isRecoverableCartContextError = (error: unknown): boolean => {
  if (!(error instanceof AppError)) {
    return false
  }

  if (
    error.details?.traceTag === 'auth-service.refreshCartToken' &&
    (error.details?.status === 400 ||
      error.details?.status === 401 ||
      error.details?.status === 403)
  ) {
    return true
  }

  if (
    error.details?.traceTag === 'rocket-rez.cart-service.getCart' &&
    (error.details?.status === 401 ||
      error.details?.status === 403 ||
      error.details?.status === 404)
  ) {
    return true
  }

  return false
}

export class CartService {
  constructor(
    private readonly rocketRezClient?: RocketRezClient,
    private readonly orderService?: OrderService
  ) {}

  private ensureClient(traceTag: string): RocketRezClient {
    if (!this.rocketRezClient) {
      throw new AppError('RocketRez client not available', { traceTag })
    }
    return this.rocketRezClient
  }

  private getRocketRezCartService(
    userGuid: string
  ): Promise<RocketRezCartService> {
    if (!userGuid) {
      throw new AppError('userGuid is required', {
        traceTag: 'cart-service.getRocketRezCartService'
      })
    }
    return this.ensureClient('cart-service').getCartService(undefined, userGuid)
  }

  private async refreshAndGetCartService(
    cartKey: string,
    operationName: string,
    userGuid: string
  ): Promise<RefreshedCartContext> {
    if (!userGuid) {
      throw new AppError('userGuid is required', {
        traceTag: `cart-service.${operationName}`
      })
    }
    logger.info(
      {
        operationName,
        cartKeyLength: cartKey?.length ?? 0,
        hasUserGuid: !!userGuid
      },
      'middleware.cart-service.refreshCartToken.start'
    )

    const parsed = CartKeyHelpers.parse(cartKey)
    if (!parsed) {
      logger.error(
        {
          operationName,
          cartKey
        },
        'middleware.cart-service.refreshCartToken.invalidCartKey'
      )
      throw new AppError('Invalid cart key format', {
        traceTag: `cart-service.${operationName}`
      })
    }

    const { cartId, cartToken: existingToken } = parsed
    logger.info(
      {
        operationName,
        cartId,
        existingTokenPreview: existingToken
          ? `${existingToken.slice(0, 10)}...`
          : 'NO_TOKEN'
      },
      'middleware.cart-service.refreshCartToken.parsed'
    )

    const client = this.ensureClient(`cart-service.${operationName}`)

    logger.info(
      { operationName, cartId },
      'middleware.cart-service.refreshCartToken.refreshing'
    )
    const refreshed = await client.refreshCartToken(cartId)
    logger.info(
      {
        operationName,
        cartId,
        newTokenPreview: refreshed.cartToken
          ? `${refreshed.cartToken.slice(0, 10)}...`
          : 'NO_TOKEN',
        tokenExpiry: refreshed.tokenExpiry
      },
      'middleware.cart-service.refreshCartToken.refreshed'
    )

    const cartService = await client.getCartService(
      refreshed.cartToken,
      userGuid
    )
    logger.info(
      { operationName, cartId },
      'middleware.cart-service.refreshCartToken.complete'
    )

    return {
      cartService,
      cartToken: refreshed.cartToken,
      tokenExpiry: refreshed.tokenExpiry
    }
  }

  private async createNewCartContext(
    userGuid: string
  ): Promise<RefreshedCartContext> {
    if (!userGuid) {
      throw new AppError('userGuid is required', {
        traceTag: 'cart-service.createNewCartContext'
      })
    }

    logger.info(
      { hasUserGuid: !!userGuid },
      'middleware.cart-service.createNewCart.start'
    )

    const client = this.ensureClient('cart-service.createNewCart')
    logger.info({}, 'middleware.cart-service.createNewCart.clientEnsured')

    // Re-authenticate to ensure we have a fresh client credentials token
    // (not a cart token from a previous operation)
    logger.info({}, 'middleware.cart-service.createNewCart.reAuthenticating')
    await client.authenticate('read_carts write_carts')
    logger.info({}, 'middleware.cart-service.createNewCart.reAuthenticated')

    const cartService = await this.getRocketRezCartService(userGuid)
    logger.info(
      { tokenType: 'client_credentials', hasUserGuid: !!userGuid },
      'middleware.cart-service.createNewCart.gotBaseCartService'
    )

    const createResponse = await cartService.createCart()
    logger.info(
      {
        cartId: createResponse.data.cart.id,
        cartStatus: createResponse.data.cart.status,
        lineItemsCount: createResponse.data.cart.lineItems?.length ?? 0
      },
      'middleware.cart-service.createNewCart.cartCreated'
    )

    const { cartToken, tokenExpiry } = createResponse.data
    logger.info(
      {
        cartTokenPreview: cartToken
          ? `${cartToken.slice(0, 10)}...${cartToken.slice(-10)}`
          : 'NO_TOKEN',
        tokenExpiry
      },
      'middleware.cart-service.createNewCart.extractedToken'
    )

    const cartServiceWithToken = await client.getCartService(
      cartToken,
      userGuid
    )
    logger.info(
      { cartId: createResponse.data.cart.id },
      'middleware.cart-service.createNewCart.gotCartServiceWithToken'
    )

    return {
      cartService: cartServiceWithToken,
      cartToken,
      tokenExpiry
    }
  }

  getCartId(cartKey: string): string | null {
    return CartKeyHelpers.getId(cartKey)
  }

  getCartToken(cartKey: string): string | null {
    return CartKeyHelpers.getToken(cartKey)
  }

  getCartKey(cartId: string, cartToken: string): string {
    return CartKeyHelpers.create(cartId, cartToken)
  }

  private normalizeLineItemId(id: unknown): number | null {
    if (id == null) {
      return null
    }

    const asNumber = Number(id)
    return Number.isFinite(asNumber) ? asNumber : null
  }

  private getPrimaryEventLineItem(
    lineItems: Array<{
      id?: number | string | null
      type?: string | null
      scheduleId?: number | null
      rateId?: number | null
      rateType?: string | null
    }>
  ) {
    const eventLineItem = [...lineItems]
      .reverse()
      .find((lineItem) => lineItem.type === RocketRezProductType.EVENT)

    if (!eventLineItem) {
      return null
    }

    const id = this.normalizeLineItemId(eventLineItem.id)

    if (id == null) {
      return null
    }

    return {
      id,
      scheduleId: eventLineItem.scheduleId ?? null,
      rateId: eventLineItem.rateId ?? null,
      rateType: eventLineItem.rateType ?? null
    }
  }

  private getPrimaryEventRequestLinkContext(
    lineItems: Array<{
      type?: string | null
      scheduleId?: number | null
      rateId?: number | null
      rateType?: string | null
    }>
  ) {
    const eventLineItem = [...lineItems]
      .reverse()
      .find((lineItem) => lineItem.type === RocketRezProductType.EVENT)

    if (!eventLineItem) {
      return null
    }

    return {
      scheduleId: eventLineItem.scheduleId ?? null,
      rateId: eventLineItem.rateId ?? null,
      rateType: eventLineItem.rateType ?? null
    }
  }

  private enrichLinkedLineItems(
    request: RocketRezAddLineItemRequest,
    cartLineItems: Array<{
      id?: number | string | null
      type?: string | null
      scheduleId?: number | null
      rateId?: number | null
      rateType?: string | null
    }>
  ): RocketRezAddLineItemRequest {
    if (!request.lineItems || request.lineItems.length === 0) {
      return request
    }

    const parentById = new Map<
      number,
      {
        id: number
        scheduleId: number | null
        rateId: number | null
        rateType: string | null
      }
    >()

    for (const cartLineItem of cartLineItems) {
      const normalizedId = this.normalizeLineItemId(cartLineItem.id)
      if (normalizedId == null) {
        continue
      }

      parentById.set(normalizedId, {
        id: normalizedId,
        scheduleId: cartLineItem.scheduleId ?? null,
        rateId: cartLineItem.rateId ?? null,
        rateType: cartLineItem.rateType ?? null
      })
    }

    const fallbackParent = this.getPrimaryEventLineItem(cartLineItems)
    const requestEventLinkContext = this.getPrimaryEventRequestLinkContext(
      request.lineItems
    )

    const lineItems = request.lineItems.map((lineItem) => {
      if (lineItem.type === RocketRezProductType.EVENT) {
        return lineItem
      }

      const parentFromRequestId = this.normalizeLineItemId(
        lineItem.parentLineItemId
      )
      const explicitParent =
        parentFromRequestId != null ? parentById.get(parentFromRequestId) : null
      const parent = explicitParent ?? fallbackParent

      const linkSource =
        parent ??
        (requestEventLinkContext
          ? {
              id: null,
              scheduleId: requestEventLinkContext.scheduleId,
              rateId: requestEventLinkContext.rateId,
              rateType: requestEventLinkContext.rateType
            }
          : null)

      if (!linkSource) {
        return lineItem
      }

      return {
        ...lineItem,
        parentLineItemId:
          lineItem.parentLineItemId ?? linkSource.id ?? undefined,
        scheduleId: lineItem.scheduleId ?? linkSource.scheduleId,
        rateId: lineItem.rateId ?? linkSource.rateId,
        rateType: lineItem.rateType ?? linkSource.rateType
      }
    })

    return {
      ...request,
      lineItems
    }
  }

  async addToCart(
    request: RocketRezAddLineItemRequest,
    cartKey: string | null,
    userGuid: string
  ): Promise<MiddlewareCartResponse> {
    if (!userGuid) {
      throw new AppError('userGuid is required', {
        traceTag: 'cart-service.addToCart'
      })
    }
    logger.info(
      {
        request,
        hasCartKey: !!cartKey,
        cartKeyPreview: cartKey ? `${cartKey.slice(0, 20)}...` : 'NO_KEY'
      },
      'middleware.cart-service.addToCart.start'
    )

    // Determine if we need a new cart
    const parsedCartKey = cartKey ? CartKeyHelpers.parse(cartKey) : null
    const validCartKey = parsedCartKey ? cartKey : null
    const isNewCart = !validCartKey

    logger.info(
      {
        cartKeyProvided: !!cartKey,
        cartKeyParsed: !!parsedCartKey,
        validCartKey: !!validCartKey,
        isNewCart
      },
      'middleware.cart-service.addToCart.cartKeyValidation'
    )

    // Get cart context (either new cart or refreshed existing cart)
    logger.info(
      {
        isNewCart,
        method: isNewCart ? 'createNewCartContext' : 'refreshAndGetCartService'
      },
      'middleware.cart-service.addToCart.gettingContext'
    )

    let context: RefreshedCartContext

    if (validCartKey) {
      try {
        context = await this.refreshAndGetCartService(
          validCartKey,
          'addToCart',
          userGuid
        )
      } catch (error) {
        if (!isRecoverableCartContextError(error)) {
          throw error
        }

        logger.info(
          { hasCartKey: true },
          'middleware.cart-service.addToCart.recoveringWithNewCart'
        )
        context = await this.createNewCartContext(userGuid)
      }
    } else {
      context = await this.createNewCartContext(userGuid)
    }

    logger.info(
      {
        cartTokenPreview: context.cartToken
          ? `${context.cartToken.slice(0, 10)}...${context.cartToken.slice(-10)}`
          : 'NO_TOKEN',
        tokenExpiry: context.tokenExpiry
      },
      'middleware.cart-service.addToCart.contextReady'
    )

    let rocketRezRequest = request

    if (rocketRezRequest.lineItems?.length) {
      try {
        const currentCartResponse = await context.cartService.getCart()
        rocketRezRequest = this.enrichLinkedLineItems(
          rocketRezRequest,
          currentCartResponse.data.lineItems ?? []
        )
      } catch (error) {
        logger.warn(
          { error },
          'middleware.cart-service.addToCart.enrichLinkedLineItems.failed'
        )
      }
    }

    logger.info(
      {
        lineItemsCount: rocketRezRequest.lineItems?.length ?? 0,
        lineItems: rocketRezRequest.lineItems
      },
      'middleware.cart-service.addToCart.request'
    )

    // Add line items
    logger.info(
      {
        lineItemsCount: rocketRezRequest.lineItems?.length ?? 0
      },
      'middleware.cart-service.addToCart.addingLineItems'
    )

    const response = await context.cartService.addLineItems(rocketRezRequest)

    logger.info(
      {
        cartId: response.data.id,
        cartStatus: response.data.status,
        lineItemsCount: response.data.lineItems?.length ?? 0,
        total: response.data.total
      },
      'middleware.cart-service.addToCart.lineItemsAdded'
    )

    const result = {
      cart: response.data,
      cartToken: context.cartToken,
      tokenExpiry: context.tokenExpiry
    }

    return result
  }

  async getCart(
    cartKey: string,
    userGuid: string
  ): Promise<MiddlewareCartResponse> {
    if (!userGuid) {
      throw new AppError('userGuid is required', {
        traceTag: 'cart-service.getCart'
      })
    }
    logger.info({ hasCartKey: true }, 'middleware.cart-service.getCart.start')

    const context = await this.refreshAndGetCartService(
      cartKey,
      'getCart',
      userGuid
    )
    const response = await context.cartService.getCart()

    const result = {
      cart: response.data,
      cartToken: context.cartToken,
      tokenExpiry: context.tokenExpiry
    }

    return result
  }

  async removeLineItem(
    lineItemId: number,
    cartKey: string,
    userGuid: string
  ): Promise<MiddlewareCartResponse> {
    if (!userGuid) {
      throw new AppError('userGuid is required', {
        traceTag: 'cart-service.removeLineItem'
      })
    }
    logger.info(
      { lineItemId, hasCartKey: true },
      'middleware.cart-service.removeLineItem.start'
    )

    const context = await this.refreshAndGetCartService(
      cartKey,
      'removeLineItem',
      userGuid
    )
    await context.cartService.removeLineItem(lineItemId)
    const response = await context.cartService.getCart()

    const result = {
      cart: response.data,
      cartToken: context.cartToken,
      tokenExpiry: context.tokenExpiry
    }

    return result
  }

  async clearCart(
    cartKey: string,
    userGuid: string
  ): Promise<MiddlewareCartResponse> {
    if (!userGuid) {
      throw new AppError('userGuid is required', {
        traceTag: 'cart-service.clearCart'
      })
    }
    logger.info({ hasCartKey: true }, 'middleware.cart-service.clearCart.start')

    // Step 1: Remove all line items from the current cart (to restore inventory)
    // Use the existing cart token to perform this operation
    const existingContext = await this.refreshAndGetCartService(
      cartKey,
      'clearCart.removeItems',
      userGuid
    )

    logger.info(
      { cartId: this.getCartId(cartKey) },
      'middleware.cart-service.clearCart.removingItems'
    )

    await existingContext.cartService.removeAllLineItems()

    logger.info({}, 'middleware.cart-service.clearCart.itemsRemoved')

    // Step 2: Create a completely new cart from scratch with a fresh token
    // This ensures we get a fresh cart ID and token (not tied to the old cart)
    // Use createNewCartContext to ensure userGuid is properly associated
    const newCartContext = await this.createNewCartContext(userGuid)
    logger.info(
      {
        cartId: newCartContext.cartService ? 'created' : 'failed',
        hasUserGuid: !!userGuid
      },
      'middleware.cart-service.clearCart.newCartCreated'
    )

    const cartResponse = await newCartContext.cartService.getCart()
    const result = {
      cart: cartResponse.data,
      cartToken: newCartContext.cartToken,
      tokenExpiry: newCartContext.tokenExpiry
    }

    return result
  }

  async updateLineItem(
    lineItemId: number,
    request: RocketRezUpdateLineItemRequest,
    cartKey: string,
    userGuid: string
  ): Promise<MiddlewareCartResponse> {
    if (!userGuid) {
      throw new AppError('userGuid is required', {
        traceTag: 'cart-service.updateLineItem'
      })
    }
    logger.info({ lineItemId, hasCartKey: true }, 'cart-service.updateLineItem')

    const rocketRezRequest: RocketRezUpdateLineItemRequest = request

    const context = await this.refreshAndGetCartService(
      cartKey,
      'updateLineItem',
      userGuid
    )
    const response = await context.cartService.updateLineItem(
      lineItemId,
      rocketRezRequest
    )

    const result = {
      cart: response.data,
      cartToken: context.cartToken,
      tokenExpiry: context.tokenExpiry
    }

    return result
  }

  async addContacts(
    request: RocketRezAddContactsRequest,
    cartKey: string,
    userGuid: string
  ): Promise<MiddlewareCartResponse> {
    if (!userGuid) {
      throw new AppError('userGuid is required', {
        traceTag: 'cart-service.addContacts'
      })
    }
    logger.info(
      {
        contactCount: request.contacts?.length ?? 0,
        hasCartKey: true
      },
      'middleware.cart-service.addContacts'
    )

    const rocketRezRequest: RocketRezAddContactsRequest = request

    const context = await this.refreshAndGetCartService(
      cartKey,
      'addContacts',
      userGuid
    )
    const response = await context.cartService.addContacts(rocketRezRequest)

    const result = {
      cart: response.data,
      cartToken: context.cartToken,
      tokenExpiry: context.tokenExpiry
    }

    return result
  }

  async removeContact(
    contactId: number,
    cartKey: string,
    userGuid: string
  ): Promise<MiddlewareCartResponse> {
    if (!userGuid) {
      throw new AppError('userGuid is required', {
        traceTag: 'cart-service.removeContact'
      })
    }
    logger.info(
      {
        contactId,
        hasCartKey: true
      },
      'middleware.cart-service.removeContact'
    )

    const context = await this.refreshAndGetCartService(
      cartKey,
      'removeContact',
      userGuid
    )
    await context.cartService.removeContact(contactId)
    const response = await context.cartService.getCart()

    const result = {
      cart: response.data,
      cartToken: context.cartToken,
      tokenExpiry: context.tokenExpiry
    }

    return result
  }

  async updateContact(
    contactId: number,
    request: RocketRezAddContactsRequest,
    cartKey: string,
    userGuid: string
  ): Promise<MiddlewareCartResponse> {
    if (!userGuid) {
      throw new AppError('userGuid is required', {
        traceTag: 'cart-service.updateContact'
      })
    }
    logger.info(
      { contactId, hasCartKey: true },
      'middleware.cart-service.updateContact'
    )

    const rocketRezRequest: RocketRezAddContactsRequest = request

    const context = await this.refreshAndGetCartService(
      cartKey,
      'updateContact',
      userGuid
    )
    const response = await context.cartService.updateContact(
      contactId,
      rocketRezRequest
    )

    const result = {
      cart: response.data,
      cartToken: context.cartToken,
      tokenExpiry: context.tokenExpiry
    }

    return result
  }

  async addCoupon(
    request: RocketRezAddCouponRequest,
    cartKey: string,
    userGuid: string
  ): Promise<MiddlewareCartResponse> {
    if (!userGuid) {
      throw new AppError('userGuid is required', {
        traceTag: 'cart-service.addCoupon'
      })
    }
    logger.info(
      {
        request
      },
      'middleware.cart-service.addCoupon'
    )

    const coupon = request.coupon.trim()

    const context = await this.refreshAndGetCartService(
      cartKey,
      'addCoupon',
      userGuid
    )
    let response: Awaited<
      ReturnType<typeof context.cartService.addCoupon>
    > | null = null
    let lastError: unknown = null

    const addCouponPayloads = [{ code: coupon }, { serial: coupon }]

    for (const [index, addCouponPayload] of addCouponPayloads.entries()) {
      try {
        response = await context.cartService.addCoupon(addCouponPayload)
        break
      } catch (error) {
        lastError = error

        if (index < addCouponPayloads.length - 1) {
          logger.warn(
            {
              addCouponPayload,
              attempt: index + 1
            },
            'middleware.cart-service.addCoupon.retrying-with-alternate-payload'
          )
        }
      }
    }

    if (response == null) {
      throw lastError
    }

    const result = {
      cart: response.data,
      cartToken: context.cartToken,
      tokenExpiry: context.tokenExpiry
    }

    return result
  }

  async removeCoupon(
    couponId: number,
    cartKey: string,
    userGuid: string
  ): Promise<MiddlewareCartResponse> {
    if (!userGuid) {
      throw new AppError('userGuid is required', {
        traceTag: 'cart-service.removeCoupon'
      })
    }
    logger.info(
      { couponId, hasCartKey: true },
      'middleware.cart-service.removeCoupon'
    )

    const context = await this.refreshAndGetCartService(
      cartKey,
      'removeCoupon',
      userGuid
    )
    await context.cartService.removeCoupon(couponId)
    const response = await context.cartService.getCart()

    const result = {
      cart: response.data,
      cartToken: context.cartToken,
      tokenExpiry: context.tokenExpiry
    }

    return result
  }

  async completeCart(
    cartKey: string,
    userGuid: string,
    metadata?: CartLineItemMetadata[] | null,
    location?: PersistedLocationState | null
  ): Promise<{ order: OrderResponse; cart: MiddlewareCartResponse }> {
    logger.info({ hasCartKey: true, userGuid }, 'cart-service.completeCart')

    const cartResponse = await this.getCart(cartKey, userGuid)
    const { cart } = cartResponse

    if (!cart.orderId) {
      logger.warn({ cartId: cart.id, cart }, 'Cart does not have an orderId yet')
      throw new AppError('Cart order has not been completed yet', {
        traceTag: 'cart-service.completeCart',
        cartId: cart.id,
        cart
      })
    }

    if (!this.orderService) {
      throw new AppError('Order service not available', {
        traceTag: 'cart-service.completeCart'
      })
    }

    const order = await this.orderService.createOrder({
      orderId: cart.orderId,
      userGuid,
      order: cart,
      metadata: metadata ?? null,
      location: location ?? null
    })

    logger.info(
      {
        orderId: order.externalId,
        orderUid: order.uid,
        cartId: cart.id
      },
      'cart-service.completeCart.success'
    )

    return {
      order,
      cart: cartResponse
    }
  }
}
