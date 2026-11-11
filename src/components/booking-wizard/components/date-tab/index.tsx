'use client'

import clsx from 'clsx'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useBookingSupercarSchedule } from '../../../../features/booking'
import { getRequiredRateIdsForSupercar } from '../../../../features/booking/use-booking-supercar-schedule'
import { RocketRezScheduleStatus } from '../../../../io/schemas'
import type {
  RocketRezEventScheduleDate,
  RocketRezEventScheduleItem
} from '../../../../io/types'
import { parseLocalDate } from '../../../../utils/date-time'
import { getRateTypePrice } from '../../../../utils/get-rate-type-price'
import { getScheduleDiscount } from '../../../../utils/get-schedule-discount'
import { getSeatTypeIdWithOverride } from '../../../../utils/get-seat-type-id-with-override'
import { isScheduleSoldOut } from '../../../../utils/is-schedule-sold-out'
import { CoreRocketRezPrice } from '../../../core-rocketrez-price'
import { useBookingWizardState } from '../../context'
import styles from './style.module.scss'

type Props = {
  day: RocketRezEventScheduleDate
  schedules?: RocketRezEventScheduleItem[]
  rateIds?: number[]
  isActive: boolean
  badgeLabel?: string
  badgeBackgroundColor?: string | null
  badgeTextColor?: string | null
  onClick?: (date: string) => void
  isMulticar?: boolean
}

export const DayTab: React.FC<Props> = ({
  day,
  schedules,
  rateIds,
  isActive,
  badgeLabel,
  badgeBackgroundColor,
  badgeTextColor,
  onClick,
  isMulticar
}) => {
  const t = useTranslations('booking_wizard.pages.date_and_car.date_tab')
  const date = parseLocalDate(day.date)
  const weekday = format(date, 'EEEE')
  const dayNumber = format(date, 'd')
  const { state } = useBookingWizardState()
  const { lowestAvailablePriceFromRates } = useBookingSupercarSchedule()

  const rateMetaMap = useMemo(() => {
    const map = new Map<
      number,
      { supercarId: string; isRideAlong: boolean; isMulticar: boolean }
    >()
    const activeGroup =
      state.configData?.supercars?.[state.activeTabIndex ?? 0] ?? null
    const selectedEventId = state.selectedEvent?.model?.rocketRezId ?? null
    for (const bs of activeGroup?.supercars ?? []) {
      const resolvedRateId = getSeatTypeIdWithOverride({
        defaultSeatTypeId: bs.rocketRezSeatTypeId,
        overrides: bs.rocketRezSeatTypeIdOverrides,
        selectedEventId
      })
      if (resolvedRateId > 0) {
        map.set(resolvedRateId, {
          supercarId: String(bs.supercar?.id ?? ''),
          isRideAlong: bs.isRideAlong,
          isMulticar: bs.isMulticar
        })
      }
    }
    return map
  }, [
    state.configData?.supercars,
    state.activeTabIndex,
    state.selectedEvent?.model?.rocketRezId
  ])

  const lowestPrice = useMemo(() => {
    const baseLowest = lowestAvailablePriceFromRates(
      schedules,
      rateIds ?? [],
      isMulticar
    )
    if (!baseLowest || !schedules || schedules.length === 0) {
      return baseLowest
    }

    const discountRules = state.configData?.discountRules
    if (!discountRules || discountRules.length === 0) {
      return baseLowest
    }

    const trackId = state.selectedEvent?.model?.track?.config?.id ?? null
    const eventId = state.selectedEvent?.id ?? null
    let minPrice = baseLowest.price

    for (const schedule of schedules) {
      if (schedule.scheduleStatus !== RocketRezScheduleStatus.AVAILABLE) {
        continue
      }
      for (const rateId of rateIds ?? []) {
        const meta = rateMetaMap.get(rateId)
        const rateIsMulticar = meta?.isMulticar ?? Boolean(isMulticar)
        if (rateIsMulticar) {
          const requiredRateIds = getRequiredRateIdsForSupercar(
            schedule,
            rateId,
            true
          )
          if (isScheduleSoldOut(schedule, requiredRateIds)) {
            continue
          }
        }

        const matchedSeatType = (schedule.seatTypes ?? []).find(
          (seatType) =>
            seatType?.available != null &&
            seatType.available > 0 &&
            (seatType.rates ?? []).some((rate) => rate.id === rateId)
        )
        if (!matchedSeatType) {
          continue
        }

        const matchedRate = (matchedSeatType.rates ?? []).find(
          (rate) => rate.id === rateId
        )
        const rtp = getRateTypePrice(matchedRate?.rateTypes?.[0])
        if (!rtp?.hasPrice || rtp.price === null) {
          continue
        }

        const disc = getScheduleDiscount({
          scheduleStartTime: schedule.startTime,
          scheduleDate: day.date,
          basePrice: rtp.price,
          existingCompareAtPrice: rtp.compareAtPrice,
          eventId,
          trackId,
          supercarId: meta?.supercarId || undefined,
          isRideAlong: meta?.isRideAlong ?? false,
          isMulticar: rateIsMulticar,
          rules: discountRules
        })

        if (disc.price < minPrice) {
          minPrice = disc.price
        }
      }
    }

    return {
      price: minPrice,
      compareAtPrice: baseLowest.compareAtPrice
    }
  }, [
    schedules,
    rateIds,
    lowestAvailablePriceFromRates,
    isMulticar,
    state.configData?.discountRules,
    state.selectedEvent?.model?.track?.config?.id,
    state.selectedEvent?.id,
    rateMetaMap,
    day.date
  ])

  const displayBadge = useMemo(() => {
    if (badgeLabel && badgeLabel.trim()) {
      return badgeLabel.trim()
    }
    return undefined
  }, [badgeLabel])

  const isSoldOut = !lowestPrice

  const badgeStyle = useMemo(() => {
    const style: React.CSSProperties = {}
    if (badgeBackgroundColor) {
      style.backgroundColor = badgeBackgroundColor
    }
    if (badgeTextColor) {
      style.color = badgeTextColor
    }
    return Object.keys(style).length > 0 ? style : undefined
  }, [badgeBackgroundColor, badgeTextColor])

  return (
    <button
      type="button"
      className={clsx(styles.date, isActive && !isSoldOut && styles.active)}
      disabled={isSoldOut}
      aria-disabled={isSoldOut}
      onClick={() => {
        if (!isSoldOut) {
          onClick?.(day.date)
        }
      }}
    >
      {displayBadge && (
        <span className={styles.date__badge} style={badgeStyle}>
          {displayBadge}
        </span>
      )}
      <span className={styles.date__weekday}>{weekday}</span>
      <span className={styles.date__day}>{dayNumber}</span>
      {lowestPrice ? (
        <CoreRocketRezPrice
          className={styles.date__price}
          showPrefix={true}
          data={{
            id: `${day.date}-lowest-price`,
            price: lowestPrice.price
          }}
        />
      ) : (
        <span className={styles.date__sold_out}>{t('sold_out')}</span>
      )}
    </button>
  )
}
