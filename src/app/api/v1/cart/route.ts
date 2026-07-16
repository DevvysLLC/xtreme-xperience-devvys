import { NextResponse } from 'next/server'
import { NO_CACHE_HEADERS } from '../../../../config/no-cache-headers'
import { initLogger } from '../../../../core/logger/index'
import { getMiddlewareClient } from '../../../../server/middleware/index'

const logger = initLogger().child({ name: 'cart-get-api' })

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getChicagoOffset(date: Date): number {
  const tzString = date.toLocaleString('en-US', { timeZone: 'America/Chicago' })
  const localDate = new Date(tzString)
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
  return Math.round((utcDate.getTime() - localDate.getTime()) / (60 * 60 * 1000))
}

function parseChicagoDate(dateStr: string): Date {
  const cleanStr = dateStr.replace(/Z|\+\d{2}:\d{2}$/, '')
  const estimatedUtc = new Date(cleanStr + 'Z')
  const offsetHours = getChicagoOffset(estimatedUtc)
  const offsetSign = offsetHours >= 0 ? '-' : '+'
  const absOffsetHours = Math.abs(offsetHours)
  const offsetString = `${offsetSign}${String(absOffsetHours).padStart(2, '0')}:00`
  return new Date(cleanStr + offsetString)
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

    const client = await getMiddlewareClient()
    const cartService = await client.getCartService()
    const result = await cartService.getCart(cartKey, userGuid)

    const isExpired =
      result.cart.expiryDate &&
      parseChicagoDate(result.cart.expiryDate).getTime() < Date.now()

    if (isExpired) {
      logger.warn({ expiryDate: result.cart.expiryDate }, 'Cart has expired')
      return NextResponse.json(
        { status: 'error', message: 'Cart has expired' },
        { status: 404, headers: NO_CACHE_HEADERS }
      )
    }

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
}
