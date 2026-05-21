import { AppError } from '../../../core/errors/app-error'
import type {
  RocketRezAuthTokenRequest as AuthTokenRequest,
  RocketRezRefreshCartTokenRequest as RefreshCartTokenRequest
} from '../../../io/types'
import { AuthService } from '../services/auth/index'
import { CartService } from '../services/cart/index'
import { ProductsService } from '../services/products/index'

export type RocketRezClientConfig = {
  baseUrl?: string
  clientId: string
  clientSecret: string
  scope?: string
}

export class RocketRezClient {
  private authService: AuthService
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null
  private productsService: ProductsService | null = null

  constructor(private readonly config: RocketRezClientConfig) {
    if (!this.config.baseUrl) {
      throw new AppError(
        'ROCKET_REZ_API_BASE_URL environment variable is not set',
        {
          traceTag: 'rocket-rez-client.constructor'
        }
      )
    }

    this.authService = new AuthService(this.config.baseUrl)
  }

  async authenticate(): Promise<void> {
    const request: AuthTokenRequest = {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      scope: this.config.scope ?? 'read_products',
      grant_type: 'client_credentials'
    }

    const response = await this.authService.getToken(request)
    const token = response.data

    this.accessToken = token.access_token
    this.tokenExpiry = token.expiry
      ? new Date(token.expiry)
      : token.expires_in
        ? new Date(Date.now() + token.expires_in * 1000)
        : new Date(Date.now() + 3600 * 1000)

    if (!this.accessToken) {
      throw new AppError('Access token not available', {
        traceTag: 'rocket-rez-client.authenticate'
      })
    }

    if (!this.config.baseUrl) {
      throw new AppError(
        'ROCKET_REZ_API_BASE_URL environment variable is not set',
        {
          traceTag: 'rocket-rez-client.authenticate'
        }
      )
    }

    this.productsService = new ProductsService(
      this.config.baseUrl,
      this.accessToken
    )
  }

  async refreshCartToken(
    cartId: string
  ): Promise<{ cartToken: string; tokenExpiry: string | null }> {
    const request: RefreshCartTokenRequest = {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      scope: this.config.scope ?? 'read_carts write_carts',
      grant_type: 'client_credentials',
      cart_id: cartId
    }

    const response = await this.authService.refreshCartToken(request)
    const token = response.data

    const tokenExpiry =
      token.expiry ??
      (token.expires_in
        ? new Date(Date.now() + token.expires_in * 1000).toISOString()
        : null)

    this.accessToken = token.access_token
    this.tokenExpiry = token.expiry
      ? new Date(token.expiry)
      : token.expires_in
        ? new Date(Date.now() + token.expires_in * 1000)
        : new Date(Date.now() + 3600 * 1000)

    if (!this.accessToken) {
      throw new AppError('Access token not available', {
        traceTag: 'rocket-rez-client.refreshCartToken'
      })
    }

    if (!this.config.baseUrl) {
      throw new AppError(
        'ROCKET_REZ_API_BASE_URL environment variable is not set',
        {
          traceTag: 'rocket-rez-client.refreshCartToken'
        }
      )
    }

    return { cartToken: token.access_token, tokenExpiry }
  }

  private isTokenExpired(): boolean {
    if (!this.tokenExpiry || !this.accessToken) {
      return true
    }

    const now = new Date()
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)
    return this.tokenExpiry <= fiveMinutesFromNow
  }

  private async ensureAuthenticated(): Promise<void> {
    if (this.isTokenExpired()) {
      await this.authenticate()
    }
  }

  async getProductsService(): Promise<ProductsService> {
    await this.ensureAuthenticated()

    if (!this.productsService) {
      throw new AppError('Products service not initialized', {
        traceTag: 'rocket-rez-client.getProductsService'
      })
    }

    return this.productsService
  }

  async getCartService(
    cartToken: string | undefined,
    userGuid: string
  ): Promise<CartService> {
    if (!userGuid) {
      throw new AppError('userGuid is required', {
        traceTag: 'rocket-rez-client.getCartService'
      })
    }

    if (!this.config.baseUrl) {
      throw new AppError(
        'ROCKET_REZ_API_BASE_URL environment variable is not set',
        {
          traceTag: 'rocket-rez-client.getCartService'
        }
      )
    }

    if (cartToken) {
      return new CartService(this.config.baseUrl, cartToken, userGuid)
    }

    await this.ensureAuthenticated()

    if (!this.accessToken) {
      throw new AppError('Access token not available', {
        traceTag: 'rocket-rez-client.getCartService'
      })
    }

    return new CartService(this.config.baseUrl, this.accessToken, userGuid)
  }

  getAuthService(): AuthService {
    return this.authService
  }
}
