'use client'
import clsx from 'clsx'
import { type FC, memo, useCallback, useId, useMemo } from 'react'
import { isImage, isVideo } from '../../core/typescript/guards'
import { useVideo, useVideoActions } from '../../core/video/use-video'
import { CoreCta } from '../core-cta'
import { CoreGradient } from '../core-gradient'
import { CoreImage } from '../core-image'
import { CoreVideo } from '../core-video'
import type { CoreMediaCardFragment } from './core-media-card.typegen'
import styles from './style.module.scss'

export type Props = {
  data: CoreMediaCardFragment
  className?: string
}

const CoreMediaCardComponent: FC<Props> = ({ data, className }) => {
  const { media, title, subtitle, highlight, cta, gradient } = data
  const videoId = useId()
  const isMediaVideo = useMemo(() => media && isVideo(media), [media])
  const isMediaImage = useMemo(() => media && isImage(media), [media])
  const { play, pause, setMuted } = useVideoActions(videoId)
  const userInteracted = useVideo(videoId, (s) => s.userInteracted)
  const ctaTextOverride = cta?.seoTitle ?? cta?.title ?? null

  const handleMouseEnter = useCallback(() => {
    if (
      isMediaVideo &&
      media &&
      isVideo(media) &&
      !media.autoplay &&
      !userInteracted
    ) {
      setMuted(true)
      play()
    }
  }, [isMediaVideo, media, userInteracted, setMuted, play])

  const handleMouseLeave = useCallback(() => {
    if (
      isMediaVideo &&
      media &&
      isVideo(media) &&
      !media.autoplay &&
      !userInteracted
    ) {
      setMuted(false)
      pause()
    }
  }, [isMediaVideo, media, userInteracted, setMuted, pause])

  return (
    <article
      className={clsx(styles.card, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {cta && (
        <CoreCta
          data={cta}
          className={styles.card__cta}
          layoutType="transparent"
          text={ctaTextOverride}
        />
      )}

      <div className={styles.card__media}>
        {isMediaVideo && media && isVideo(media) && (
          <CoreVideo data={media} layout={'fill'} uniqueVideoId={videoId} />
        )}

        {isMediaImage && media && isImage(media) && (
          <CoreImage data={media} layout={'fill'} />
        )}

        {gradient && <CoreGradient data={gradient} />}
      </div>

      <div className={styles.card__content}>
        {title && <h3 className={styles.card__title}>{title}</h3>}

        {subtitle && <p className={styles.card__subtitle}>{subtitle}</p>}
      </div>

      {highlight || cta ? (
        <div className={styles.card__actions}>
          <div>
            {highlight && <p className={styles.card__highlight}>{highlight}</p>}
          </div>

          {cta && (
            <div className={styles.card__actions__cta}>
              <CoreCta data={cta} styleType="white" href={null} tabIndex={-1} />
            </div>
          )}
        </div>
      ) : null}
    </article>
  )
}

export const CoreMediaCard = memo(CoreMediaCardComponent)
