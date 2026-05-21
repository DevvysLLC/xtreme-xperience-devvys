import { AppError } from '../../../core/errors/app-error'
import { RocketRezClient } from '../../rocket-rez/index'
import { BookingConfigService } from '../services/booking-config-service/index'
import { CartService } from '../services/cart-service/index'
import { EventsService } from '../services/events-service/index'
import { OrderService } from '../services/order-service/index'
import { ToolsService } from '../services/tools-service/index'

export type MiddlewareClientConfig = {
  baseUrl?: string
  clientId: string
  clientSecret: string
  scopes?: string
}

export class MiddlewareClient {
  private rocketRezClient: RocketRezClient | null = null
  private bookingConfigService: BookingConfigService | null = null
  private cartService: CartService | null = null
  private eventsService: EventsService | null = null
  private orderService: OrderService | null = null
  private toolsService: ToolsService | null = null

  constructor(private readonly config: MiddlewareClientConfig) {
    if (!this.config.baseUrl) {
      throw new AppError(
        'ROCKET_REZ_API_BASE_URL environment variable is not set',
        {
          traceTag: 'middleware-client.constructor'
        }
      )
    }
  }

  async initialize(): Promise<void> {
    const isInitialized =
      this.rocketRezClient &&
      this.bookingConfigService &&
      this.cartService &&
      this.eventsService &&
      this.orderService &&
      this.toolsService

    if (isInitialized) {
      return
    }

    if (!this.config.baseUrl) {
      throw new AppError(
        'ROCKET_REZ_API_BASE_URL environment variable is not set',
        {
          traceTag: 'middleware-client.initialize'
        }
      )
    }

    const rocketRezClient = new RocketRezClient({
      baseUrl: this.config.baseUrl,
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      scope: this.config.scopes ?? 'read_products'
    })

    try {
      await rocketRezClient.authenticate()

      this.rocketRezClient = rocketRezClient
      this.bookingConfigService = new BookingConfigService()
      this.orderService = new OrderService()
      this.cartService = new CartService(rocketRezClient, this.orderService)
      this.eventsService = new EventsService()
      this.toolsService = new ToolsService()
    } catch (error) {
      // Ensure we don't keep a half-initialized state
      this.rocketRezClient = null
      this.bookingConfigService = null
      this.cartService = null
      this.eventsService = null
      this.orderService = null
      this.toolsService = null

      throw error
    }
  }

  async getBookingConfigService(): Promise<BookingConfigService> {
    await this.initialize()

    if (!this.bookingConfigService) {
      throw new AppError('Booking config service not initialized', {
        traceTag: 'middleware-client.getBookingConfigService'
      })
    }

    return this.bookingConfigService
  }

  async getCartService(): Promise<CartService> {
    await this.initialize()

    if (!this.cartService) {
      throw new AppError('Cart service not initialized', {
        traceTag: 'middleware-client.getCartService'
      })
    }

    return this.cartService
  }

  async getEventsService(): Promise<EventsService> {
    await this.initialize()

    if (!this.eventsService) {
      throw new AppError('Events service not initialized', {
        traceTag: 'middleware-client.getEventsService'
      })
    }

    return this.eventsService
  }

  async getOrderService(): Promise<OrderService> {
    await this.initialize()

    if (!this.orderService) {
      throw new AppError('Order service not initialized', {
        traceTag: 'middleware-client.getOrderService'
      })
    }

    return this.orderService
  }

  async getToolsService(): Promise<ToolsService> {
    await this.initialize()

    if (!this.toolsService) {
      throw new AppError('Tools service not initialized', {
        traceTag: 'middleware-client.getToolsService'
      })
    }

    return this.toolsService
  }

  getRocketRezClient(): RocketRezClient | null {
    return this.rocketRezClient
  }
}
