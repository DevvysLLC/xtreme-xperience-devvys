'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC, useCallback } from 'react'
import { ROUTES } from '../../config/routes'
import type { EventDataFragment } from '../../core/dato/fragments/event-data.typegen'
import type { TrackDataFragment } from '../../core/dato/fragments/track-data.typegen'
import { getSectionId } from '../../core/string/get-section-id'
import { findTrackForEvent } from '../../utils/find-track-for-event'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { BookingEventCard } from '../booking-event-card'
import { LocationPickerCore } from './components/location-picker-core'
import type { SectionEventFinderFragment } from './section-event-finder.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionEventFinderFragment
  isFirstSection?: boolean
}

export const SectionEventFinder: FC<Props> = ({ data, isFirstSection }) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const t = useTranslations('section_event_finder')
  const router = useRouter()
  const { config, id, title } = data

  const renderEvent = useCallback(
    (event: EventDataFragment, tracks: TrackDataFragment[]) => {
      const track = findTrackForEvent(event, tracks)

      const handleReadyNavigate = () => {
        router.push(ROUTES.BOOKING.HOME)
      }

      return (
        <BookingEventCard
          key={event.model?.id}
          event={event}
          track={track}
          isSelectable
          buttonText={t('event.book_now')}
          renderTrackLink
          onReadyNavigate={handleReadyNavigate}
        />
      )
    },
    [t, router]
  )

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-event-finder"
    >
      <LocationPickerCore
        title={
          title && (
            <HeadingTag className={styles.section__title}>{title}</HeadingTag>
          )
        }
        renderEvent={renderEvent}
        className={styles['section--border-top']}
      />
    </section>
  )
}
