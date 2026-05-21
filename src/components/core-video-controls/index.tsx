'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { useVideo, useVideoActions } from '../../core/video/use-video'
import { PauseIcon } from './icons/pause'
import { PlayIcon } from './icons/play'
import { SoundOffIcon } from './icons/sound-off'
import { SoundOnIcon } from './icons/sound-on'
import styles from './style.module.scss'

type Props = {
  uniqueVideoId: string
  className?: string
}

export const CoreVideoControls: FC<Props> = ({ uniqueVideoId, className }) => {
  const status = useVideo(uniqueVideoId, (s) => s.status)
  const isMuted = useVideo(uniqueVideoId, (s) => s.muted)
  const { play, pause, setMuted, setUserInteracted } =
    useVideoActions(uniqueVideoId)
  const t = useTranslations('core_video_controls')

  const onPlayPause = () => {
    setUserInteracted(true)
    if (status === 'playing') {
      pause()
    } else {
      play()
    }
  }

  const onToggleMute = () => {
    setUserInteracted(true)
    setMuted(!isMuted)
  }

  return (
    <div className={clsx(styles.controls, className)}>
      <button
        type="button"
        className={styles.control}
        onClick={onPlayPause}
        aria-label={status === 'playing' ? t('aria.pause') : t('aria.play')}
      >
        {status === 'playing' ? <PauseIcon /> : <PlayIcon />}
      </button>

      <button
        type="button"
        className={styles.control}
        onClick={onToggleMute}
        aria-label={isMuted ? t('aria.sound_on') : t('aria.sound_off')}
      >
        {isMuted ? <SoundOffIcon /> : <SoundOnIcon />}
      </button>
    </div>
  )
}
