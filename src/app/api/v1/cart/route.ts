import { NextResponse } from 'next/server'
import { NO_CACHE_HEADERS } from '../../../../config/no-cache-headers'
import { AppError } from '../../../../core/errors/app-error'
import { initLogger } from '../../../../core/logger/index'
import { getMiddlewareClient } from '../../../../server/middleware/index'
import { CartKeyHelpers } from '../../../../utils/cart-key'

const logger = initLogger().child({ name: 'cart-get-api' })

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const handleCartGetError = (error: unknown): NextResponse => {
  if (error instanceof AppError && error.message === 'Invalid cart key format') {
    return NextResponse.json(
      { status: 'error', message: 'Invalid cart key format' },
      { status: 400, headers: NO_CACHE_HEADERS }
    )
  }

  if (
    error instanceof AppError &&
    error.details?.traceTag === 'auth-service.refreshCartToken' &&
    (error.details?.status === 400 ||
      error.details?.status === 401 ||
      error.details?.status === 403)
  ) {
    return NextResponse.json(
      { status: 'error', message: 'Cart session is invalid or expired' },
      { status: 401, headers: NO_CACHE_HEADERS }
    )
  }

  if (
    error instanceof AppError &&
    error.details?.traceTag === 'rocket-rez.cart-service.getCart' &&
    (error.details?.status === 401 ||
      error.details?.status === 403 ||
      error.details?.status === 404)
  ) {
    return NextResponse.json(
      { status: 'error', message: 'Cart not found or expired' },
      { status: 404, headers: NO_CACHE_HEADERS }
    )
  }

  logger.error(error, 'Internal error processing cart get request')
  return NextResponse.json(
    {
      status: 'error',
      message: 'Internal server error'
    },
    {
      status: 500,
      headers: NO_CACHE_HEADERS
    }
  )
}

export const GET = async (request: Request): Promise<NextResponse> => {
  try {
    const cartKey = request.headers.get('x-cart-key')
    const userGuid = request.headers.get('x-user-guid')

    if (!cartKey) {
      return NextResponse.json(
        { status: 'error', message: 'x-cart-key header is required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      )
    }

    if (!userGuid) {
      logger.error('x-user-guid header missing')
      return NextResponse.json(
        { status: 'error', message: 'Internal server error' },
        { status: 500, headers: NO_CACHE_HEADERS }
      )
    }

    const parsedCartKey = CartKeyHelpers.parse(cartKey)
    if (!parsedCartKey) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid cart key format' },
        { status: 400, headers: NO_CACHE_HEADERS }
      )
    }

    const client = await getMiddlewareClient()
    const cartService = await client.getCartService()
    const result = await cartService.getCart(cartKey, userGuid)

    return NextResponse.json(
      {
        status: 'success',
        data: result
      },
      {
        status: 200,
        headers: NO_CACHE_HEADERS
      }
    )
  } catch (error) {
    return handleCartGetError(error)
  }
}
