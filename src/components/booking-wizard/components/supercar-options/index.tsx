'use client'

import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import { ROUTES } from '../../../../config/routes'
import type { BookingSupercarGroupFragment } from '../../../../core/dato/fragments/booking-config.typegen'
import { getSeatTypeIdWithOverride } from '../../../../utils/get-seat-type-id-with-override'
import {
  filterSupercarsByEventAssignment,
  sortSupercarsByAvailability
} from '../../../../utils/sort-supercars-by-availability'
import { useBookingWizardState } from '../../context'
import { SupercarOptionsCard } from '../supercar-options-card'
import styles from './style.module.scss'

type Props = {
  initialTabIndex?: number
}

export const SupercarOptions: React.FC<Props> = ({ initialTabIndex = 0 }) => {
  const { state, setActiveTabIndex } = useBookingWizardState()
  const [selectedCarKey, setSelectedCarKey] = useState<string | null>(null)
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

  // Reset selected card when active tab or day changes
  useEffect(() => {
    setSelectedCarKey(null)
  }, [activeTabIndex, state.selectedDayDate])

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
    () =>
      state.eventData?.schedules?.flatMap((day) => day.schedules ?? []) ?? [],
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

    return sortSupercarsByAvailability(filtered, schedules, (supercar) =>
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
          {supercarGroups.map((group, index) => {
            const title = group.title ?? `Group ${index + 1}`
            let description = 'Choose your option'
            if (title.toLowerCase().includes('drive')) {
              description = 'Pick your car'
            } else if (title.toLowerCase().includes('package')) {
              description = 'Drive 2-8 supercars'
            } else if (title.toLowerCase().includes('ride')) {
              description = 'A pro drives. You ride.'
            }

            return (
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
                  aria-pressed={activeTabIndex === index}
                >
                  <span className={styles.tabs__tab_title}>{title}</span>
                  <span className={styles.tabs__tab_description}>{description}</span>
                </button>
              </li>
            )
          })}
          <li>
            <a
              href={ROUTES.FRONTEND.GIFT_CARDS}
              className={styles.tabs__button}
              style={{ textDecoration: 'none' }}
              data-tab="gifts"
            >
              <span className={styles.tabs__tab_title}>Gift cards</span>
              <span className={styles.tabs__tab_description}>Let them choose</span>
            </a>
          </li>
        </ul>
      </div>

      <div className={styles.filterbar}>
        <span className={styles.filterbar__count}>
          {sortedSupercars.length} supercars{state.selectedDayDate ? ` • ${state.selectedDayDate}` : ''}
        </span>
      </div>

      <div className={styles.guide}>
        <p className={styles.guide__intro}>
          Early sessions cost less. Choose a time for your exact price.
        </p>
        <details className={styles.guide__details}>
          <summary>How savings are calculated</summary>
          <p>
            Savings compare your selected price with the highest standard price for that session.
          </p>
        </details>
      </div>

      <div className={styles.supercars}>
        {sortedSupercars.map((option, index) => {
          const seatTypeId = getSeatTypeIdWithOverride({
            defaultSeatTypeId: option.rocketRezSeatTypeId,
            overrides: option.rocketRezSeatTypeIdOverrides,
            selectedEventId
          })
          const carKey = `${activeTabIndex}-${seatTypeId}-${index}`
          const isSelected = selectedCarKey === carKey

          return (
            <SupercarOptionsCard
              key={carKey}
              cardIndex={index}
              rocketRezSeatTypeId={seatTypeId}
              supercar={option}
              isSelected={isSelected}
              onToggleSelect={() => {
                setSelectedCarKey((prev) => (prev === carKey ? null : carKey))
              }}
              onClose={() => {
                setSelectedCarKey(null)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
