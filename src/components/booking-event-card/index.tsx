'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import type { FC, ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { EventDataFragment } from '../../core/dato/fragments/event-data.typegen'
import type { TrackFragment } from '../../core/dato/fragments/track.typegen'
import type { TrackDataFragment } from '../../core/dato/fragments/track-data.typegen'
import { getRecordLink } from '../../utils/get-record-link'
import { isEventPassed } from '../../utils/is-event-passed'
import { BookingEventCta } from '../booking-event-cta'
import { CoreBadge } from '../core-badge'
import { CoreCta } from '../core-cta'
import { CoreDate } from '../core-date'
import { useDialog } from '../global-dialog'
import styles from './style.module.scss'

export type BookingEventCardProps = {
  event: EventDataFragment | null
  track: TrackFragment | TrackDataFragment | null
  isSelectable?: boolean
  onReadyNavigate?: () => void
  children?: ReactNode
  className?: string
  buttonText?: string
  renderTrackLink?: boolean
}

export const BookingEventCard: FC<BookingEventCardProps> = ({
  event,
  track,
  isSelectable = false,
  onReadyNavigate,
  children,
  className,
  buttonText,
  renderTrackLink = false
}) => {
  const t = useTranslations('booking_event_card')
  const { showDialog } = useDialog()
  const { startDate, endDate, soldOut, popular } = event?.model ?? {}
  const { state, city, nickname } = track?.model ?? {}
  const title = [state, city].filter(Boolean).join('  •  ')

  const isPassed = useMemo(
    () => isEventPassed(startDate, endDate),
    [startDate, endDate]
  )

  const showPassedBadge = isPassed
  const showSoldOutBadge = !isPassed && soldOut
  const showPopularBadge = !isPassed && !soldOut && popular
  const hasBadge = showPassedBadge || showSoldOutBadge || showPopularBadge
  const trackHandle = track?.config?.handle

  const handleNotifyMe = useCallback(() => {
    const trackName = nickname ?? title ?? 'this track'
    const klaviyoFormId = process.env.NEXT_PUBLIC_KLAVIYO_NOTIFY_FORM_ID

    showDialog({
      translations: {
        title: `Notify Me - ${trackName}`,
        description: `This event has passed. Sign up to get notified via email as soon as new driving dates are scheduled for ${trackName}!`,
        confirmButton: 'Got It',
        cancelButton: 'Close',
        ...(klaviyoFormId && { klaviyoFormId })
      },
      onConfirm: () => {}
    })
  }, [nickname, title, showDialog])

  const actions = isSelectable ? (
    <>
      {isPassed ? (
        <CoreCta
          onClick={handleNotifyMe}
          layoutType="button"
          styleType="black"
          sizeType="large"
          text="Notify Me"
          className={styles.card__button}
        />
      ) : (
        <BookingEventCta
          event={event}
          track={track}
          onReadyNavigate={onReadyNavigate}
          layoutType="button"
          styleType="black"
          sizeType="large"
          text={buttonText ?? t('select')}
          className={styles.card__button}
        />
      )}
      {renderTrackLink && trackHandle && (
        <CoreCta
          href={getRecordLink({ handle: trackHandle }, 'track')}
          className={styles.card__link}
          layoutType="underline"
          styleType="black"
          sizeType="large"
          text={t('view_track')}
        />
      )}
    </>
  ) : (
    children
  )

  return (
    <div
      className={clsx(
        styles.card,
        (soldOut || isPassed) && styles['card--disabled'],
        className
      )}
    >
      <div className={styles.card__content}>
        {title && <h3 className={styles.card__title}>{title}</h3>}

        {nickname && <p className={styles.card__nickname}>{nickname}</p>}

        {startDate && (
          <div className={styles.card__date}>
            <span className={styles.card__dateLabel}>{t('date_label')}</span>
            <CoreDate
              start={startDate}
              end={endDate ?? undefined}
              monthVariant="short"
            />
          </div>
        )}

        {hasBadge && (
          <div className={styles.card__badges}>
            {showPassedBadge && (
              <CoreBadge
                label="Event Passed"
                backgroundColor="#555555"
                color="#ffffff"
              />
            )}
            {showSoldOutBadge && (
              <CoreBadge
                label={t('badge.sold_out')}
                backgroundColor="#000000"
                color="#ffffff"
              />
            )}
            {showPopularBadge && (
              <CoreBadge
                label={t('badge.popular')}
                backgroundColor="#000000"
                color="#ffffff"
              />
            )}
          </div>
        )}
      </div>

      {actions && <div className={styles.card__actions}>{actions}</div>}
    </div>
  )
}
