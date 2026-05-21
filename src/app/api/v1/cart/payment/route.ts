import { type NextRequest, NextResponse } from 'next/server'
import { NO_CACHE_HEADERS } from '../../../../../config/no-cache-headers'
import { initLogger } from '../../../../../core/logger/index'
import { RocketRezGetPaymentGatewayClientSecretRequestSchema } from '../../../../../io'
import { getMiddlewareClient } from '../../../../../server/middleware/index'
import { CartKeyHelpers } from '../../../../../utils/cart-key'

const logger = initLogger().child({ name: 'cart-payment-api' })

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = async (request: NextRequest): Promise<NextResponse> => {
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

    const { cartToken } = parsedCartKey

    const requestBody: unknown = {}

    const parsed =
      RocketRezGetPaymentGatewayClientSecretRequestSchema.safeParse(requestBody)

    if (!parsed.success) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid request parameters' },
        { status: 400, headers: NO_CACHE_HEADERS }
      )
    }

    const paymentMethodId =
      process.env.ROCKET_REZ_PAYMENTS_API_PAYMENT_METHOD_ID

    if (!paymentMethodId) {
      logger.error('ROCKET_REZ_PAYMENTS_API_PAYMENT_METHOD_ID is not set')
      return NextResponse.json(
        { status: 'error', message: 'Payment configuration missing' },
        { status: 500, headers: NO_CACHE_HEADERS }
      )
    }

    const client = await getMiddlewareClient()
    const rocketRezClient = client.getRocketRezClient()
    if (!rocketRezClient) {
      throw new Error('RocketRez client not initialized')
    }
    const cartService = await rocketRezClient.getCartService(
      cartToken,
      userGuid
    )

    const result = await cartService.getPaymentGatewayClientSecret(
      parsed.data,
      cartToken,
      userGuid
    )

    return NextResponse.json(
      {
        status: 'success',
        data: {
          ...result,
          userGuid,
          paymentMethodId: Number(paymentMethodId)
        }
      },
      {
        status: 200,
        headers: NO_CACHE_HEADERS
      }
    )
  } catch (error) {
    logger.error(error, 'Internal error processing cart payment request')
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
