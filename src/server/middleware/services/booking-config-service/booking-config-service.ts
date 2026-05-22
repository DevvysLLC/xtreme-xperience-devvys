import { initDatoSdk } from '../../../../core/dato/sdk'
import { AppError } from '../../../../core/errors/app-error'
import { logger } from '../../../../core/logger/logger'
import type { ServiceBookingConfigGetBookingConfigOutput } from '../../../../io/types'

export class BookingConfigService {
  async getBookingConfig(): Promise<ServiceBookingConfigGetBookingConfigOutput> {
    logger.info('booking-config-service.getBookingConfig')

    const sdk = initDatoSdk()
    const response = await sdk.getBookingConfig()

    if (!response.bookingConfig) {
      throw new AppError('Booking config not found', {
        traceTag: 'booking-config-service.getBookingConfig'
      })
    }

    const data = {
      config: {
        ...(response.bookingConfig ?? {}),
        pages: response.bookingConfig?.pages ?? []
      }
    }

    logger.info('booking-config-service.getBookingConfig.success', { data })

    return data
  }
}
