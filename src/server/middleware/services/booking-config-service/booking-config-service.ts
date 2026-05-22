import { initDatoSdk } from '../../../../core/dato/sdk'
import { logger } from '../../../../core/logger/logger'
import type { ServiceBookingConfigGetBookingConfigOutput } from '../../../../io/types'

export class BookingConfigService {
  async getBookingConfig(): Promise<ServiceBookingConfigGetBookingConfigOutput> {
    logger.info('booking-config-service.getBookingConfig')

    const sdk = initDatoSdk()
    const response = await sdk.getBookingConfig()

    if (!response.bookingConfig) {
      const data = {
        config: {
          pages: []
        }
      }

      logger.warn(
        'booking-config-service.getBookingConfig.missing-config: returning default config'
      )

      return data
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
