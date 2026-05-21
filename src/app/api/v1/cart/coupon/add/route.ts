import { NextResponse } from 'next/server'
import { NO_CACHE_HEADERS } from '../../../../../../config/no-cache-headers'
import { initLogger } from '../../../../../../core/logger/index'
import { RocketRezAddCouponRequestSchema } from '../../../../../../io'
import { getMiddlewareClient } from '../../../../../../server/middleware/index'

const logger = initLogger().child({ name: 'cart-coupon-add-api' })

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = async (request: Request): Promise<NextResponse> => {
  try {
    const cartKey = request.headers.get('x-cart-key')

    if (!cartKey) {
      return NextResponse.json(
        { status: 'error', message: 'x-cart-key header is required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      )
    }

    const body: unknown = await request.json()

    const parsed = RocketRezAddCouponRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid request body' },
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
    const result = await cartService.addCoupon(parsed.data, cartKey, userGuid)

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
    logger.error(error, 'Internal error processing cart coupon add request')
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
