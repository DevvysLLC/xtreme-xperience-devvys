'use client'

import { useTranslations } from 'next-intl'
import { type FC, useEffect, useMemo } from 'react'
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
import { isEventPassed } from '../../../../utils/is-event-passed'
// import { CoreIcon } from '../../../core-icon'
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
  const { setSelectedDayDate } = useBookingWizardState()
  const events = useMemo(
    () => booking?.track?.model?.events ?? [],
    [booking?.track?.model?.events]
  )
  const selectedEventId = booking?.event?.model?.id ?? ''

  useEffect(() => {
    if (
      !booking?.track ||
      hasCartItems ||
      setEvent.isPending ||
      resetAfter.isPending
    ) {
      return
    }

    const currentEventInList = events.find(
      (e) => e.model?.id === selectedEventId
    )
    const isCurrentSoldOut = Boolean(
      booking?.event?.model?.soldOut || currentEventInList?.model?.soldOut
    )

    if (!isCurrentSoldOut) {
      return
    }

    const nextAvailableEvent = events.find(
      (e) =>
        e.model &&
        !e.model.soldOut &&
        !isEventPassed(e.model.startDate, e.model.endDate)
    )

    if (!nextAvailableEvent?.model) {
      return
    }

    const eventFragment: EventDataFragment = getEventDataFragment(
      nextAvailableEvent.id,
      nextAvailableEvent.model,
      booking.track.config,
      booking.track.model
    )

    setSelectedDayDate(null)
    setEvent.mutate(eventFragment)
  }, [
    booking?.track,
    booking?.event?.model?.soldOut,
    events,
    selectedEventId,
    hasCartItems,
    setEvent,
    resetAfter.isPending,
    setSelectedDayDate
  ])

  const handleChange = async (newEventId: string) => {
    const isNewEvent = newEventId !== selectedEventId
    const newEvent = events.find((event) => event.model?.id === newEventId)
    if (!newEvent?.model || newEvent.model.soldOut || !booking?.track) {
      return
    }
    if (isNewEvent) {
      setSelectedDayDate(null)
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
        const isSoldOut =
          Boolean(event.model?.soldOut) ||
          isEventPassed(event.model?.startDate, event.model?.endDate)
        const isSelected = !isSoldOut && event.model?.id === selectedEventId
        return (
          <button
            key={event.model?.id}
            type="button"
            aria-pressed={isSelected}
            aria-disabled={isSoldOut}
            onClick={() => {
              if (!isSoldOut) {
                handleChange(event.model?.id ?? '')
              }
            }}
            disabled={isSoldOut || resetAfter.isPending || setEvent.isPending}
            className={styles['event-range-button']}
          >
            <strong>
              {formatEventDateRangeShort(
                event.model?.startDate,
                event.model?.endDate
              )}
            </strong>
            {isSoldOut && (
              <span className={styles['event-range-sold-out']}>SOLD OUT</span>
            )}
            {isSelected && (
              <span className={styles['event-range-check']} aria-hidden="true">
                ✓
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
