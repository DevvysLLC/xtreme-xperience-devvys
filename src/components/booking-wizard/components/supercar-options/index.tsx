'use client'

import clsx from 'clsx'
import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import type { BookingSupercarGroupFragment } from '../../../../core/dato/fragments/booking-config.typegen'
import { parseLocalDate } from '../../../../utils/date-time'
import { getSeatTypeIdWithOverride } from '../../../../utils/get-seat-type-id-with-override'
import {
  filterSupercarsByEventAssignment,
  sortSupercarsByAvailability,
  sortSupercarsByPrice
} from '../../../../utils/sort-supercars-by-availability'
import { useBookingWizardState } from '../../context'
import { GiftCardShop } from '../gift-card-shop'
import { SupercarOptionsCard } from '../supercar-options-card'
import styles from './style.module.scss'

type Props = {
  initialTabIndex?: number
}

const GIFTS_TAB_INDEX = -1

export const SupercarOptions: React.FC<Props> = ({ initialTabIndex = 0 }) => {
  const { state, setActiveTabIndex } = useBookingWizardState()
  const [selectedCarKey, setSelectedCarKey] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'featured' | 'low' | 'high'>('featured')
  const supercarGroups: BookingSupercarGroupFragment[] =
    state.configData?.supercars ?? []
  const contextActiveTabIndex = state?.activeTabIndex ?? 0
  const activeTabIndex =
    contextActiveTabIndex === GIFTS_TAB_INDEX
      ? GIFTS_TAB_INDEX
      : contextActiveTabIndex !== 0
        ? contextActiveTabIndex
        : initialTabIndex >= 0 && initialTabIndex < supercarGroups.length
          ? initialTabIndex
          : 0
  const isGiftsTab = activeTabIndex === GIFTS_TAB_INDEX
  const activeGroup = isGiftsTab ? null : supercarGroups[activeTabIndex]
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

    if (sortBy === 'low' || sortBy === 'high') {
      return sortSupercarsByPrice(
        filtered,
        schedules,
        sortBy,
        (supercar) =>
          getSeatTypeIdWithOverride({
            defaultSeatTypeId: supercar.rocketRezSeatTypeId,
            overrides: supercar.rocketRezSeatTypeIdOverrides,
            selectedEventId
          })
      )
    }

    return sortSupercarsByAvailability(filtered, schedules, (supercar) =>
      getSeatTypeIdWithOverride({
        defaultSeatTypeId: supercar.rocketRezSeatTypeId,
        overrides: supercar.rocketRezSeatTypeIdOverrides,
        selectedEventId
      })
    )
  }, [activeGroup?.supercars, schedules, allEventSchedules, selectedEventId, sortBy])

  const formattedDate = useMemo(() => {
    if (!state.selectedDayDate) {
      return null
    }
    try {
      const parsed = parseLocalDate(state.selectedDayDate)
      return format(parsed, 'EEE, MMM d')
    } catch {
      return state.selectedDayDate
    }
  }, [state.selectedDayDate])

  const resultTypeLabel = useMemo(() => {
    const title = activeGroup?.title?.toLowerCase() ?? ''
    if (title.includes('package')) {
      return 'packages'
    }
    if (title.includes('ride')) {
      return 'ride-alongs'
    }
    return 'supercars'
  }, [activeGroup?.title])

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
                    !isGiftsTab && activeTabIndex === index && styles.active
                  )}
                  onClick={() => {
                    handleTabClick(index)
                  }}
                  aria-pressed={!isGiftsTab && activeTabIndex === index}
                >
                  <span className={styles.tabs__tab_title}>{title}</span>
                  <span className={styles.tabs__tab_description}>{description}</span>
                </button>
              </li>
            )
          })}
          <li>
            <button
              type="button"
              className={clsx(
                styles.tabs__button,
                isGiftsTab && styles.active
              )}
              onClick={() => {
                handleTabClick(GIFTS_TAB_INDEX)
              }}
              aria-pressed={isGiftsTab}
              data-tab="gifts"
            >
              <span className={styles.tabs__tab_title}>Gift cards</span>
              <span className={styles.tabs__tab_description}>Let them choose</span>
            </button>
          </li>
        </ul>
      </div>

      {isGiftsTab ? (
        <GiftCardShop />
      ) : (
        <>
          <div className={styles.filterbar}>
            <span className={styles.filterbar__count}>
              {sortedSupercars.length} {resultTypeLabel}{formattedDate ? ` · ${formattedDate}` : ''}
            </span>
            <div className={styles.filterbar__sort}>
              <label htmlFor="supercar-sort-select">Sort: </label>
              <select
                id="supercar-sort-select"
                aria-label="Sort experiences"
                value={sortBy}
                onChange={(e) => {
                  const val = e.target.value
                  if (val === 'low' || val === 'high' || val === 'featured') {
                    setSortBy(val)
                  }
                }}
              >
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </div>
          </div>

          <div className={styles.guide}>
            <p className={styles.guide__intro}>
              Early sessions cost less. Choose a time for your exact price.
            </p>
            <details className={styles.guide__details}>
              <summary>How savings are calculated</summary>
              <p>
                Savings compare your selected price with the highest Thursday–Sunday standard price. For packages, the reference is the highest full value, including the listed inclusions. Starting prices use 9:00 or 9:30 AM sessions. Coverage is additional except where included in Full Fleet.
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
        </>
      )}
    </div>
  )
}
