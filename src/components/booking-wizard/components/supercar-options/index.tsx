'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo } from 'react'
import type { BookingSupercarGroupFragment } from '../../../../core/dato/fragments/booking-config.typegen'
import { getSeatTypeIdWithOverride } from '../../../../utils/get-seat-type-id-with-override'
import {
  filterSupercarsByEventAssignment,
  sortSupercarsByAvailability
} from '../../../../utils/sort-supercars-by-availability'
import { CoreIcon } from '../../../core-icon'
import { useBookingWizardState } from '../../context'
import { SupercarOptionsCard } from '../supercar-options-card'
import styles from './style.module.scss'

type Props = {
  initialTabIndex?: number
}

export const SupercarOptions: React.FC<Props> = ({ initialTabIndex = 0 }) => {
  const t = useTranslations(
    'booking_wizard.pages.date_and_car.supercar_options'
  )
  const { state, setActiveTabIndex } = useBookingWizardState()
  const supercarGroups: BookingSupercarGroupFragment[] =
    state.configData?.supercars ?? []
  const contextActiveTabIndex = state?.activeTabIndex ?? 0
  const activeTabIndex =
    contextActiveTabIndex !== 0
      ? contextActiveTabIndex
      : initialTabIndex >= 0 && initialTabIndex < supercarGroups.length
        ? initialTabIndex
        : 0
  const activeGroup = supercarGroups[activeTabIndex]
  const selectedEventId = state.selectedEvent?.model?.rocketRezId ?? null

  // Get schedules for the selected day to check sold-out status
  const selectedDaySchedules =
    state.eventData?.schedules?.find(
      (schedule) => schedule.date === state.selectedDayDate
    ) ?? null
  const schedules = useMemo(
    () => selectedDaySchedules?.schedules ?? [],
    [selectedDaySchedules?.schedules]
  )
  // Gather all schedules for all days of the event to check if a car is assigned to the event
  const allEventSchedules = useMemo(
    () => state.eventData?.schedules?.flatMap((day) => day.schedules ?? []) ?? [],
    [state.eventData?.schedules]
  )
  // Filter & sort supercars: filter out unassigned cars, and sort sold-out ones to the bottom
  const sortedSupercars = useMemo(() => {
    if (!activeGroup?.supercars) {
      return []
    }

    const filtered = filterSupercarsByEventAssignment(
      activeGroup.supercars,
      allEventSchedules,
      (supercar) =>
        getSeatTypeIdWithOverride({
          defaultSeatTypeId: supercar.rocketRezSeatTypeId,
          overrides: supercar.rocketRezSeatTypeIdOverrides,
          selectedEventId
        })
    )

    return sortSupercarsByAvailability(
      filtered,
      schedules,
      (supercar) =>
        getSeatTypeIdWithOverride({
          defaultSeatTypeId: supercar.rocketRezSeatTypeId,
          overrides: supercar.rocketRezSeatTypeIdOverrides,
          selectedEventId
        })
    )
  }, [activeGroup?.supercars, schedules, allEventSchedules, selectedEventId])

  useEffect(() => {
    if (
      contextActiveTabIndex === 0 &&
      initialTabIndex >= 0 &&
      initialTabIndex < supercarGroups.length
    ) {
      setActiveTabIndex(initialTabIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ul className={styles.tabs}>
          {supercarGroups.map((group, index) => (
            <li key={index}>
              <button
                type="button"
                className={clsx(
                  styles.tabs__button,
                  activeTabIndex === index && styles.active
                )}
                onClick={() => {
                  handleTabClick(index)
                }}
              >
                {group.title ?? `Group ${index + 1}`}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.info}>
          <CoreIcon
            icon="info"
            className={styles.info__icon}
            aria-hidden={true}
          />

          {t('info')}
        </div>
      </div>

      <div className={styles.supercars}>
        {sortedSupercars.map((option, index) => (
          <SupercarOptionsCard
            key={`${activeTabIndex}-${index}`}
            rocketRezSeatTypeId={getSeatTypeIdWithOverride({
              defaultSeatTypeId: option.rocketRezSeatTypeId,
              overrides: option.rocketRezSeatTypeIdOverrides,
              selectedEventId
            })}
            supercar={option}
          />
        ))}
      </div>
    </div>
  )
}
