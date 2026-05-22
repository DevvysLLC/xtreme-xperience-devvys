import { NextResponse } from 'next/server'
import { initLogger } from '../../../../../core/logger/index'
import { getMiddlewareClient } from '../../../../../server/middleware/index'

const logger = initLogger().child({ name: 'booking-config-api' })

export const runtime = 'nodejs'

export const GET = async (): Promise<NextResponse> => {
  try {
    const client = await getMiddlewareClient()
    const bookingConfigService = await client.getBookingConfigService()
    const response = await bookingConfigService.getBookingConfig()

    return NextResponse.json(
      {
        status: 'success',
        data: response
      },
      {
        status: 200
      }
    )
  } catch (error) {
    logger.error(error, 'Internal error processing booking config request')
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
