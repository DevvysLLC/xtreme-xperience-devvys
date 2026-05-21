'use client'

import { useTranslations } from 'next-intl'
import { type FC, useEffect, useRef } from 'react'
import type { EventDataFragment } from '../../../../core/dato/fragments/event-data.typegen'
import type { TrackDataFragment } from '../../../../core/dato/fragments/track-data.typegen'
import { logger } from '../../../../core/logger/logger'
import {
  useBooking,
  useBookingClear,
  useBookingResetAfter,
  useBookingSetEvent,
  useBookingSetIntendedPage,
  useBookingSetTrack
} from '../../../../features/booking'
import { useCart } from '../../../../features/cart'
import { useLocationSetTrack } from '../../../../features/location'
import { useToast } from '../../../../features/toast'

type Props = {
  track: TrackDataFragment
  event: EventDataFragment | null
  setHomeTrack?: boolean
}

export const BookingInitializer: FC<Props> = ({
  track,
  event,
  setHomeTrack = false
}) => {
  const t = useTranslations('booking_wizard.booking_initializer')
  const { showToast } = useToast()
  const { data: booking, isLoading: isBookingLoading } = useBooking()
  const { clear: clearCartLocal } = useCart()
  const clearBooking = useBookingClear()
  const setTrack = useBookingSetTrack()
  const setEvent = useBookingSetEvent()
  const setLocationTrack = useLocationSetTrack()
  const resetAfter = useBookingResetAfter()
  const setIntendedPage = useBookingSetIntendedPage()
  const isInitializing = useRef(false)
  const lastInitializedKey = useRef<string | null>(null)

  useEffect(() => {
    if (isBookingLoading) {
      return
    }

    const initKey = `${track.id}:${event?.id ?? 'none'}:${setHomeTrack ? 'home' : 'no-home'}`
    if (lastInitializedKey.current === initKey || isInitializing.current) {
      return
    }

    lastInitializedKey.current = initKey
    isInitializing.current = true

    const initialize = async () => {
      try {
        const existingTrackId = booking?.track?.id ?? null
        const existingTrackHandle = booking?.track?.config?.handle ?? null
        const incomingTrackHandle = track.config?.handle ?? null
        const existingEventRocketRezId =
          booking?.event?.model?.rocketRezId ?? null
        const incomingEventRocketRezId = event?.model?.rocketRezId ?? null
        const isTrackSwitch =
          existingTrackId !== null && existingTrackId !== track.id
        const isEventSwitch =
          (existingEventRocketRezId !== null ||
            incomingEventRocketRezId !== null) &&
          existingEventRocketRezId !== incomingEventRocketRezId
        const shouldResetAfter = isTrackSwitch || isEventSwitch
        const sameTrackHandle =
          Boolean(existingTrackHandle) &&
          Boolean(incomingTrackHandle) &&
          existingTrackHandle === incomingTrackHandle
        const sameEventRocketRezId =
          Boolean(existingEventRocketRezId) &&
          Boolean(incomingEventRocketRezId) &&
          existingEventRocketRezId === incomingEventRocketRezId
        const shouldPreserveCart = sameTrackHandle && sameEventRocketRezId
        const shouldClearCart = !shouldPreserveCart

        logger.info(
          {
            trackHandle: track.config?.handle,
            eventId: event?.id,
            setHomeTrack,
            existingTrackId,
            incomingTrackId: track.id,
            existingTrackHandle,
            incomingTrackHandle,
            existingEventRocketRezId,
            incomingEventRocketRezId,
            isTrackSwitch,
            isEventSwitch,
            shouldResetAfter,
            shouldPreserveCart,
            shouldClearCart
          },
          'BookingInitializer: starting initialization'
        )

        if (isTrackSwitch) {
          logger.info(
            {
              existingTrackId,
              incomingTrackId: track.id
            },
            'BookingInitializer: clearing booking for track switch'
          )
          await clearBooking.mutateAsync(undefined)
          logger.info(
            {
              existingTrackId,
              incomingTrackId: track.id
            },
            'BookingInitializer: cleared previous booking for track switch'
          )
        }

        if (shouldResetAfter) {
          try {
            logger.info(
              {
                pageId: 'location',
                isTrackSwitch,
                isEventSwitch,
                shouldClearCart,
                shouldPreserveCart
              },
              'BookingInitializer: running resetAfter'
            )
            await resetAfter.mutateAsync({
              pageId: 'location',
              clearCart: shouldClearCart
            })
            logger.info(
              {
                pageId: 'location',
                isTrackSwitch,
                isEventSwitch,
                shouldClearCart,
                shouldPreserveCart
              },
              'BookingInitializer: resetAfter completed'
            )
          } catch (error) {
            // Cart clear can be temporarily blocked by cart refresh.
            // Fall back to local cart/checkout clear so stale cart data never leaks
            // into a newly initialized booking session.
            if (shouldClearCart) {
              clearCartLocal()
            }
            logger.warn(
              {
                error,
                trackHandle: track.config?.handle,
                eventId: event?.id,
                isTrackSwitch,
                isEventSwitch,
                shouldClearCart,
                shouldPreserveCart
              },
              shouldClearCart
                ? 'BookingInitializer: resetAfter failed, local cart clear applied'
                : 'BookingInitializer: resetAfter failed, cart preserve mode active'
            )
          }
        } else {
          logger.info(
            {
              trackHandle: track.config?.handle,
              eventId: event?.id,
              isTrackSwitch,
              isEventSwitch
            },
            'BookingInitializer: skipping resetAfter because track/event are unchanged'
          )
        }

        logger.info(
          { trackHandle: track.config?.handle, trackId: track.id },
          'BookingInitializer: setting track'
        )
        await setTrack.mutateAsync(track)
        logger.info(
          { trackHandle: track.config?.handle, trackId: track.id },
          'BookingInitializer: track set'
        )

        if (event) {
          logger.info(
            {
              eventId: event.id,
              eventRocketRezId: incomingEventRocketRezId
            },
            'BookingInitializer: setting event'
          )
          await setEvent.mutateAsync(event)
          logger.info(
            {
              eventId: event.id,
              eventRocketRezId: incomingEventRocketRezId
            },
            'BookingInitializer: event set'
          )
        }

        if (setHomeTrack) {
          logger.info(
            { trackHandle: track.config?.handle, trackId: track.id },
            'BookingInitializer: setting home track'
          )
          await setLocationTrack.mutateAsync(track)
          logger.info(
            { trackHandle: track.config?.handle, trackId: track.id },
            'BookingInitializer: home track set'
          )
        }

        logger.info(
          { trackHandle: track.config?.handle, eventId: event?.id },
          'BookingInitializer: initialization complete, setting intendedPage'
        )

        await setIntendedPage.mutateAsync('date_and_car')
      } catch (error) {
        logger.error(
          { error, trackHandle: track.config?.handle, eventId: event?.id },
          'BookingInitializer: initialization failed'
        )
        showToast({
          message: t('error_initializing'),
          type: 'error'
        })
        if (booking?.intendedPageId !== 'location') {
          setIntendedPage.mutate('location')
        }
      } finally {
        isInitializing.current = false
      }
    }

    initialize()
    // Intentionally omit mutation/setState functions and booking so effect does not
    // re-run from booking writes/mutation state transitions, which can create
    // self-triggered initialization loops after failures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track, event, setHomeTrack, isBookingLoading])

  return null
}
