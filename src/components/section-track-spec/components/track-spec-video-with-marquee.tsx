'use client'

import { useTranslations } from 'next-intl'
import { type FC, useId, useMemo, useState } from 'react'
import { useVideoActions } from '../../../core/video/use-video'
import { CoreIcon } from '../../core-icon'
import { CoreMarquee } from '../../core-marquee'
import { CoreVideo } from '../../core-video'
import type { CoreVideoFragment } from '../../core-video/core-video.typegen'
import { CoreVideoControls } from '../../core-video-controls'
import styles from '../style.module.scss'

export type TrackSpecVideoWithMarqueeProps = {
  data: CoreVideoFragment
  uniqueVideoId?: string
}

export const TrackSpecVideoWithMarquee: FC<TrackSpecVideoWithMarqueeProps> = ({
  data,
  uniqueVideoId: providedVideoId
}) => {
  const t = useTranslations('section_track_spec')
  const generatedVideoId = useId()
  const uniqueVideoId = providedVideoId || generatedVideoId
  const [isMarqueeVisible, setIsMarqueeVisible] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const { play } = useVideoActions(uniqueVideoId)

  const marqueeElements = useMemo(
    () => [
      t('marquee.text'),
      <CoreIcon key="circle-play" icon="circle-play" />
    ],
    [t]
  )

  const handleVideoContainerClick = () => {
    setIsMarqueeVisible(false)
    setShowControls(true)
    play()
  }

  return (
    <div className={styles.media__video}>
      <CoreVideo
        data={data}
        uniqueVideoId={uniqueVideoId}
        hasOutsideControls={true}
        layout="fill"
      />

      {showControls && data.controls && (
        <CoreVideoControls
          uniqueVideoId={uniqueVideoId}
          className={styles.media__controls}
        />
      )}

      {isMarqueeVisible && (
        <div
          className={styles.media__video__overlay}
          onClick={handleVideoContainerClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleVideoContainerClick()
            }
          }}
          aria-label="Play video"
        >
          <CoreMarquee
            data={{
              elements: marqueeElements
            }}
            containerClass={styles.marquee}
            innerClass={styles.marquee__inner}
          />
        </div>
      )}
    </div>
  )
}
