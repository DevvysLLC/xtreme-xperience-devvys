'use client'

import { useCallback } from 'react'
import type { RocketRezEventScheduleSeatType } from '../../io/types'

export const useBookingSupercarRate = () => {
  return useCallback(
    (
      seatType: RocketRezEventScheduleSeatType | null | undefined,
      rateId: number
    ): RocketRezEventScheduleSeatType | null => {
      if (!seatType?.rates) {
        return null
      }

      const matchingRate = seatType.rates.find((rate) => rate.id === rateId)

      if (!matchingRate) {
        return null
      }

      const rateTypeWithPrice = matchingRate.rateTypes.find(
        (rateType) =>
          rateType.overridePrice != null ||
          rateType.dynamicPrice != null ||
          rateType.price != null
      )

      if (!rateTypeWithPrice) {
        return null
      }

      return {
        ...seatType,
        rates: [
          {
            ...matchingRate,
            rateTypes: [rateTypeWithPrice]
          }
        ]
      }
    },
    []
  )
}
