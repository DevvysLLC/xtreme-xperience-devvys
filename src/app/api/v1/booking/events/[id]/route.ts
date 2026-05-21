import { NextResponse } from 'next/server'
import { initLogger } from '../../../../../../core/logger/index'
import { getMiddlewareClient } from '../../../../../../server/middleware/index'

const logger = initLogger().child({ name: 'event-api' })

export const runtime = 'nodejs'

export const GET = async (
  _request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
  try {
    const { id } = await context.params
    const client = await getMiddlewareClient()
    const eventsService = await client.getEventsService()

    const response = await eventsService.getEvent({
      id
    })

    const data = {
      event: response.event
    }

    return NextResponse.json({
      status: 'success',
      data
    })
  } catch (error) {
    logger.error(error, 'Internal error processing event request')
    return NextResponse.json(
      {
        status: 'error',
        message: 'Internal server error'
      },
      {
        status: 500
      }
    )
  }
}
