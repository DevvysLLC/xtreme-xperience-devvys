'use client'

import { useCallback } from 'react'
import type { BookingConfigFragment } from '../../core/dato/fragments/booking-config.typegen'
import { RocketRezScheduleStatus } from '../../io/schemas'
import type { RocketRezEventScheduleItem } from '../../io/types'
import { getRateTypePrice } from '../../utils/get-rate-type-price'

type SupercarGroup = BookingConfigFragment['supercars'][number]['supercars']

/**
 * Supercar schedule utilities
 *
 * - Calculate effective prices from schedules
 * - Check if schedule is sold out
 * - Get available status from RocketRez data
 */
export const useBookingSupercarSchedule = () => {
  const getEffectivePrice = useCallback(
    (schedule: RocketRezEventScheduleItem, rateId?: number) => {
      if (!schedule.seatTypes || schedule.seatTypes.length === 0) {
        return 0
      }

      if (rateId) {
        for (const seatType of schedule.seatTypes) {
          if (!seatType?.rates) {
            continue
          }

          const rate = seatType.rates.find((r) => r.id === rateId)
          if (!rate) {
            continue
          }

          const participantRateType = rate.rateTypes.find(
            (rt) =>
              rt.type === 'Participant' &&
              (rt.overridePrice != null ||
                rt.dynamicPrice != null ||
                rt.defaultPrice != null ||
                rt.price != null)
          )

          if (participantRateType) {
            return (
              participantRateType.overridePrice ??
              participantRateType.dynamicPrice ??
              participantRateType.defaultPrice ??
              participantRateType.price ??
              0
            )
          }
        }
        return 0
      }

      const seatType = schedule.seatTypes[0]
      if (!seatType?.rates || seatType.rates.length === 0) {
        return 0
      }

      const rate = seatType.rates[0]
      if (!rate?.rateTypes) {
        return 0
      }

      const rateType = rate.rateTypes.find(
        (rt) =>
          rt.overridePrice != null ||
          rt.dynamicPrice != null ||
          rt.defaultPrice != null ||
          rt.price != null
      )

      if (!rateType) {
        return 0
      }

      return (
        rateType.overridePrice ??
        rateType.dynamicPrice ??
        rateType.defaultPrice ??
        rateType.price ??
        0
      )
    },
    []
  )

  const getCompareAtPrice = useCallback(
    (schedule: RocketRezEventScheduleItem, rateId?: number) => {
      if (!schedule.seatTypes || schedule.seatTypes.length === 0) {
        return null
      }

      if (rateId) {
        for (const seatType of schedule.seatTypes) {
          if (!seatType?.rates) {
            continue
          }

          const rate = seatType.rates.find((r) => r.id === rateId)
          if (!rate) {
            continue
          }

          const participantRateType = rate.rateTypes.find(
            (rt) =>
              rt.type === 'Participant' &&
              (rt.overridePrice != null ||
                rt.dynamicPrice != null ||
                rt.defaultPrice != null ||
                rt.price != null)
          )

          if (participantRateType) {
            return participantRateType.overridePrice
              ? (participantRateType.price ?? null)
              : null
          }
        }
        return null
      }

      const seatType = schedule.seatTypes[0]
      if (!seatType?.rates || seatType.rates.length === 0) {
        return null
      }

      const rate = seatType.rates[0]
      if (!rate?.rateTypes) {
        return null
      }

      const rateType = rate.rateTypes.find(
        (rt) =>
          rt.overridePrice != null ||
          rt.dynamicPrice != null ||
          rt.defaultPrice != null ||
          rt.price != null
      )

      if (!rateType) {
        return null
      }

      return rateType.overridePrice ? (rateType.price ?? null) : null
    },
    []
  )

  const isSoldOut = useCallback(
    (schedule: RocketRezEventScheduleItem, rateId?: number) => {
      const { scheduleStatus } = schedule
      const effectivePrice = getEffectivePrice(schedule, rateId)

      return Boolean(
        scheduleStatus !== RocketRezScheduleStatus.AVAILABLE ||
          effectivePrice <= 0
      )
    },
    [getEffectivePrice]
  )

  const getLowestPrice = useCallback(
    (
      schedules: RocketRezEventScheduleItem[] | undefined,
      supercars?: SupercarGroup
    ) => {
      if (!schedules || schedules.length === 0) {
        return null
      }

      const rateIds =
        supercars && supercars.length > 0
          ? supercars.map((s) => Number.parseInt(s.rocketRezSeatTypeId, 10))
          : []

      let filteredSchedules = schedules
      if (rateIds.length > 0) {
        filteredSchedules = schedules.filter((schedule) => {
          if (!schedule.seatTypes || schedule.seatTypes.length === 0) {
            return false
          }

          const hasMatchingRate = schedule.seatTypes.some((seatType) => {
            if (!seatType?.rates || seatType.rates.length === 0) {
              return false
            }
            return seatType.rates.some((rate) => rateIds.includes(rate.id))
          })

          return hasMatchingRate
        })
      }

      if (filteredSchedules.length === 0) {
        return null
      }

      const schedulePrices = filteredSchedules.flatMap((schedule) => {
        if (!schedule.seatTypes || schedule.seatTypes.length === 0) {
          return []
        }

        const allRates: {
          rate: { id: number }
          seatType: { available?: number | null }
        }[] = []

        for (const seatType of schedule.seatTypes) {
          if (!seatType?.rates || seatType.rates.length === 0) {
            continue
          }

          for (const rate of seatType.rates) {
            if (rateIds.length > 0 && !rateIds.includes(rate.id)) {
              continue
            }
            allRates.push({ rate, seatType })
          }
        }

        if (allRates.length === 0) {
          return []
        }

        return allRates
          .map(({ rate }) => {
            const price = getEffectivePrice(schedule, rate.id)
            const soldOut = isSoldOut(schedule, rate.id)

            return soldOut ? null : { schedule, rateId: rate.id, price }
          })
          .filter(
            (
              item
            ): item is {
              schedule: RocketRezEventScheduleItem
              rateId: number
              price: number
            } => item !== null
          )
      })

      if (schedulePrices.length === 0) {
        return null
      }

      const prices = schedulePrices.map((item) => item.price)
      const lowestEffectivePrice = Math.min(...prices)

      const lowestPriceItem = schedulePrices.find(
        (item) => item.price === lowestEffectivePrice
      )

      return {
        price: lowestEffectivePrice,
        compareAtPrice: lowestPriceItem
          ? getCompareAtPrice(lowestPriceItem.schedule, lowestPriceItem.rateId)
          : null
      }
    },
    [getEffectivePrice, getCompareAtPrice, isSoldOut]
  )

  const lowestAvailablePrice = useCallback(
    (schedules: RocketRezEventScheduleItem[] | undefined, rateId: number) => {
      if (!schedules || schedules.length === 0) {
        return null
      }

      const availableSchedulePrices = schedules
        .map((schedule) => {
          if (schedule.scheduleStatus !== RocketRezScheduleStatus.AVAILABLE) {
            return null
          }

          const matchedSeatType = (schedule.seatTypes ?? []).find(
            (seatType) =>
              seatType?.available != null &&
              seatType.available > 0 &&
              (seatType.rates ?? []).some((rate) => rate.id === rateId)
          )

          if (!matchedSeatType) {
            return null
          }

          const matchedRate = (matchedSeatType.rates ?? []).find(
            (rate) => rate.id === rateId
          )
          const rateTypePrice = getRateTypePrice(matchedRate?.rateTypes?.[0])

          if (!rateTypePrice?.hasPrice) {
            return null
          }

          return {
            schedule,
            price: rateTypePrice.price,
            compareAtPrice: rateTypePrice.compareAtPrice
          }
        })
        .filter(
          (
            item
          ): item is {
            schedule: RocketRezEventScheduleItem
            price: number
            compareAtPrice: number | null
          } => item !== null
        )

      if (availableSchedulePrices.length === 0) {
        return null
      }

      const lowestPriceItem = availableSchedulePrices.reduce(
        (lowest, current) => (current.price < lowest.price ? current : lowest)
      )

      return {
        price: lowestPriceItem.price,
        compareAtPrice: lowestPriceItem.compareAtPrice
      }
    },
    []
  )

  const lowestAvailablePriceFromRates = useCallback(
    (
      schedules: RocketRezEventScheduleItem[] | undefined,
      rateIds: number[]
    ) => {
      if (!schedules || schedules.length === 0) {
        return null
      }

      const normalizedRateIds = Array.from(
        new Set(
          rateIds.filter(
            (rateId) =>
              Number.isFinite(rateId) && !Number.isNaN(rateId) && rateId > 0
          )
        )
      )

      if (normalizedRateIds.length === 0) {
        const fallbackSchedulePrices = schedules
          .map((schedule) => {
            if (schedule.scheduleStatus !== RocketRezScheduleStatus.AVAILABLE) {
              return null
            }

            const fallbackPrices = (schedule.seatTypes ?? [])
              .filter(
                (seatType) =>
                  seatType?.available != null && seatType.available > 0
              )
              .flatMap((seatType) =>
                (seatType.rates ?? [])
                  .map((rate) => getRateTypePrice(rate.rateTypes?.[0]))
                  .filter((price): price is ReturnType<typeof getRateTypePrice> =>
                    Boolean(price?.hasPrice)
                  )
                  .map((price) => ({
                    price: price.price,
                    compareAtPrice: price.compareAtPrice
                  }))
              )

            if (fallbackPrices.length === 0) {
              return null
            }

            return fallbackPrices.reduce((lowest, current) =>
              current.price < lowest.price ? current : lowest
            )
          })
          .filter(
            (
              item
            ): item is {
              price: number
              compareAtPrice: number | null
            } => item !== null
          )

        if (fallbackSchedulePrices.length === 0) {
          return null
        }

        return fallbackSchedulePrices.reduce((lowest, current) =>
          current.price < lowest.price ? current : lowest
        )
      }

      const packageSchedulePrices = schedules
        .map((schedule) => {
          if (schedule.scheduleStatus !== RocketRezScheduleStatus.AVAILABLE) {
            return null
          }

          const pricesForAllRates = normalizedRateIds
            .map((rateId) => {
              const matchedSeatType = (schedule.seatTypes ?? []).find(
                (seatType) =>
                  seatType?.available != null &&
                  seatType.available > 0 &&
                  (seatType.rates ?? []).some((rate) => rate.id === rateId)
              )

              if (!matchedSeatType) {
                return null
              }

              const matchedRate = (matchedSeatType.rates ?? []).find(
                (rate) => rate.id === rateId
              )
              const rateTypePrice = getRateTypePrice(matchedRate?.rateTypes?.[0])

              if (!rateTypePrice?.hasPrice) {
                return null
              }

              return {
                price: rateTypePrice.price,
                compareAtPrice: rateTypePrice.compareAtPrice
              }
            })
            .filter(
              (
                item
              ): item is {
                price: number
                compareAtPrice: number | null
              } => item !== null
            )

          // Package availability requires a schedule that can satisfy ALL required rates.
            if (pricesForAllRates.length !== normalizedRateIds.length) {
            return null
          }

          return pricesForAllRates.reduce((lowest, current) =>
            current.price < lowest.price ? current : lowest
          )
        })
        .filter(
          (
            item
          ): item is {
            price: number
            compareAtPrice: number | null
          } => item !== null
        )

      if (packageSchedulePrices.length === 0) {
        return null
      }

      return packageSchedulePrices.reduce((lowest, current) =>
        current.price < lowest.price ? current : lowest
      )
    },
    []
  )

  return {
    getEffectivePrice,
    getCompareAtPrice,
    isSoldOut,
    getLowestPrice,
    lowestAvailablePrice,
    lowestAvailablePriceFromRates
  }
}

export type UseBookingSupercarScheduleReturn = ReturnType<
  typeof useBookingSupercarSchedule
>
