'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { BOOKING_LAP_QUANTITY_OPTIONS } from '../../../../../../config/settings'
import type { RocketRezEventScheduleItem } from '../../../../../../io/types'
import { getBookingLapsPerSession } from '../../../../../../utils/get-booking-laps-per-session'
import { isScheduleSoldOut } from '../../../../../../utils/is-schedule-sold-out'
import { useBookingWizardState } from '../../../../context'
import { useSupercarOptionsCard } from '../../context'
import styles from './style.module.scss'

type BookingConfigLabelField =
  | 'quantityLabelThreeLaps'
  | 'quantityLabelSixLaps'
  | 'quantityLabelNineLaps'

type BookingConfigTitleField =
  | 'quantityTitleThreeLaps'
  | 'quantityTitleSixLaps'
  | 'quantityTitleNineLaps'

type BookingConfigLabelData = Partial<
  Record<BookingConfigLabelField, string | null>
>

type BookingConfigTitleData = Partial<
  Record<BookingConfigTitleField, string | null>
>

const BOOKING_CONFIG_LABEL_FIELD_BY_KEY: Record<
  string,
  BookingConfigLabelField
> = {
  quantity_label_three_laps: 'quantityLabelThreeLaps',
  quantity_label_six_laps: 'quantityLabelSixLaps',
  quantity_label_nine_laps: 'quantityLabelNineLaps'
}

const BOOKING_CONFIG_TITLE_FIELD_BY_KEY: Record<
  string,
  BookingConfigTitleField
> = {
  quantity_label_three_laps: 'quantityTitleThreeLaps',
  quantity_label_six_laps: 'quantityTitleSixLaps',
  quantity_label_nine_laps: 'quantityTitleNineLaps'
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isBookingConfigLabelData = (
  value: unknown
): value is BookingConfigLabelData => isRecord(value)

const isBookingConfigTitleData = (
  value: unknown
): value is BookingConfigTitleData => isRecord(value)

type Props = {
  supercarId: number | string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any
  schedules: RocketRezEventScheduleItem[]
  rocketRezSeatTypeId: number
}

export const SupercarOptionsCardLaps: React.FC<Props> = ({
  supercarId,
  field,
  schedules,
  rocketRezSeatTypeId
}) => {
  const { state: wizardState } = useBookingWizardState()
  const {
    state,
    setSelectedLapQuantityOption,
    setTotalAvailableSessions,
    setSelectedQuantity
  } = useSupercarOptionsCard()
  const t = useTranslations(
    'booking_wizard.pages.date_and_car.supercar_options_card'
  )
  const lapsPerSession = getBookingLapsPerSession({
    configData: wizardState.configData,
    selectedEventId: wizardState.selectedEvent?.id
  })
  const selectedSessions = state.selectedLapQuantityOption.quantity
  const selectedLaps = selectedSessions * lapsPerSession
  const legendDescription = t('description.selected_laps', {
    laps: selectedLaps,
    sessions: selectedSessions
  })

  useEffect(() => {
    const count = schedules.filter(
      (schedule) => !isScheduleSoldOut(schedule, rocketRezSeatTypeId)
    ).length
    setTotalAvailableSessions(count)
  }, [schedules, rocketRezSeatTypeId, setTotalAvailableSessions])

  return (
    <fieldset className={styles.laps}>
      <legend className={styles.laps__legend}>
        <span className={styles.laps__title}>{t('label.quantity')}</span>
        <span className={styles.laps__description}>{legendDescription}</span>
      </legend>
      <div className={styles.laps__options}>
        {BOOKING_LAP_QUANTITY_OPTIONS.map((option) => {
          const isSelected =
            state.selectedLapQuantityOption.quantity === option.quantity
          const isSoldOut = state.totalAvailableSessions < option.quantity
          const configField =
            option.booking_config_label_key != null
              ? BOOKING_CONFIG_LABEL_FIELD_BY_KEY[
                  option.booking_config_label_key
                ]
              : undefined
          const titleConfigField =
            option.booking_config_label_key != null
              ? BOOKING_CONFIG_TITLE_FIELD_BY_KEY[
                  option.booking_config_label_key
                ]
              : undefined
          const bookingConfigData = wizardState.configData
          const eventOverride = bookingConfigData?.eventOverrides.find(
            (override) => override.event?.id === wizardState.selectedEvent?.id
          )
          const optionLabelFromCms =
            configField != null &&
            isBookingConfigLabelData(bookingConfigData) &&
            typeof bookingConfigData[configField] === 'string'
              ? bookingConfigData[configField]
              : ''
          const optionTitleFromCms =
            titleConfigField != null &&
            isBookingConfigTitleData(eventOverride) &&
            typeof eventOverride?.[titleConfigField] === 'string'
              ? eventOverride[titleConfigField]
              : ''

          return (
            <label
              key={option.quantity}
              className={clsx(
                styles.lap,
                isSelected && styles['lap--selected'],
                isSoldOut && styles['lap--sold-out']
              )}
            >
              <input
                type="radio"
                name={`quantity-${supercarId}`}
                value={option.quantity}
                checked={isSelected}
                disabled={isSoldOut}
                onChange={() => {
                  setSelectedLapQuantityOption(option)
                  setSelectedQuantity(option.quantity)
                  field.handleChange(option.quantity)
                }}
                className={styles.lap__input}
              />

              <span className={styles.lap__title}>
                {optionTitleFromCms || option.label}
              </span>

              {optionLabelFromCms && !isSoldOut && (
                <span className={styles.lap__label}>{optionLabelFromCms}</span>
              )}

              {isSoldOut && option.soldOutBadge && (
                <span className={styles.lap__label}>
                  {option.soldOutBadge.label}
                </span>
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
