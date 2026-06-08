import { NextResponse } from 'next/server'
import { NO_CACHE_HEADERS } from '../../../../../config/no-cache-headers'
import { logger } from '../../../../../core/logger/logger'
import { RocketRezAddLineItemRequestSchema } from '../../../../../io'
import { getMiddlewareClient } from '../../../../../server/middleware/index'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = async (request: Request): Promise<NextResponse> => {
  try {
    const cartKey = request.headers.get('x-cart-key')
    const userGuid = request.headers.get('x-user-guid')
    const body: unknown = await request.json()

    if (!userGuid) {
      logger.error('x-user-guid header missing')
      return NextResponse.json(
        { status: 'error', message: 'Internal server error' },
        { status: 500, headers: NO_CACHE_HEADERS }
      )
    }

    logger.info({ hasCartKey: !!cartKey }, 'Cart add request')

    const parsed = RocketRezAddLineItemRequestSchema.safeParse(body)
    if (!parsed.success) {
      logger.error({ issues: parsed.error.issues }, 'Invalid request body')
      return NextResponse.json(
        { status: 'error', message: 'Invalid request body' },
        { status: 400, headers: NO_CACHE_HEADERS }
      )
    }

    const client = await getMiddlewareClient()
    const cartService = await client.getCartService()
    const result = await cartService.addToCart(
      parsed.data,
      cartKey ?? null,
      userGuid
    )

    return NextResponse.json(
      {
        status: 'success',
        data: result
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    )
  } catch (error) {
    logger.error(error, 'Internal error processing cart add request')
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
