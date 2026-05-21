'use client'
import { type FC, type ReactNode, useCallback, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { TRANSITIONS } from '../../../config/transitions'
import { CoreSwiperControls } from '../../core-swiper-controls'
import styles from '../style.module.scss'

type CarouselProps = {
  cards: ReactNode[] | null
}

export const Carousel: FC<CarouselProps> = ({ cards }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [totalSlides, setTotalSlides] = useState(0)
  const [showNavigation, setShowNavigation] = useState(false)

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

  if (!cards || cards.length === 0) {
    return null
  }

  return (
    <div className={styles.reviews}>
      <Swiper
        className={styles.slider}
        slidesPerView={'auto'}
        speed={TRANSITIONS.DEFAULT_SWIPER_DURATION}
        onSwiper={handleSwiper}
        onSnapIndexChange={handleSnapIndexChange}
        onSnapGridLengthChange={handleSnapGridLengthChange}
        onResize={handleResize}
        onInit={handleInit}
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index} className={styles.slider__slide}>
            {card}
          </SwiperSlide>
        ))}

        {showNavigation && (
          <div className={styles.slider__actions}>
            <CoreSwiperControls
              activeIndex={activeIndex}
              totalSlides={totalSlides}
              layout="reverse"
            />
          </div>
        )}
      </Swiper>
    </div>
  )
}
