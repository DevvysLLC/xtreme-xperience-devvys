import { logger } from '../core/logger/logger'
import type { RateTypePrice, RocketRezEventRateType } from '../io/types'

export const getRateTypePrice = (
  rateType: RocketRezEventRateType | null | undefined
): RateTypePrice | null => {
  logger.info({ rateType }, 'getRateTypePrice.rateType')

  if (!rateType) {
    return null
  }

  const { price, overridePrice, dynamicPrice, defaultPrice } = rateType
  const definedPrices = [
    overridePrice,
    dynamicPrice,
    price,
    defaultPrice
  ].filter((v): v is number => typeof v === 'number')

  logger.info({ definedPrices }, 'getRateTypePrice.definedPrices')

  if (definedPrices.length === 0) {
    return null
  }

  // Keep pricing precedence aligned with getEffectivePrice:
  // override -> dynamic -> default -> fallback price
  const effectivePrice =
    overridePrice ?? dynamicPrice ?? defaultPrice ?? price ?? null
  if (effectivePrice == null) {
    return null
  }

  const lowestPrice = Math.min(...definedPrices)
  const highestPrice = Math.max(...definedPrices)
  const hasPrice = Boolean(effectivePrice > 0)

  logger.info({ lowestPrice }, 'getRateTypePrice.lowestPrice')
  logger.info({ highestPrice }, 'getRateTypePrice.highestPrice')

  const result = {
    price: effectivePrice,
    compareAtPrice: effectivePrice < highestPrice ? highestPrice : null,
    hasPrice,
    isSoldOut: !hasPrice,
    lowestPrice,
    highestPrice
  }

  logger.info({ result }, 'getRateTypePrice.result')

  return result
}
