'use client'

import { useTranslations } from 'next-intl'
import { type FC, useEffect, useState } from 'react'
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
  const videoElement = useVideo(uniqueVideoId, (s) => s.videoElement)
  const { play, setMuted, setUserInteracted } = useVideoActions(uniqueVideoId)

  const [isWaitingToPlay, setIsWaitingToPlay] = useState(false)
  const isPlaying = status === 'playing'

  // Auto-play when videoElement is initialized and we are waiting
  useEffect(() => {
    if (isWaitingToPlay && videoElement) {
      setIsWaitingToPlay(false)
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
    }
  }, [isWaitingToPlay, videoElement, play, setMuted])

  const handleClick = () => {
    setUserInteracted(true)

    const { videoElement: latestVideoElement } = getVideoStore(uniqueVideoId).getState()

    if (isPlaying) {
      const newMuted = !isMuted
      if (latestVideoElement) {
        latestVideoElement.muted = newMuted
        if (!newMuted) {
          latestVideoElement.play().catch(() => {})
        }
      }
      setMuted(newMuted)
      return
    }

    if (latestVideoElement) {
      latestVideoElement.muted = false
      latestVideoElement
        .play()
        .then(() => {
          setMuted(false)
          play()
        })
        .catch(() => {
          latestVideoElement.muted = true
          latestVideoElement
            .play()
            .then(() => {
              setMuted(true)
              play()
            })
            .catch(() => {})
        })
    } else {
      setIsWaitingToPlay(true)
    }
  }

  const text = isWaitingToPlay
    ? 'Loading Engine Sound...'
    : !isPlaying
      ? t('button_text_play')
      : isMuted
        ? t('button_text_mute')
        : t('button_text_unmute')

  const icon = isWaitingToPlay
    ? 'play'
    : !isPlaying
      ? 'play'
      : isMuted
        ? 'mute'
        : 'sound-on'

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
