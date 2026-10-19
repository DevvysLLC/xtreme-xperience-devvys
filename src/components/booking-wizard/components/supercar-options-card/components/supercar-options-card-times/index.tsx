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
import { CoreRocketRezPrice } from '../../../../../core-rocketrez-price'
import { formatStartTimeForUsLocale } from '../../../../config'
import { useBookingWizardState } from '../../../../context'
import { useSupercarOptionsCard } from '../../context'
import { getScheduleDiscount } from '../../../../../../utils/get-schedule-discount'
import styles from './style.module.scss'

type Props = {
  supercarId: number | string
  rocketRezSeatTypeId: number
  packageRateIds?: number[]
  isMulticar?: boolean
  schedules: RocketRezEventScheduleItem[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  priceOverride?: {
    price?: number | null
    compareAtPrice?: number | null
  } | null
  onTimeSelect?: () => void
}

const SHOW_AVAILABLE_THRESHOLD = 9

export const SupercarOptionsCardTimes: React.FC<Props> = ({
  supercarId,
  rocketRezSeatTypeId,
  packageRateIds,
  isMulticar,
  schedules,
  field,
  form,
  priceOverride,
  onTimeSelect
}) => {
  const { state: cardState, setSelectedDaySchedule } = useSupercarOptionsCard()
  const { state: wizardState } = useBookingWizardState()
  const t = useTranslations(
    'booking_wizard.pages.date_and_car.supercar_options_card'
  )

  if (schedules.length === 0) {
    return null
  }

  return (
    <fieldset className={styles.times}>
      <legend className={styles.times__legend}>
        <span className={styles.times__title}>Choose a start time</span>
      </legend>
      <p className={styles.times__subtitle}>
        9:00 and 9:30 AM starts have lower prices.
      </p>
      <p className={styles.times__key}>
        Number badge = spots available
      </p>
      <div className={styles.times__options}>
        {schedules.map((schedule) => {
          const scheduleId = schedule.id ?? 0
          const isAvailable =
            schedule.scheduleStatus === RocketRezScheduleStatus.AVAILABLE
          const isSelected =
            cardState.selectedDaySchedule?.scheduleId === scheduleId
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
                  break
                }
              }
            }

            if (isMulticar && packageRateIds && packageRateIds.length > 0) {
              // For packages, find the minimum available count among physical component seat types
              let minAvailable: number | null = null
              for (const rateId of packageRateIds) {
                for (const seatType of schedule.seatTypes) {
                  if (!seatType) {
                    continue
                  }
                  const hasRate = (seatType.rates ?? []).some(
                    (r) => r.id === rateId
                  )
                  if (hasRate) {
                    if ((seatType.capacity ?? 0) > 0) {
                      const av = seatType.available ?? 0
                      if (minAvailable === null || av < minAvailable) {
                        minAvailable = av
                      }
                    }
                    break
                  }
                }
              }
              matchingSeatTypeAvailable = minAvailable
            } else {
              // Single supercar
              for (const seatType of schedule.seatTypes) {
                if (seatType?.rates && Array.isArray(seatType.rates)) {
                  const rate = seatType.rates.find(
                    (r) => r?.id === rocketRezSeatTypeId
                  )
                  if (rate) {
                    matchingSeatTypeAvailable = seatType.available ?? null
                    break
                  }
                }
              }
            }
          }

          const rateType = matchingRate?.rateTypes?.[0]
          const rateTypePrice = getRateTypePrice(rateType)

          // Preserve dynamic day/time schedule price from RocketRez; fallback to priceOverride.price if missing
          const rawSchedulePrice =
            rateTypePrice?.price ??
            (priceOverride?.price != null ? priceOverride.price / 100 : null)

          const rawCompareAtPrice =
            (priceOverride?.compareAtPrice != null
              ? priceOverride.compareAtPrice / 100
              : null) ??
            rateTypePrice?.compareAtPrice ??
            null

          // Apply discount rules (morning 8-10 AM vs afternoon 10:30-5:30 PM, event & car scopes)
          const discountRules = wizardState.configData?.discountRules
          const discountResult = getScheduleDiscount({
            scheduleStartTime: schedule.startTime,
            scheduleDate: wizardState.selectedDayDate,
            basePrice: rawSchedulePrice,
            existingCompareAtPrice: rawCompareAtPrice,
            eventId: wizardState.selectedEvent?.id,
            supercarId: String(supercarId),
            rules: discountRules
          })

          const discountAmount =
            discountResult.isDiscounted && rawSchedulePrice != null
              ? Math.max(0, rawSchedulePrice - discountResult.price)
              : 0

          const quantity = cardState.selectedQuantity ?? 1
          const unitPrice = discountResult.price
          const unitCompareAtPrice = discountResult.compareAtPrice
          const displayPrice =
            unitPrice != null ? unitPrice * quantity : null
          const displayCompareAtPrice =
            unitCompareAtPrice != null ? unitCompareAtPrice * quantity : null
          const hasPrice = rateTypePrice?.hasPrice ?? false
          const isSoldOut =
            isScheduleSoldOut(
              schedule,
              isMulticar && packageRateIds ? packageRateIds : rocketRezSeatTypeId
            ) ||
            (matchingSeatTypeAvailable !== null &&
              matchingSeatTypeAvailable < quantity)
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
                isSelected && !isSoldOut && styles['time--selected'],
                isSoldOut && styles['time--sold-out']
              )}
              onClick={() => {
                if (isSelected && !isSoldOut) {
                  onTimeSelect?.()
                }
              }}
            >
              <input
                type="radio"
                name={`schedule-${supercarId}`}
                value={scheduleId}
                checked={isSelected && !isSoldOut}
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
                      price: unitPrice,
                      rawPrice: rawSchedulePrice,
                      discountAmount,
                      discountLabel:
                        discountResult.badgeLabel || 'Early sessions',
                      rateTypePrice: rateTypePrice
                        ? {
                            ...rateTypePrice,
                            price: unitPrice,
                            compareAtPrice: unitCompareAtPrice
                          }
                        : null
                    }
                    setSelectedDaySchedule(newSelectedDaySchedule)
                    field.handleChange(scheduleId)
                    form.setFieldValue('rateId', matchingRate.id)
                    form.setFieldValue('rateType', rateType.type)
                    onTimeSelect?.()
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
                      price: displayPrice,
                      compareAtPrice: displayCompareAtPrice
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
