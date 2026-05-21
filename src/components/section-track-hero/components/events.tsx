import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import type { TrackFragment } from '../../../core/dato/fragments/track.typegen'
import type { TrackModelFragment } from '../../../core/dato/fragments/track-model.typegen'
import { getEventDataFragment } from '../../../utils/get-event-data-fragment'
import { getTrackEventToShow } from '../../../utils/get-track-event-to-show'
import { BookingEventLink } from '../../booking-event-link'
import { CoreDate } from '../../core-date'
import styles from '../style.module.scss'
import { EventsMoreButton } from './events-more-button'

type Props = {
  showEvents: boolean
  featuredEvent: TrackModelFragment['featuredEvent'] | null | undefined
  events: TrackModelFragment['events']
  sectionId: string | undefined
  track: TrackFragment | null
}

export const Events: FC<Props> = async ({
  track,
  showEvents,
  featuredEvent,
  events,
  sectionId
}) => {
  if (!showEvents) {
    return null
  }

  const t = await getTranslations('section_track_hero')

  const { eventToShow, remainingCount } = getTrackEventToShow(
    featuredEvent,
    events
  )

  if (!eventToShow?.model?.startDate) {
    return null
  }

  const eventFragment =
    eventToShow.model && track
      ? getEventDataFragment(
          eventToShow.id,
          eventToShow.model,
          track.config,
          track.model
        )
      : null

  return (
    <div className={styles.events}>
      <BookingEventLink
        event={eventFragment}
        track={track}
        setHomeTrack={true}
        layoutType="text"
      >
        <CoreDate
          start={eventToShow.model?.startDate ?? ''}
          end={eventToShow.model?.endDate ?? ''}
          monthVariant="long"
        />
      </BookingEventLink>

      {remainingCount > 0 && (
        <>
          {' + '}

          <EventsMoreButton
            className={styles.events__more}
            sectionId={sectionId}
          >
            {t('events_more', { count: remainingCount })}
          </EventsMoreButton>
        </>
      )}
    </div>
  )
}
