import { NextResponse } from 'next/server'
import { AppError } from '../../../../../../core/errors/app-error'
import { initLogger } from '../../../../../../core/logger/index'
import { getMiddlewareClient } from '../../../../../../server/middleware/index'

const logger = initLogger().child({ name: 'order-api' })

type RouteContext = { params: Promise<{ id: string }> }

export const runtime = 'nodejs'

const handleOrderError = (error: unknown): NextResponse => {
  if (
    error instanceof AppError &&
    error.message === 'Unauthorized access to order'
  ) {
    logger.warn({ error }, 'Unauthorized order access attempt')
    return NextResponse.json(
      { status: 'error', message: 'Unauthorized access to order' },
      { status: 403 }
    )
  }

  if (error instanceof AppError && error.message === 'Order not found') {
    return NextResponse.json(
      { status: 'error', message: 'Order not found' },
      { status: 404 }
    )
  }

  logger.error(error, 'Internal error processing order request')
  return NextResponse.json(
    { status: 'error', message: 'Internal server error' },
    { status: 500 }
  )
}

export const GET = async (
  request: Request,
  context: RouteContext
): Promise<NextResponse> => {
  try {
    const { id } = await context.params
    const userGuid = request.headers.get('x-user-guid')

    if (!userGuid) {
      logger.error('x-user-guid header missing')
      return NextResponse.json(
        { status: 'error', message: 'Internal server error' },
        { status: 500 }
      )
    }

    const client = await getMiddlewareClient()
    const orderService = await client.getOrderService()
    const result = await orderService.getOrder(id, userGuid)

    return NextResponse.json(
      { status: 'success', data: result },
      { status: 200 }
    )
  } catch (error) {
    return handleOrderError(error)
  }
}

export const PATCH = async (
  request: Request,
  context: RouteContext
): Promise<NextResponse> => {
  try {
    const { id } = await context.params
    const userGuid = request.headers.get('x-user-guid')

    if (!userGuid) {
      logger.error('x-user-guid header missing')
      return NextResponse.json(
        { status: 'error', message: 'Internal server error' },
        { status: 500 }
      )
    }

    const client = await getMiddlewareClient()
    const orderService = await client.getOrderService()
    const result = await orderService.markOrderViewed(id, userGuid)

    return NextResponse.json(
      { status: 'success', data: result },
      { status: 200 }
    )
  } catch (error) {
    return handleOrderError(error)
  }
}
