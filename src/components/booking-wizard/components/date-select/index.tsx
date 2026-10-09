'use client'

import { useTranslations } from 'next-intl'
import { type FC, useEffect, useRef } from 'react'
import type { EventDataFragment } from '../../../../core/dato/fragments/event-data.typegen'
import { logger } from '../../../../core/logger/logger'
import {
  useBooking,
  useBookingResetAfter,
  useBookingSetEvent
} from '../../../../features/booking'
import { useCart } from '../../../../features/cart'
import { useDialog } from '../../../../features/dialog'
import { formatEventDateRangeShort } from '../../../../utils/date-time'
import { getEventDataFragment } from '../../../../utils/get-event-data-fragment'
import { CoreIcon } from '../../../core-icon'
import { useBookingWizardState } from '../../context'
import styles from './style.module.scss'

type Props = {
  label: string
}

export const DateSelect: FC<Props> = ({ label }) => {
  const t = useTranslations('booking_wizard.pages.date_and_car.change_dialog')
  const { data: booking } = useBooking()
  const setEvent = useBookingSetEvent()
  const resetAfter = useBookingResetAfter()
  const { data } = useCart()
  const { contents } = data ?? {}
  const hasCartItems = (contents?.totalItems ?? 0) > 0
  const { showDialog } = useDialog()
  const { state, setSelectedDayDate } = useBookingWizardState()
  const events = booking?.track?.model?.events ?? []
  const selectedEventId = booking?.event?.model?.id ?? ''
  const currentEventStartDate = booking?.event?.model?.startDate
  const previousEventIdRef = useRef<string | undefined>(selectedEventId)

  // Initialize selectedDay when event changes or when eventData is first loaded
  // Reset to first available day when switching events, but don't override user selections within the same event
  useEffect(() => {
    const eventChanged = previousEventIdRef.current !== selectedEventId
    const schedules = state.eventData?.schedules

    if (!schedules || schedules.length === 0) {
      // Don't consume eventChanged flag until schedules are available
      return
    }

    // Update ref only after schedules are available so we don't lose the
    // eventChanged flag while waiting for new event data to load
    previousEventIdRef.current = selectedEventId

    // Check if current selectedDay is stale (not present in current schedules)
    const selectedDayIsStale =
      state.selectedDayDate !== null &&
      !schedules.some((day) => day.date === state.selectedDayDate)

    // Prefer the event's start date; fall back to first available day
    const startDateMatch = currentEventStartDate
      ? schedules.find((day) => day.date === currentEventStartDate)
      : null
    const matchingDay = startDateMatch ?? schedules[0]

    // Set selectedDay if:
    // 1. Event changed (reset to new event's first available day)
    // 2. No selectedDay is set yet (initial load)
    // 3. Current selectedDay is stale (not in current schedules)
    if (
      matchingDay &&
      (eventChanged || !state.selectedDayDate || selectedDayIsStale)
    ) {
      setSelectedDayDate(matchingDay.date)
    }
  }, [
    selectedEventId,
    currentEventStartDate,
    state.eventData?.schedules,
    state.selectedDayDate,
    setSelectedDayDate
  ])

  const handleChange = async (newEventId: string) => {
    const isNewEvent = newEventId !== selectedEventId
    const newEvent = events.find((event) => event.model?.id === newEventId)
    if (!newEvent?.model || !booking?.track) {
      return
    }

    const eventFragment: EventDataFragment = getEventDataFragment(
      newEvent.id,
      newEvent.model,
      booking.track.config,
      booking.track.model
    )

    if (hasCartItems && isNewEvent) {
      showDialog({
        translations: {
          title: t('title'),
          description: t('description'),
          confirmButton: t('button.confirm'),
          cancelButton: t('button.cancel')
        },
        onConfirm: async () => {
          try {
            await resetAfter.mutateAsync({ pageId: 'location' })
            await setEvent.mutateAsync(eventFragment)
          } catch (error) {
            logger.error(
              { error, eventFragment },
              'date-select.handleChange.error'
            )
          }
        }
      })
      return
    }

    try {
      await setEvent.mutateAsync(eventFragment)
    } catch (error) {
      logger.error({ error, eventFragment }, 'date-select.handleChange.error')
    }
  }

  return (
    <div className={styles['event-ranges']} role="group" aria-label={label}>
      {events.map((event) => {
        const isSelected = event.model?.id === selectedEventId
        const year = event.model?.startDate
          ? new Date(event.model.startDate).getFullYear()
          : ''
        return (
          <button
            key={event.model?.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => handleChange(event.model?.id ?? '')}
            disabled={resetAfter.isPending || setEvent.isPending}
            className={styles['event-range-button']}
          >
            <strong>
              {formatEventDateRangeShort(
                event.model?.startDate,
                event.model?.endDate
              )}
            </strong>
            <small>{year}</small>
          </button>
        )
      })}
    </div>
  )
}
