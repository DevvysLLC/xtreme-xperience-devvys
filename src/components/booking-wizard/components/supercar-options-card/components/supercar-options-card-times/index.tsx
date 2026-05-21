'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { RocketRezScheduleStatus } from '../../../../../../io/schemas'
import type {
  RocketRezEventRateTypeWithId,
  RocketRezEventScheduleItem
} from '../../../../../../io/types'
import { getRateTypePrice } from '../../../../../../utils/get-rate-type-price'
import { isScheduleSoldOut } from '../../../../../../utils/is-schedule-sold-out'
import { CoreBadge } from '../../../../../core-badge'
import { CoreRocketRezPrice } from '../../../../../core-rocketrez-price'
import { formatStartTimeForUsLocale } from '../../../../config'
import { useSupercarOptionsCard } from '../../context'
import styles from './style.module.scss'

type Props = {
  supercarId: number | string
  rocketRezSeatTypeId: number
  schedules: RocketRezEventScheduleItem[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}

const SHOW_AVAILABLE_THRESHOLD = 9

export const SupercarOptionsCardTimes: React.FC<Props> = ({
  supercarId,
  rocketRezSeatTypeId,
  schedules,
  field,
  form
}) => {
  const { state, setSelectedDaySchedule } = useSupercarOptionsCard()
  const t = useTranslations(
    'booking_wizard.pages.date_and_car.supercar_options_card'
  )

  if (schedules.length === 0) {
    return null
  }

  const selectedAvailable = state.selectedDaySchedule?.available ?? null
  const selectedAvailableDisplay =
    selectedAvailable !== null && selectedAvailable > 0
      ? Math.min(selectedAvailable, SHOW_AVAILABLE_THRESHOLD)
      : null

  return (
    <fieldset className={styles.times}>
      <legend className={styles.times__legend}>
        <span className={styles.times__title}>{t('label.schedules')}</span>
        {selectedAvailableDisplay !== null && (
          <CoreBadge
            label={t('badge.spots_left', {
              count: selectedAvailableDisplay
            })}
            backgroundColor="oklch(0.6803 0.214372 39.8015)"
            color="oklch(1 0 0)"
          />
        )}
      </legend>
      <div className={styles.times__options}>
        {schedules.map((schedule) => {
          const scheduleId = schedule.id ?? 0
          const isAvailable =
            schedule.scheduleStatus === RocketRezScheduleStatus.AVAILABLE
          const isSelected =
            state.selectedDaySchedule?.scheduleId === scheduleId
          let matchingRate: RocketRezEventRateTypeWithId | null = null
          let matchingSeatTypeAvailable: number | null = null

          if (schedule.seatTypes && Array.isArray(schedule.seatTypes)) {
            for (const seatType of schedule.seatTypes) {
              if (seatType?.rates && Array.isArray(seatType.rates)) {
                const rate = seatType.rates.find(
                  (r) => r?.id === rocketRezSeatTypeId
                )
                if (rate) {
                  matchingRate = rate
                  matchingSeatTypeAvailable = seatType.available ?? null
                  break
                }
              }
            }
          }

          const rateType = matchingRate?.rateTypes?.[0]
          const rateTypePrice = getRateTypePrice(rateType)
          const price = rateTypePrice?.price ?? null
          const hasPrice = rateTypePrice?.hasPrice ?? false
          const isSoldOut = isScheduleSoldOut(schedule, rocketRezSeatTypeId)
          const displayStartTime = formatStartTimeForUsLocale(
            schedule.startTime
          )
          const availableDisplay =
            matchingSeatTypeAvailable !== null && matchingSeatTypeAvailable > 0
              ? Math.min(matchingSeatTypeAvailable, SHOW_AVAILABLE_THRESHOLD)
              : null

          return (
            <label
              key={scheduleId}
              className={clsx(
                styles.time,
                isSelected && styles['time--selected'],
                isSoldOut && styles['time--sold-out']
              )}
            >
              <input
                type="radio"
                name={`schedule-${supercarId}`}
                value={scheduleId}
                checked={isSelected}
                disabled={isSoldOut}
                className={styles.time__input}
                onChange={() => {
                  if (matchingRate && rateType) {
                    const newSelectedDaySchedule = {
                      scheduleId,
                      rateId: matchingRate.id,
                      rateType: rateType.type,
                      startTime: schedule.startTime,
                      available: matchingSeatTypeAvailable,
                      price,
                      rateTypePrice
                    }
                    setSelectedDaySchedule(newSelectedDaySchedule)
                    field.handleChange(scheduleId)
                    form.setFieldValue('rateId', matchingRate.id)
                    form.setFieldValue('rateType', rateType.type)
                  }
                }}
              />
              {!isSoldOut && availableDisplay !== null && (
                <span className={styles.time__available}>
                  {availableDisplay}
                </span>
              )}
              <span className={styles.time__title}>{displayStartTime}</span>
              {!isSoldOut && hasPrice && isAvailable && (
                <span className={styles.time__label}>
                  <CoreRocketRezPrice
                    data={{
                      id: `schedule-price-${scheduleId}`,
                      price,
                      compareAtPrice: null
                    }}
                  />
                </span>
              )}
              {isSoldOut && (
                <span className={styles.time__label}>
                  {t('badge.sold_out')}
                </span>
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
