'use client'

import { type FC, useId } from 'react'
import { CoreVideo } from '../../core-video'
import type { CoreVideoFragment } from '../../core-video/core-video.typegen'
import { CoreVideoControls } from '../../core-video-controls'
import styles from '../style.module.scss'

export type TrackSpecVideoProps = {
  data: CoreVideoFragment
  uniqueVideoId?: string
}

export const TrackSpecVideo: FC<TrackSpecVideoProps> = ({
  data,
  uniqueVideoId: providedVideoId
}) => {
  const generatedVideoId = useId()
  const uniqueVideoId = providedVideoId || generatedVideoId

  return (
    <div className={styles.media__video}>
      <CoreVideo
        data={data}
        uniqueVideoId={uniqueVideoId}
        hasOutsideControls={true}
        layout="fill"
      />
      {data.controls && (
        <CoreVideoControls
          uniqueVideoId={uniqueVideoId}
          className={styles.media__controls}
        />
      )}
    </div>
  )
}
