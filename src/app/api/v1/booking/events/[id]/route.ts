import { NextResponse } from 'next/server'
import { AppError } from '../../../../../../core/errors/app-error'
import { initLogger } from '../../../../../../core/logger/index'
import { EventsService } from '../../../../../../server/middleware/services/events-service/index'

const logger = initLogger().child({ name: 'event-api' })

export const runtime = 'nodejs'

const handleEventError = (error: unknown): NextResponse => {
  if (error instanceof AppError && error.message === 'Invalid event id') {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Invalid event id'
      },
      {
        status: 400
      }
    )
  }

  if (error instanceof AppError && error.message === 'Event not found') {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Event not found'
      },
      {
        status: 404
      }
    )
  }

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

export const GET = async (
  _request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
  try {
    const { id } = await context.params
    const eventsService = new EventsService()

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
    return handleEventError(error)
  }
}
