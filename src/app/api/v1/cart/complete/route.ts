import { NextResponse } from 'next/server'
import { z } from 'zod'
import { NO_CACHE_HEADERS } from '../../../../../config/no-cache-headers'
import { AppError } from '../../../../../core/errors/app-error'
import { initLogger } from '../../../../../core/logger/index'
import {
  CartLineItemMetadataSchema,
  PersistedLocationStateSchema
} from '../../../../../io/schemas'
import { getMiddlewareClient } from '../../../../../server/middleware/index'

const logger = initLogger().child({ name: 'cart-complete-api' })

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = async (request: Request): Promise<NextResponse> => {
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

    // Parse optional metadata + location from request body
    let metadata: z.infer<typeof CartLineItemMetadataSchema>[] | null = null
    let location: z.infer<typeof PersistedLocationStateSchema> | null = null
    try {
      const body: unknown = await request.json()
      const parsed = z
        .object({
          metadata: z.array(CartLineItemMetadataSchema).nullable().optional(),
          location: PersistedLocationStateSchema.nullable().optional()
        })
        .safeParse(body)
      if (parsed.success) {
        metadata = parsed.data.metadata ?? null
        location = parsed.data.location ?? null
      }
    } catch {
      // No body or invalid JSON — optional payload stays null
    }

    const client = await getMiddlewareClient()
    const cartService = await client.getCartService()
    const result = await cartService.completeCart(
      cartKey,
      userGuid,
      metadata,
      location
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
    if (error instanceof AppError) {
      logger.error({ error }, 'Error processing cart complete request')
      return NextResponse.json(
        {
          status: 'error',
          message: error.message
        },
        {
          status: 400,
          headers: NO_CACHE_HEADERS
        }
      )
    }

    logger.error(error, 'Internal error processing cart complete request')
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
