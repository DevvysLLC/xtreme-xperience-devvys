import { NextResponse } from 'next/server'
import { initLogger } from '../../../../../core/logger/index'
import { EventsService } from '../../../../../server/middleware/services/events-service/index'

const logger = initLogger().child({ name: 'events-api' })

export const runtime = 'nodejs'

export const GET = async (): Promise<NextResponse> => {
  try {
    const eventsService = new EventsService()
    const response = await eventsService.getEvents()

    const data = {
      events: response.events
    }

    return NextResponse.json(
      {
        status: 'success',
        data
      },
      {
        status: 200
      }
    )
  } catch (error) {
    logger.error(error, 'Internal error processing events request')
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
