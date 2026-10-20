import { initDatoSdk } from '../../../../core/dato/sdk'
import { logger } from '../../../../core/logger/logger'
import type { ServiceBookingConfigGetBookingConfigOutput } from '../../../../io/types'

const isPromotionActiveNow = (promo: {
  active: boolean
  startDate?: string | null
  endDate?: string | null
}): boolean => {
  if (!promo.active) {
    return false
  }
  const nowMs = Date.now()
  if (promo.startDate) {
    const startMs = new Date(promo.startDate).getTime()
    if (!Number.isNaN(startMs) && nowMs < startMs) {
      return false
    }
  }
  if (promo.endDate) {
    let endMs = new Date(promo.endDate).getTime()
    if (promo.endDate.length <= 10) {
      endMs = new Date(`${promo.endDate}T23:59:59.999Z`).getTime()
    }
    if (!Number.isNaN(endMs) && nowMs > endMs) {
      return false
    }
  }
  return true
}

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

    const promotionRules = (response.allPromotions ?? []).flatMap((promo) => {
      if (!isPromotionActiveNow(promo)) {
        return []
      }
      return (promo.rules ?? []).map((rule) => ({
        ...rule,
        badgeLabel: rule.badgeLabel || promo.badgeLabel || null
      }))
    })

    const mergedDiscountRules = [
      ...promotionRules,
      ...(response.bookingConfig?.discountRules ?? [])
    ]

    const data = {
      config: {
        ...(response.bookingConfig ?? {}),
        pages: response.bookingConfig?.pages ?? [],
        discountRules: mergedDiscountRules,
        promotions: response.allPromotions ?? []
      }
    }

    logger.info('booking-config-service.getBookingConfig.success', { data })

    return data
  }
}
