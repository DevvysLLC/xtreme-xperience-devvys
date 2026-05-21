'use client'

import { type FC, useEffect, useRef, useState } from 'react'
import type { VideoFragment } from '../../core/dato/fragments/video.typegen'
import styles from './style.module.scss'

type Props = {
  video: VideoFragment['video'] | null
  desktopVideo?: VideoFragment['video'] | null
  videoRawMp4FileUrl?: string | null
  desktopVideoRawMp4FileUrl?: string | null
  isDesktop: boolean
  autoplay: boolean
  loop: boolean
  onVisibleChange?: (isVisible: boolean) => void
}

type Mp4Variant = 'mp4High' | 'mp4Medium' | 'mp4Low' | 'none'

type Mp4Selection = {
  variant: Mp4Variant
  url: string | null
}

const isValidVideoUrl = (value: string | null | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0

const selectMp4Source = (
  effectiveVideo: VideoFragment['video'] | null | undefined,
  isDesktop: boolean,
  videoRawMp4FileUrl?: string | null,
  desktopVideoRawMp4FileUrl?: string | null
): Mp4Selection => {
  if (isDesktop && isValidVideoUrl(desktopVideoRawMp4FileUrl)) {
    return { variant: 'mp4High', url: desktopVideoRawMp4FileUrl }
  }
  if (isDesktop && isValidVideoUrl(videoRawMp4FileUrl)) {
    return { variant: 'mp4High', url: videoRawMp4FileUrl }
  }
  if (!isDesktop && isValidVideoUrl(videoRawMp4FileUrl)) {
    return { variant: 'mp4Medium', url: videoRawMp4FileUrl }
  }

  const candidates: Array<{
    variant: Exclude<Mp4Variant, 'none'>
    url: string | null | undefined
  }> = isDesktop
    ? [
        { variant: 'mp4High', url: effectiveVideo?.mp4High },
        { variant: 'mp4Medium', url: effectiveVideo?.mp4Medium },
        { variant: 'mp4Low', url: effectiveVideo?.mp4Low }
      ]
    : [
        { variant: 'mp4Medium', url: effectiveVideo?.mp4Medium },
        { variant: 'mp4Low', url: effectiveVideo?.mp4Low },
        { variant: 'mp4High', url: effectiveVideo?.mp4High }
      ]

  const match = candidates.find((candidate) => isValidVideoUrl(candidate.url))
  if (!match) {
    return { variant: 'none', url: null }
  }

  return { variant: match.variant, url: match.url ?? null }
}

export const VideoLayerMp4: FC<Props> = ({
  video,
  desktopVideo,
  videoRawMp4FileUrl,
  desktopVideoRawMp4FileUrl,
  isDesktop,
  autoplay,
  loop,
  onVisibleChange
}) => {
  const effectiveVideo =
    isDesktop && desktopVideo != null ? desktopVideo : video
  const { variant: selectedMp4Variant, url: mp4Url } = selectMp4Source(
    effectiveVideo,
    isDesktop,
    videoRawMp4FileUrl,
    desktopVideoRawMp4FileUrl
  )
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const onVisibleChangeRef = useRef<Props['onVisibleChange']>(onVisibleChange)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    onVisibleChangeRef.current = onVisibleChange
  }, [onVisibleChange])

  useEffect(() => {
    const videoElement = videoRef.current
    if (videoElement == null) {
      return
    }

    let cancelled = false
    let playPromise: Promise<void> | null = null

    const setVisible = (next: boolean): void => {
      setIsVisible(next)
      onVisibleChangeRef.current?.(next)
    }

    const cleanup = (): void => {
      playPromise = null
      videoElement.pause()
      videoElement.removeAttribute('src')
      videoElement.load()
      setVisible(false)
    }

    const onPlaying = (): void => {
      setVisible(true)
    }

    const onLoadedData = (): void => {
      setVisible(true)
    }

    videoElement.addEventListener('playing', onPlaying)
    videoElement.addEventListener('loadeddata', onLoadedData)

    cleanup()
    if (mp4Url != null) {
      videoElement.src = mp4Url
      videoElement.load()

      if (autoplay && !cancelled && playPromise == null) {
        playPromise = videoElement
          .play()
          .then(() => undefined)
          .catch(() => undefined)
      }
    }

    return () => {
      cancelled = true
      videoElement.removeEventListener('playing', onPlaying)
      videoElement.removeEventListener('loadeddata', onLoadedData)
      cleanup()
    }
  }, [selectedMp4Variant, mp4Url, autoplay])

  return (
    <video
      ref={videoRef}
      className={styles.video}
      autoPlay={autoplay}
      loop={loop}
      muted
      playsInline
      preload="none"
      controls={false}
      width={effectiveVideo?.width ?? undefined}
      height={effectiveVideo?.height ?? undefined}
      style={isVisible ? undefined : { display: 'none' }}
    />
  )
}
