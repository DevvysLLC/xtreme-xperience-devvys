'use client'
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { TRANSITIONS } from '../../../config/transitions'
import { CoreSwiperControls } from '../../core-swiper-controls'
import styles from '../style.module.scss'

type CarouselProps = {
  blogCards: ReactNode[] | null
}

export const Carousel: FC<CarouselProps> = ({ blogCards }) => {
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
        slidesPerView: 3
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

  if (!blogCards || blogCards.length === 0) {
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
          {blogCards.map((card, index) => (
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
