'use client'
import type { FC, ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { TRANSITIONS } from '../../../config/transitions'
import { CoreSwiperControls } from '../../core-swiper-controls'
import styles from '../style.module.scss'

type CarouselProps = {
  cards: ReactNode[] | null
  totalCards: number
}

export const Carousel: FC<CarouselProps> = ({ cards, totalCards }) => {
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
      1440: {
        slidesPerView: totalCards > 4 ? 4 : totalCards
      }
    }),
    [totalCards]
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

  if (!cards || cards.length === 0) {
    return null
  }

  return (
    <div ref={ref}>
      {inView && (
        <Swiper
          className={styles.slider}
          slidesPerView={'auto'}
          speed={TRANSITIONS.DEFAULT_SWIPER_DURATION}
          breakpoints={breakpoints}
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
              />
            </div>
          )}
        </Swiper>
      )}
    </div>
  )
}
