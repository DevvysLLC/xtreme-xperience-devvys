import { NextResponse } from 'next/server'
import { NO_CACHE_HEADERS } from '../../../../../config/no-cache-headers'
import { initLogger } from '../../../../../core/logger/index'
import { getMiddlewareClient } from '../../../../../server/middleware/index'

const logger = initLogger().child({ name: 'cart-remove-all-api' })

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const DELETE = async (request: Request): Promise<NextResponse> => {
  try {
    const cartKey = request.headers.get('x-cart-key')

    if (!cartKey) {
      return NextResponse.json(
        { status: 'error', message: 'x-cart-key header is required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      )
    }

    const userGuid = request.headers.get('x-user-guid')

    if (!userGuid) {
      logger.error('x-user-guid header missing')
      return NextResponse.json(
        { status: 'error', message: 'Internal server error' },
        { status: 500, headers: NO_CACHE_HEADERS }
      )
    }

    const client = await getMiddlewareClient()
    const cartService = await client.getCartService()
    const result = await cartService.clearCart(cartKey, userGuid)

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
    logger.error(error, 'Internal error processing cart remove-all request')
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
}
