'use client'
import { type FC, memo, useCallback, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { TRANSITIONS } from '../../../config/transitions'
import { isImage, isVideo } from '../../../core/typescript/guards'
import { CoreImage } from '../../core-image'
import { CoreSwiperControls } from '../../core-swiper-controls'
import { CoreVideo } from '../../core-video'
import type { SectionMediaGalleryFragment } from '../section-media-gallery.typegen'
import styles from '../style.module.scss'

type GalleryItem = SectionMediaGalleryFragment['gallery'][number]

type CarouselProps = {
  gallery: GalleryItem[]
}

// Memoized media item component to prevent unnecessary re-renders
const MediaItem = memo<{ media: GalleryItem }>(function MediaItem({ media }) {
  return (
    <div className={styles.media}>
      {isImage(media) && (
        <CoreImage data={media} layout="fill" objectFit="cover" />
      )}
      {isVideo(media) && <CoreVideo data={media} layout="fill" />}
    </div>
  )
})

const CarouselInner: FC<CarouselProps> = ({ gallery }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px'
  })
  const [activeIndex, setActiveIndex] = useState(0)
  const [totalSlides, setTotalSlides] = useState(0)
  const [showNavigation, setShowNavigation] = useState(false)

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

  if (gallery.length === 0) {
    return null
  }

  return (
    <div ref={ref}>
      {inView && (
        <Swiper
          slidesPerView="auto"
          breakpoints={breakpoints}
          className={styles.slider}
          speed={TRANSITIONS.DEFAULT_SWIPER_DURATION}
          onSwiper={handleSwiper}
          onSnapIndexChange={handleSnapIndexChange}
          onSnapGridLengthChange={handleSnapGridLengthChange}
          onResize={handleResize}
          onInit={handleInit}
        >
          {gallery.map((media) => (
            <SwiperSlide key={media.id} className={styles.slider__slide}>
              <MediaItem media={media} />
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

// Memoize the carousel to prevent re-renders when parent re-renders with same gallery
export const Carousel = memo(CarouselInner)
