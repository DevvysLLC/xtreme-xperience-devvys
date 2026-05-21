'use client'
import clsx from 'clsx'
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { TRANSITIONS } from '../../../config/transitions'
import { useTracksSortedByDistance } from '../../../features/tracks'
import { CoreEventCard } from '../../core-event-card'
import { CoreSwiperControls } from '../../core-swiper-controls'
import { MAX_CAROUSEL_EVENTS_COUNT, MAX_NEAREST_TRACKS_COUNT } from '../config'
import styles from '../style.module.scss'

export type CarouselProps = {
  cards: ReactNode[] | null
  className?: string
  mode?: string | null
}

export const Carousel: FC<CarouselProps> = ({ cards, className, mode }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px'
  })
  const [activeIndex, setActiveIndex] = useState(0)
  const [totalSlides, setTotalSlides] = useState(0)
  const [showNavigation, setShowNavigation] = useState(false)
  const { data: tracks } = useTracksSortedByDistance()

  const breakpoints = useMemo(
    () => ({
      0: {
        slidesPerView: 'auto' as const
      },
      768: {
        slidesPerView: 2
      }
    }),
    []
  )

  const handleSwiper = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.snapIndex)
    setTotalSlides(swiper.snapGrid.length)
  }, [])

  const handleSnapIndexChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.snapIndex)
  }, [])

  const handleSnapGridLengthChange = useCallback((swiper: SwiperType) => {
    setTotalSlides(swiper.snapGrid.length)
  }, [])

  const handleResize = useCallback((swiper: SwiperType) => {
    setShowNavigation(swiper.allowSlideNext && swiper.allowSlidePrev)
  }, [])

  const handleInit = useCallback((swiper: SwiperType) => {
    setShowNavigation(swiper.allowSlideNext && swiper.allowSlidePrev)
  }, [])

  // If no cards provided, use events from the 5 nearest tracks
  const fallbackCards = useMemo(() => {
    if (cards && cards.length > 0) {
      return null
    }

    if (!tracks || tracks.length === 0) {
      return null
    }

    // Get the nearest tracks
    const nearestTracks = tracks.slice(0, MAX_NEAREST_TRACKS_COUNT)

    // Collect all enabled events from those tracks
    const events = nearestTracks
      .flatMap((trackWithDistance) => {
        const trackEvents = trackWithDistance.track.model?.events ?? []
        return trackEvents
          .filter((event) => event.model?.enabled)
          .map((event) => ({
            event,
            isNearestTrack: trackWithDistance.isNearestTrack ?? false
          }))
      })
      .slice(0, MAX_CAROUSEL_EVENTS_COUNT)

    if (events.length === 0) {
      return null
    }

    // Create cards from events
    // Note: EventData now includes EventModelData which has media and gradient fields
    return events.map(({ event, isNearestTrack }) => (
      <CoreEventCard
        key={event.id}
        data={event}
        isNearestTrack={isNearestTrack}
        mode={mode}
      />
    ))
  }, [cards, tracks, mode])

  const displayCards = cards && cards.length > 0 ? cards : fallbackCards

  if (!displayCards || displayCards.length === 0) {
    return null
  }

  return (
    <div ref={ref}>
      {inView && (
        <Swiper
          className={clsx(styles.slider, className)}
          slidesPerView="auto"
          speed={TRANSITIONS.DEFAULT_SWIPER_DURATION}
          breakpoints={breakpoints}
          onSwiper={handleSwiper}
          onSnapIndexChange={handleSnapIndexChange}
          onSnapGridLengthChange={handleSnapGridLengthChange}
          onResize={handleResize}
          onInit={handleInit}
        >
          {displayCards.map((card, index) => (
            <SwiperSlide key={index} className={styles.slider__slide}>
              {card}
            </SwiperSlide>
          ))}

          {showNavigation && (
            <div className={styles.slider__actions}>
              <CoreSwiperControls
                activeIndex={activeIndex}
                totalSlides={totalSlides}
              />
            </div>
          )}
        </Swiper>
      )}
    </div>
  )
}
