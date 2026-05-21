'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC, type ReactNode, useCallback, useMemo } from 'react'
import { ROUTES } from '../../config/routes'
import type { EventDataFragment } from '../../core/dato/fragments/event-data.typegen'
import type { TrackFragment } from '../../core/dato/fragments/track.typegen'
import type { TrackDataFragment } from '../../core/dato/fragments/track-data.typegen'
import { logger } from '../../core/logger/logger'
import { useAnalyticsGA4Event } from '../../features/analytics'
import {
  useBooking,
  useBookingResetAfter,
  useBookingSetEvent,
  useBookingSetTrack
} from '../../features/booking'
import { useCart } from '../../features/cart'
import { useDialog } from '../../features/dialog'
import { useLocationSetTrack } from '../../features/location'
import { getLegacyEventBookingLink } from '../../utils/get-booking-event-link'
import { getBookingLinkParams } from '../../utils/get-booking-link-params'
import { CoreCta } from '../core-cta'
import type { LayoutType, SizeType, StyleType } from '../core-cta/io'
import { useGlobalConfig } from '../global-config/context'

export type Props = {
  event: EventDataFragment | null
  track: TrackFragment | TrackDataFragment | null
  text?: string | null
  layoutType?: LayoutType
  styleType?: StyleType
  sizeType?: SizeType
  onReadyNavigate?: () => void
  className?: string
  children?: ReactNode
  bookingTargetPath?: string
  useBookingOverrideWithQueryParams?: boolean
}

export const BookingEventCta: FC<Props> = ({
  event,
  track,
  text,
  layoutType = 'text',
  styleType,
  sizeType = 'small',
  onReadyNavigate,
  className,
  children,
  bookingTargetPath,
  useBookingOverrideWithQueryParams = false
}) => {
  const t = useTranslations('booking_wizard.pages.location.change_dialog')
  const { data: booking } = useBooking()
  const setEvent = useBookingSetEvent()
  const setTrack = useBookingSetTrack()
  const resetAfter = useBookingResetAfter()
  const setLocationTrack = useLocationSetTrack()
  const { showDialog } = useDialog()
  const { data } = useCart()
  const ga4 = useAnalyticsGA4Event()
  const { bookingEnableLegacyBooking } = useGlobalConfig()
  const router = useRouter()
  const bookingUrlWithQueryParams = useMemo(() => {
    const params = getBookingLinkParams(track, event, true)
    return `${ROUTES.BOOKING.HOME}?${params.toString()}`
  }, [track, event])

  const isLoading =
    setEvent.isPending ||
    setTrack.isPending ||
    setLocationTrack.isPending ||
    resetAfter.isPending

  const navigateToBookingHome = useCallback(() => {
    const targetPath = bookingTargetPath ?? ROUTES.BOOKING.HOME
    router.push(targetPath)
  }, [router, bookingTargetPath])

  const performMutations = useCallback(
    async (options?: { shouldClearCart?: boolean }) => {
      if (!event || !track) {
        return
      }

      if (options?.shouldClearCart) {
        try {
          // Clears cart and booking pages after location (date_and_car through review)
          await resetAfter.mutateAsync({ pageId: 'location' })
          logger.info(
            'booking-event-cta.performMutations.resetAfterLocation.success'
          )
        } catch (error) {
          logger.error('Error clearing cart during mutations:', { error })
        }
      }

      const formattedTrack: TrackDataFragment = {
        __typename: track.__typename,
        id: track.id,
        config: track.config,
        model: track.model
      }

      try {
        await Promise.all([
          setEvent.mutateAsync(event),
          setTrack.mutateAsync(formattedTrack),
          setLocationTrack.mutateAsync(formattedTrack)
        ])
      } catch (error) {
        logger.error(
          { error, event, track, options },
          'booking-event-cta.performMutations.settingData.error'
        )
        throw error
      }

      if (onReadyNavigate) {
        onReadyNavigate()
      } else {
        navigateToBookingHome()
      }
    },
    [
      event,
      track,
      resetAfter,
      setEvent,
      setTrack,
      setLocationTrack,
      onReadyNavigate,
      navigateToBookingHome
    ]
  )

  const handleClick = useCallback(async () => {
    if (!event || !track || isLoading) {
      return
    }

    ga4.trackBookNow({
      track_id: track.id,
      track_name: track.config?.title ?? undefined,
      event_id: event.id,
      event_title: event.model?.title ?? undefined,
      rocket_rez_event_id: event.model?.rocketRezId ?? undefined,
      page_path: window.location.pathname
    })

    if (bookingEnableLegacyBooking) {
      const eventBookingLink = getLegacyEventBookingLink(event)
      router.push(eventBookingLink)
      return
    }

    if (useBookingOverrideWithQueryParams) {
      router.push(bookingUrlWithQueryParams)
      return
    }

    const currentTrackId = booking?.track?.id
    const newTrackId = track.id
    const isNewTrack = currentTrackId !== newTrackId

    const currentEventId = booking?.event?.id
    const newEventId = event.id
    const isNewEvent = currentEventId !== newEventId

    if (data.contents.hasCars && (isNewTrack || isNewEvent)) {
      showDialog({
        translations: {
          title: t('title'),
          description: t('description'),
          confirmButton: t('button.confirm'),
          cancelButton: t('button.cancel')
        },
        onConfirm: async () => {
          try {
            await performMutations({ shouldClearCart: true })
          } catch (error) {
            logger.error('Error performing mutations:', { error })
            window.location.reload()
          }
        },
        onCancel: () => {}
      })
      return
    }

    try {
      await performMutations({
        shouldClearCart: true
      })
    } catch (error) {
      logger.error('Error performing mutations:', { error })
      window.location.reload()
    }
  }, [
    event,
    track,
    router,
    isLoading,
    ga4,
    bookingEnableLegacyBooking,
    booking?.event?.id,
    data.contents.hasCars,
    booking?.track?.id,
    showDialog,
    performMutations,
    bookingUrlWithQueryParams,
    useBookingOverrideWithQueryParams,
    t
  ])

  if (!track || !event) {
    return (
      <CoreCta
        href={ROUTES.FRONTEND.EVENTS.LISTING}
        layoutType={layoutType}
        styleType={styleType}
        sizeType={sizeType}
        text={text}
        className={className}
      >
        {children}
      </CoreCta>
    )
  }

  return (
    <CoreCta
      href={null}
      layoutType={layoutType}
      styleType={styleType}
      sizeType={sizeType}
      text={text}
      className={className}
      onClick={handleClick}
      disabled={isLoading}
    >
      {children}
    </CoreCta>
  )
}
