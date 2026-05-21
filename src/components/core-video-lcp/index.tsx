'use client'

import clsx from 'clsx'
import { type FC, useId, useRef } from 'react'
import { HERO_VIDEO_DEFAULT_POSTER_SIZES } from '../../config/media'
import type { VideoFragment } from '../../core/dato/fragments/video.typegen'
import { useMediaQuery } from '../../core/viewport/use-media-query'
import { PosterLayer } from './poster-layer'
import styles from './style.module.scss'
import { VideoLayerMp4 } from './video-layer-mp4'
import { VideoLayer } from './video-layer-stream'

type VideoAsset = {
  video: VideoFragment['video'] | null
}

type LcpVideoData = {
  video: VideoAsset | null
  desktopVideo?: VideoAsset | null
  videoRawMp4FileUrl?: string | null
  desktopVideoRawMp4FileUrl?: string | null
  autoplay: boolean
  loop: boolean
}

export type ServerPosterUrls = {
  mobile: string
  desktop?: string
  alt?: string | null
}

export type Props = {
  data: LcpVideoData
  uniqueVideoId?: string
  hasOutsideControls?: boolean
  className?: string
  layout?: 'fill' | 'block' | undefined
  controlsClassName?: string
  serverPosterUrls?: ServerPosterUrls | null
  disablePoster?: boolean
  posterSizes?: string | null
}

enum VideoRender {
  Mp4 = 'mp4',
  Stream = 'stream'
}

const VIDEO_RENDER: VideoRender = VideoRender.Mp4

export const CoreVideoLcp: FC<Props> = ({
  data,
  className,
  layout,
  uniqueVideoId,
  serverPosterUrls,
  disablePoster,
  posterSizes
}) => {
  const { video, desktopVideo } = data
  const reactId = useId()
  const effectiveVideoId = uniqueVideoId ?? `video-lcp-${reactId}`
  const heroIsDesktopRef = useRef<boolean | null>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  if (heroIsDesktopRef.current == null && typeof window !== 'undefined') {
    heroIsDesktopRef.current = window.matchMedia('(min-width: 1024px)').matches
  }

  const effectiveIsDesktop =
    heroIsDesktopRef.current != null
      ? heroIsDesktopRef.current
      : isDesktop === true

  const effectivePosterSizes = posterSizes ?? HERO_VIDEO_DEFAULT_POSTER_SIZES
  if (
    video?.video == null &&
    desktopVideo?.video == null &&
    data.videoRawMp4FileUrl == null &&
    data.desktopVideoRawMp4FileUrl == null
  ) {
    return null
  }

  const videoLayer =
    VIDEO_RENDER === VideoRender.Mp4 ? (
      <VideoLayerMp4
        video={video?.video ?? null}
        desktopVideo={desktopVideo?.video}
        videoRawMp4FileUrl={data.videoRawMp4FileUrl}
        desktopVideoRawMp4FileUrl={data.desktopVideoRawMp4FileUrl}
        isDesktop={effectiveIsDesktop}
        autoplay={data.autoplay}
        loop={data.loop}
      />
    ) : (
      <VideoLayer
        video={video?.video ?? null}
        desktopVideo={desktopVideo?.video}
        isDesktop={effectiveIsDesktop}
        autoplay={data.autoplay}
        loop={data.loop}
      />
    )

  return (
    <div
      className={clsx(
        styles.container,
        className,
        layout === 'fill' && styles.container__fill
      )}
      data-video-id={effectiveVideoId}
    >
      {!disablePoster && serverPosterUrls?.mobile != null && (
        <PosterLayer lcpUrls={serverPosterUrls} sizes={effectivePosterSizes} />
      )}
      {videoLayer}
    </div>
  )
}
