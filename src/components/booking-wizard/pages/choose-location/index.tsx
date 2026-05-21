'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import type { EventDataFragment } from '../../../../core/dato/fragments/event-data.typegen'
import type { TrackDataFragment } from '../../../../core/dato/fragments/track-data.typegen'
import { useBookingWithCart } from '../../../../features/booking'
import { useLocation } from '../../../../features/location'
import { findTrackForEvent } from '../../../../utils/find-track-for-event'
import { BookingEventCard } from '../../../booking-event-card'
import { LocationPickerCore } from '../../../section-event-finder/components/location-picker-core'
import sectionStyles from '../../../section-event-finder/style.module.scss'
import { BookingLayout } from '../../components/booking-layout'

export const LocationPage = () => {
  const t = useTranslations('booking_wizard.pages.location')
  const { booking } = useBookingWithCart()
  const { data: location } = useLocation()
  const initialSearchValue =
    booking?.track?.model?.nickname ??
    location?.track?.model?.nickname ??
    undefined

  const renderEvent = useCallback(
    (event: EventDataFragment, tracks: TrackDataFragment[]) => {
      const track = findTrackForEvent(event, tracks)

      return (
        <BookingEventCard
          key={event.model?.id}
          event={event}
          track={track}
          isSelectable
          buttonText={t('button.select')}
        />
      )
    },
    [t]
  )

  return (
    <BookingLayout>
      <section className={sectionStyles.section}>
        <LocationPickerCore
          initialSearchValue={initialSearchValue}
          title={<h2 className={sectionStyles.section__title}>{t('title')}</h2>}
          renderEvent={renderEvent}
          loadingMessage={t('loading')}
          emptyMessage={t('no_events')}
        />
      </section>
    </BookingLayout>
  )
}
