import { NextResponse } from 'next/server'
import { NO_CACHE_HEADERS } from '../../../../../../config/no-cache-headers'
import { initLogger } from '../../../../../../core/logger/index'
import { RocketRezAddContactsRequestSchema } from '../../../../../../io'
import { getMiddlewareClient } from '../../../../../../server/middleware/index'

const logger = initLogger().child({ name: 'cart-contact-update-api' })

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const PATCH = async (request: Request): Promise<NextResponse> => {
  try {
    const cartKey = request.headers.get('x-cart-key')

    if (!cartKey) {
      return NextResponse.json(
        { status: 'error', message: 'x-cart-key header is required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      )
    }

    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('contactId')

    if (!contactId) {
      return NextResponse.json(
        { status: 'error', message: 'contactId is required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      )
    }

    const parsedContactId = Number(contactId)
    if (!Number.isFinite(parsedContactId) || parsedContactId <= 0) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid contactId' },
        { status: 400, headers: NO_CACHE_HEADERS }
      )
    }

    const body: unknown = await request.json()

    const parsed = RocketRezAddContactsRequestSchema.safeParse(body)
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
    const result = await cartService.updateContact(
      parsedContactId,
      parsed.data,
      cartKey,
      userGuid
    )

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
    logger.error(error, 'Internal error processing cart contact update request')
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
