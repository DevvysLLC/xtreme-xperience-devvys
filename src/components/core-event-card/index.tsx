'use client'

import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { useCallback, useId } from 'react'
import { isImage, isVideo } from '../../core/typescript/guards'
import { useVideo, useVideoActions } from '../../core/video/use-video'
import { getRecordLink } from '../../utils/get-record-link'
import { CoreBadge } from '../core-badge'
import { CoreCta } from '../core-cta'
import { CoreDate } from '../core-date'
import { CoreGradient } from '../core-gradient'
import { CoreImage } from '../core-image'
import { CoreVideo } from '../core-video'
import type { CoreEventCardFragment } from './core-event-card.typegen'
import styles from './style.module.scss'

export type CoreEventCardProps = {
  data: CoreEventCardFragment
  isNearestTrack?: boolean
  mode?: string | null
}

export const CoreEventCard: FC<CoreEventCardProps> = ({
  data,
  isNearestTrack,
  mode
}) => {
  const t = useTranslations('core_event_card')
  const { model } = data
  const enabled = model?.enabled
  const gradient = model?.gradient
  const media = model?.media
  const title = model?.title
  const startDate = model?.startDate
  const endDate = model?.endDate
  const track = model?.track
  const trackSvg = track?.model?.trackSvg
  const trackNickname = track?.model?.nickname
  const trackConfig = track?.config

  const videoId = useId()
  const { play, pause, setMuted } = useVideoActions(videoId)
  const userInteracted = useVideo(videoId, (s) => s.userInteracted)
  const trackLink = trackConfig ? getRecordLink(trackConfig, 'track') : null

  const handleMouseEnter = useCallback(() => {
    if (isVideo(media) && !media.autoplay && !userInteracted) {
      setMuted(true)
      play()
    }
  }, [media, userInteracted, setMuted, play])

  const handleMouseLeave = useCallback(() => {
    if (isVideo(media) && !media.autoplay && !userInteracted) {
      setMuted(false)
      pause()
    }
  }, [media, userInteracted, setMuted, pause])

  if (!enabled) {
    return null
  }

  return (
    <div
      className={styles.card}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.card__media}>
        {isNearestTrack && (
          <CoreBadge
            className={styles.card__badge}
            backgroundColor="#f5f5f5"
            color="#000000"
            label={t('badge.nearest')}
          />
        )}

        {media ? (
          <>
            {isVideo(media) && (
              <CoreVideo
                data={media}
                layout="fill"
                uniqueVideoId={videoId}
                controlsClassName={styles.card__media__controls}
              />
            )}
            {isImage(media) && <CoreImage data={media} layout="fill" />}
          </>
        ) : (
          <CoreImage
            withFallback={true}
            data={{
              id: `fallback-image-${model?.id ?? 'unknown'}`,
              image: {
                format: 'png',
                url: '/images/fallback.png',
                width: 600,
                height: 600,
                alt: null,
                title: null,
                focalPoint: null,
                responsiveImage: null
              },
              desktopImage: null
            }}
            layout={'fill'}
            objectFit={'cover'}
          />
        )}

        {gradient && <CoreGradient data={gradient} />}

        {trackSvg && (
          <div className={styles.card__track}>
            <CoreImage
              data={{ id: trackSvg.id, image: trackSvg, desktopImage: null }}
            />
          </div>
        )}
      </div>

      <CoreCta
        href={trackLink ?? undefined}
        layoutType="transparent"
        text={t('view_track')}
        tabIndex={-1}
      />

      {trackNickname && (
        <p className={styles.card__subtitle}>{trackNickname}</p>
      )}

      {title && <h3 className={styles.card__title}>{title}</h3>}

      {startDate && (
        <div className={styles.card__date}>
          <CoreDate
            start={startDate}
            end={endDate ?? undefined}
            monthVariant="short"
          />
        </div>
      )}

      <div className={styles.card__cta}>
        <CoreCta
          href={trackLink ?? undefined}
          layoutType="underline"
          styleType={mode === 'black' ? 'white' : 'black'}
          sizeType="small"
          text={t('view_track')}
        />
      </div>
    </div>
  )
}
