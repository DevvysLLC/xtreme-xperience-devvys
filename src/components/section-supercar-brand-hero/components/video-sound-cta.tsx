'use client'

import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { CoreCta } from '../../../components/core-cta'
import {
  getVideoStore,
  useVideo,
  useVideoActions
} from '../../../core/video/use-video'

type Props = {
  uniqueVideoId: string
}

export const VideoSoundCta: FC<Props> = ({ uniqueVideoId }) => {
  const t = useTranslations('section_supercar_brand_hero')
  const status = useVideo(uniqueVideoId, (s) => s.status)
  const isMuted = useVideo(uniqueVideoId, (s) => s.muted)
  const { play, setMuted, setUserInteracted } = useVideoActions(uniqueVideoId)

  const isPlaying = status === 'playing'

  const handleClick = () => {
    setUserInteracted(true)

    const { videoElement } = getVideoStore(uniqueVideoId).getState()

    if (isPlaying) {
      const newMuted = !isMuted
      if (videoElement) {
        videoElement.muted = newMuted
        if (!newMuted) {
          videoElement.play().catch(() => {})
        }
      }
      setMuted(newMuted)
      return
    }

    if (videoElement) {
      videoElement.muted = false
      videoElement
        .play()
        .then(() => {
          setMuted(false)
          play()
        })
        .catch(() => {
          videoElement.muted = true
          videoElement
            .play()
            .then(() => {
              setMuted(true)
              play()
            })
            .catch(() => {})
        })
    } else {
      play()
      setMuted(false)
    }
  }

  const text = !isPlaying
    ? t('button_text_play')
    : isMuted
      ? t('button_text_mute')
      : t('button_text_unmute')

  const icon = !isPlaying ? 'play' : isMuted ? 'mute' : 'sound-on'

  return (
    <CoreCta
      href={null}
      text={text}
      styleType="white-transparent"
      sizeType="large"
      icon={icon}
      iconPosition="left"
      onClick={handleClick}
      ariaLabel={text}
    />
  )
}
