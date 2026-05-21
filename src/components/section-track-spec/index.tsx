import clsx from 'clsx'
import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import type { TrackFragment } from '../../core/dato/fragments/track.typegen'
import type { TrackModelFragment } from '../../core/dato/fragments/track-model.typegen'
import { getSectionId } from '../../core/string/get-section-id'
import { isImage, isNotEmpty, isVideo } from '../../core/typescript/guards'
import { getEventDataFragment } from '../../utils/get-event-data-fragment'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { BookingEventLink } from '../booking-event-link'
import { CoreBadge } from '../core-badge'
import { CoreCta } from '../core-cta'
import { CoreDate } from '../core-date'
import { CoreIcon } from '../core-icon'
import { CoreImage } from '../core-image'
import { CoreSVGImage } from '../core-svg-upload'
import { CoreTextMarkdown } from '../core-text-markdown'
import { TrackSpecVideo } from './components/track-spec-video'
import type { SectionTrackSpecFragment } from './section-track-spec.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionTrackSpecFragment
  model: TrackModelFragment | null
  track: TrackFragment | null
  isFirstSection?: boolean
}

export const SectionTrackSpec: FC<Props> = async ({
  data,
  model,
  track,
  isFirstSection
}) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const t = await getTranslations('section_track_spec')
  const { id, ctas, config } = data
  const {
    description,
    specMedia,
    specTitle,
    address,
    lapLength,
    numberOfLaps,
    elevationChange,
    longestStraight,
    numberOfTurns,
    trackSvgDark,
    events,
    notifyMeCta,
    featuredEvent
  } = model ?? {}

  // Filter enabled events with valid dates
  const enabledEvents = (events ?? []).filter((event) => event.model?.enabled)
  const eventsWithDates = enabledEvents.filter(
    (event) => event.model?.startDate != null
  )

  // Sort events by start date (soonest first)
  const sortedEvents = [...eventsWithDates].sort((a, b) => {
    const start = a.model?.startDate
    const end = b.model?.startDate

    if (!start) {
      return 1
    }
    if (!end) {
      return -1
    }

    return new Date(start).getTime() - new Date(end).getTime()
  })

  // Check if featured event exists and has valid date
  const hasValidFeaturedEvent =
    featuredEvent?.model?.enabled && featuredEvent.model?.startDate != null

  // Build final events list: featured event first (if valid), then sorted events
  const eventsToShow = hasValidFeaturedEvent
    ? [
        featuredEvent,
        ...sortedEvents.filter((event) => event.id !== featuredEvent.id)
      ]
    : sortedEvents

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-track-spec"
    >
      <div className={styles.grid}>
        <div className={styles.content}>
          {specTitle && (
            <HeadingTag className={styles.title}>{specTitle}</HeadingTag>
          )}

          {description && (
            <div className={styles.description}>
              <CoreTextMarkdown type="rte">{description}</CoreTextMarkdown>
            </div>
          )}

          {address && (
            <p className={styles.address}>
              <span className={styles.address__icon} aria-hidden="true">
                <CoreIcon icon="location-solid" />
              </span>

              <span className={styles.address__text}>{address}</span>
            </p>
          )}

          {ctas && ctas.length > 0 && (
            <div className={styles.ctas}>
              {ctas.map((cta) => (
                <CoreCta key={cta.id} data={cta} />
              ))}
            </div>
          )}
        </div>

        {eventsToShow && eventsToShow.length > 0 && (
          <div className={styles.events}>
            <p className={styles.events__title}>
              <span
                className={clsx(styles.events__title__icon, styles.desktop)}
                aria-hidden="true"
              >
                <CoreIcon icon="calendar" />
              </span>

              {t('events.title')}
            </p>

            <ul className={styles.events__list}>
              {eventsToShow.map((event) => {
                const eventFragment =
                  event.model && track
                    ? getEventDataFragment(
                        event.id,
                        event.model,
                        track.config,
                        track.model
                      )
                    : null

                return (
                  <li key={event.id} className={styles.events__item}>
                    <BookingEventLink
                      event={eventFragment}
                      track={track ?? null}
                      setHomeTrack={true}
                      layoutType="text"
                      text={event.model?.title}
                      styleType="black"
                      className={clsx(
                        styles.events__cta,
                        event.model?.soldOut && styles[`events__cta--sold-out`]
                      )}
                    >
                      <CoreDate
                        start={event.model?.startDate ?? ''}
                        end={event.model?.endDate ?? undefined}
                        monthVariant="short"
                      />

                      <span className={styles.events__item__inner}>
                        {event.model?.soldOut ? (
                          <CoreBadge
                            label={t('events.badge')}
                            backgroundColor={'oklch(0.232 0.004 264.4 / 0.1)'}
                            color={'oklch(0 0 0)'}
                          />
                        ) : (
                          <CoreCta
                            inert={true}
                            text={t('events.book_now')}
                            layoutType="button"
                            styleType="orange"
                            sizeType="small"
                          />
                        )}
                      </span>
                    </BookingEventLink>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {eventsToShow.length === 0 && notifyMeCta && (
          <div className={styles.events}>
            <div className={styles.notifyMe}>
              <CoreCta data={notifyMeCta} />
            </div>
          </div>
        )}

        {trackSvgDark && (
          <div className={clsx(styles.map, styles.mobile)}>
            <CoreSVGImage data={trackSvgDark} />
          </div>
        )}

        <div className={styles.media}>
          {specMedia && isVideo(specMedia) && (
            <TrackSpecVideo data={specMedia} />
          )}

          {specMedia && isImage(specMedia) && (
            <CoreImage data={specMedia} layout="fill" />
          )}
        </div>

        <div className={styles.specifications}>
          <ul className={styles.specifications__list}>
            {isNotEmpty(lapLength) && (
              <li className={styles.specification}>
                <span className={styles.specification__label}>
                  {t('specifications.lap_length')}
                </span>
                <strong className={styles.specification__value}>
                  {lapLength}
                </strong>
              </li>
            )}
            {isNotEmpty(numberOfLaps) && (
              <li className={styles.specification}>
                <span className={styles.specification__label}>
                  {t('specifications.number_of_laps')}
                </span>
                <strong className={styles.specification__value}>
                  {numberOfLaps}
                </strong>
              </li>
            )}
            {isNotEmpty(elevationChange) && (
              <li className={styles.specification}>
                <span className={styles.specification__label}>
                  {t('specifications.elevation_change')}
                </span>
                <strong className={styles.specification__value}>
                  {elevationChange}
                </strong>
              </li>
            )}
            {isNotEmpty(longestStraight) && (
              <li className={styles.specification}>
                <span className={styles.specification__label}>
                  {t('specifications.longest_straight')}
                </span>
                <strong className={styles.specification__value}>
                  {longestStraight}
                </strong>
              </li>
            )}
            {isNotEmpty(numberOfTurns) && (
              <li className={styles.specification}>
                <span className={styles.specification__label}>
                  {t('specifications.number_of_turns')}
                </span>
                <strong className={styles.specification__value}>
                  {numberOfTurns}
                </strong>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}
