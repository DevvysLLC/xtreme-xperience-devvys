'use client'

import { type FC, type ReactNode, useCallback, useMemo } from 'react'
import { ROUTES } from '../../config/routes'
import type { EventDataFragment } from '../../core/dato/fragments/event-data.typegen'
import type { TrackFragment } from '../../core/dato/fragments/track.typegen'
import type { TrackDataFragment } from '../../core/dato/fragments/track-data.typegen'
import { useAnalyticsGA4Event } from '../../features/analytics'
import { getLegacyEventBookingLink } from '../../utils/get-booking-event-link'
import { getBookingLinkParams } from '../../utils/get-booking-link-params'
import { CoreCta } from '../core-cta'
import type { LayoutType, SizeType, StyleType } from '../core-cta/io'
import { useGlobalConfig } from '../global-config/context'

export type Props = {
  track: TrackFragment | TrackDataFragment | null
  event: EventDataFragment | null
  setHomeTrack?: boolean
  text?: string | null
  layoutType?: LayoutType
  styleType?: StyleType
  sizeType?: SizeType
  className?: string
  children?: ReactNode
}

export const BookingEventLink: FC<Props> = ({
  track,
  event,
  setHomeTrack = false,
  text,
  layoutType = 'button',
  styleType,
  sizeType = 'small',
  className,
  children
}) => {
  const ga4 = useAnalyticsGA4Event()
  const { bookingEnableLegacyBooking } = useGlobalConfig()

  const bookingUrl = useMemo(() => {
    if (!event) {
      return ROUTES.FRONTEND.EVENTS.LISTING
    }

    if (bookingEnableLegacyBooking) {
      return getLegacyEventBookingLink(event)
    }

    const params = getBookingLinkParams(track, event, setHomeTrack)
    return `${ROUTES.BOOKING.HOME}?${params.toString()}`
  }, [track, event, setHomeTrack, bookingEnableLegacyBooking])

  const handleClick = useCallback(() => {
    if (!track || !event) {
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
  }, [ga4, track, event])

  return (
    <CoreCta
      href={bookingUrl}
      layoutType={layoutType}
      styleType={styleType}
      sizeType={sizeType}
      text={text}
      className={className}
      onClick={handleClick}
    >
      {children}
    </CoreCta>
  )
}
