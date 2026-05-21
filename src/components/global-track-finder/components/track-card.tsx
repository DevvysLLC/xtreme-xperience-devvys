'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { ROUTES } from '../../../config/routes'
import type { TrackDataFragment } from '../../../core/dato/fragments/track-data.typegen'
import { logger } from '../../../core/logger/logger'
import { DRAWER_REQUEST_CLOSE_MESSAGE_NAME } from '../../../core/messaging/main/messages/close-drawer'
import { useMainBus } from '../../../core/messaging/main/react'
import { useLocation, useLocationSetTrack } from '../../../features/location'
import { useTrackNextEvent } from '../../../features/tracks'
import { getEventDataFragment } from '../../../utils/get-event-data-fragment'
import { BookingEventCta } from '../../booking-event-cta'
import { BookingEventLink } from '../../booking-event-link'
import { CoreBadge } from '../../core-badge'
import { CoreCta } from '../../core-cta'
import { CoreDate } from '../../core-date'
import { useTrackFinderDrawer } from '../context/drawer-context'
import styles from '../style.module.scss'

type TrackCardProps = {
  data: TrackDataFragment
  isNearestTrack?: boolean
}

export const TrackCard: FC<TrackCardProps> = ({ data, isNearestTrack }) => {
  const t = useTranslations('track_finder.track_card')
  const { model, config } = data
  const { data: location } = useLocation()
  const router = useRouter()
  const { nextEvent, remainingCount } = useTrackNextEvent(data)
  const setSelectedTrack = useLocationSetTrack()
  const { setSearchQuery } = useTrackFinderDrawer()
  const bus = useMainBus(DRAWER_REQUEST_CLOSE_MESSAGE_NAME, () => {})
  const badges = model?.badges ?? []
  const isHomeTrack = data?.id === location?.track?.id
  const hasBadges = badges.length > 0 || isNearestTrack || isHomeTrack
  const trackUrl = `${ROUTES.FRONTEND.TRACKS.LISTING}/${config?.handle}`
  if (!model) {
    return null
  }

  const handleSetAsHomeTrack = async () => {
    try {
      await setSelectedTrack.mutateAsync(data)
      if (model.city) {
        setSearchQuery(model.city)
      }
      router.push(trackUrl)
      bus.send({
        name: DRAWER_REQUEST_CLOSE_MESSAGE_NAME,
        details: { id: 'track-finder-drawer' }
      })
    } catch (error) {
      logger.error(
        { error, track: data },
        'track-card.handleSetAsHomeTrack.error'
      )
    }
  }

  return (
    <div className={styles.trackCard}>
      {hasBadges && (
        <div className={styles.trackCard__badges}>
          {isHomeTrack && (
            <CoreBadge
              backgroundColor="#f5f5f5"
              color="#000000"
              label={t('home_track')}
            />
          )}
          {!isHomeTrack && isNearestTrack && (
            <CoreBadge
              backgroundColor="#f5f5f5"
              color="#000000"
              label={t('nearest')}
            />
          )}
          {!isHomeTrack &&
            badges.map((badge) => <CoreBadge key={badge.id} data={badge} />)}
        </div>
      )}
      <h4 className={styles.trackCard__title}>
        {model.state} • {model.city}
      </h4>
      {(model.address || nextEvent) && (
        <div className={styles.trackCard__details}>
          {model.address && (
            <p className={styles.trackCard__address}>{model.address}</p>
          )}
          {nextEvent?.model?.startDate && (
            <div className={styles.trackCard__events}>
              <BookingEventCta
                event={getEventDataFragment(
                  nextEvent.id,
                  nextEvent.model,
                  data.config,
                  data.model
                )}
                track={data}
                layoutType="text"
              >
                <span>{t('next_event')}</span>
                <CoreDate
                  start={nextEvent.model.startDate}
                  end={nextEvent.model.endDate ?? undefined}
                  monthVariant="short"
                />
                {remainingCount > 0 && (
                  <span>
                    {' '}
                    {t('remaining_count', { count: remainingCount })}
                  </span>
                )}
              </BookingEventCta>
            </div>
          )}
        </div>
      )}
      <div className={styles.trackCard__actions}>
        <BookingEventLink
          track={data}
          event={
            nextEvent?.model
              ? getEventDataFragment(
                  nextEvent.id,
                  nextEvent.model,
                  data.config,
                  data.model
                )
              : null
          }
          setHomeTrack={true}
          text={t('book_now')}
          layoutType="button"
          styleType="black"
          sizeType="small"
          className={styles.trackCard__button}
        />
        <CoreCta
          text={t('view_track')}
          layoutType="underline"
          styleType="black"
          sizeType="small"
          className={styles.trackCard__underline}
          onClick={handleSetAsHomeTrack}
        />
      </div>
    </div>
  )
}
