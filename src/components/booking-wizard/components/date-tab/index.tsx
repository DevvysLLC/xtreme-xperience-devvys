'use client'

import clsx from 'clsx'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useBookingSupercarSchedule } from '../../../../features/booking'
import type {
  RocketRezEventScheduleDate,
  RocketRezEventScheduleItem
} from '../../../../io/types'
import { parseLocalDate } from '../../../../utils/date-time'
import { CoreRocketRezPrice } from '../../../core-rocketrez-price'
import styles from './style.module.scss'

type Props = {
  day: RocketRezEventScheduleDate
  schedules?: RocketRezEventScheduleItem[]
  rateIds?: number[]
  isActive: boolean
  badgeLabel?: string
  onClick?: (date: string) => void
  isMulticar?: boolean
}

export const DayTab: React.FC<Props> = ({
  day,
  schedules,
  rateIds,
  isActive,
  badgeLabel,
  onClick,
  isMulticar
}) => {
  const t = useTranslations('booking_wizard.pages.date_and_car.date_tab')
  const date = parseLocalDate(day.date)
  const weekday = format(date, 'EEEE')
  const dayNumber = format(date, 'd')
  const { lowestAvailablePriceFromRates } = useBookingSupercarSchedule()
  const lowestPrice = useMemo(() => {
    return lowestAvailablePriceFromRates(schedules, rateIds ?? [], isMulticar)
  }, [schedules, rateIds, lowestAvailablePriceFromRates, isMulticar])

  const displayBadge = useMemo(() => {
    if (badgeLabel) {
      return badgeLabel
    }
    if (
      lowestPrice &&
      lowestPrice.compareAtPrice &&
      lowestPrice.compareAtPrice > lowestPrice.price
    ) {
      const percent = Math.round(
        ((lowestPrice.compareAtPrice - lowestPrice.price) /
          lowestPrice.compareAtPrice) *
          100
      )
      if (percent > 0) {
        return `${percent}% OFF`
      }
    }
    return undefined
  }, [badgeLabel, lowestPrice])

  const isSoldOut = !lowestPrice

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
        <span className={styles.date__badge}>{displayBadge}</span>
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
