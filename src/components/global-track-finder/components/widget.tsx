'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { type FC, useCallback, useMemo } from 'react'
import { DRAWER_REQUEST_OPEN_MESSAGE_NAME } from '../../../core/messaging/main/messages/open-drawer'
import { useMainBus } from '../../../core/messaging/main/react'
import { useLocation } from '../../../features/location'
import { useTrackNextEvent } from '../../../features/tracks'
import { BookingEventLink } from '../../booking-event-link'
import { CoreCta } from '../../core-cta'
import { CoreDate } from '../../core-date'
import { CoreIcon } from '../../core-icon'
import styles from '../style.module.scss'

type GlobalTrackFinderWidgetProps = {
  layout?: 'sticky-bar' | 'navigation-mobile-drawer' | 'default'
}

const noop = () => {}

export const GlobalTrackFinderWidget: FC<GlobalTrackFinderWidgetProps> = ({
  layout = 'default'
}) => {
  const t = useTranslations('track_finder.widget')
  const { data: location } = useLocation()
  const bus = useMainBus(DRAWER_REQUEST_OPEN_MESSAGE_NAME, noop)
  const { nextEvent, remainingCount } = useTrackNextEvent(
    location?.track ?? null
  )
  const nextEventDate = nextEvent?.model?.startDate
  const nextEventEndDate = nextEvent?.model?.endDate

  const handleOpenDrawer = useCallback(() => {
    bus.send({
      name: DRAWER_REQUEST_OPEN_MESSAGE_NAME,
      details: { id: 'track-finder-drawer' }
    })
  }, [bus])

  const { displayLabel, hasLocation, trackUrl } = useMemo(() => {
    const label =
      location?.track?.model?.state && location?.track?.model?.city
        ? `${location.track.model.state} • ${location.track.model.city}`
        : t('fallback')
    const has = !!location?.track
    const url = location?.track?.config?.handle
      ? `/tracks/${location.track.config.handle}`
      : null
    return { displayLabel: label, hasLocation: has, trackUrl: url }
  }, [location?.track, t])

  return (
    <section
      className={clsx(
        styles.widget,
        layout === 'sticky-bar' && styles['widget--stickyBar'],
        layout === 'navigation-mobile-drawer' &&
          styles['widget--navigationMobileDrawer']
      )}
      aria-label={t('aria.widget_label')}
    >
      <div className={styles.dropdown__wrapper}>
        <button
          type="button"
          className={styles.dropdown}
          onClick={handleOpenDrawer}
        >
          <span className={styles.dropdown__text}>
            <span className={styles.dropdown__text__primary}>
              {displayLabel}
            </span>
            {nextEvent && nextEventDate && (
              <span className={styles.dropdown__text__secondary}>
                <CoreDate
                  start={nextEventDate}
                  end={nextEventEndDate ?? undefined}
                  monthVariant="short"
                />
                {remainingCount > 0 && (
                  <span className={styles.dropdown__text__count}>
                    {t('remaining_count', { count: remainingCount })}
                  </span>
                )}
              </span>
            )}
          </span>
          <span className={styles.dropdown__icon} aria-hidden="true">
            <CoreIcon icon="chevron-down-light" />
          </span>
        </button>
        {hasLocation && trackUrl && nextEvent ? (
          <BookingEventLink
            event={nextEvent}
            track={location?.track ?? null}
            setHomeTrack={true}
            text={t('book_now')}
            className={styles.widget__button}
            layoutType="button"
            styleType={
              layout === 'sticky-bar' || layout === 'navigation-mobile-drawer'
                ? 'black'
                : 'orange'
            }
            sizeType="small"
          />
        ) : (
          <CoreCta
            text={t('book_now')}
            className={styles.widget__button}
            onClick={handleOpenDrawer}
            layoutType="button"
            styleType={
              layout === 'sticky-bar' || layout === 'navigation-mobile-drawer'
                ? 'black'
                : 'orange'
            }
            sizeType="small"
          />
        )}
      </div>
      {hasLocation && trackUrl && layout === 'default' && (
        <CoreCta
          text={t('view_track')}
          href={trackUrl}
          layoutType="underline"
          styleType="current"
          sizeType="small"
        />
      )}
    </section>
  )
}
