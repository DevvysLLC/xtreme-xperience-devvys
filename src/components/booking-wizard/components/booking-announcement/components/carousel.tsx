'use client'
import type { FC, ReactNode } from 'react'
import 'swiper/css'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { TRANSITIONS } from '../../../../../config/transitions'
import styles from '../style.module.scss'
import { NavigationButton } from './navigation-button'

export type CarouselProps = {
  cards: ReactNode[]
}

export const Carousel: FC<CarouselProps> = ({ cards }) => {
  const showNavigation = cards.length > 1
  const shouldLoop = cards.length > 1

  return (
    <div className={styles.section__container}>
      <Swiper
        className={styles.slider}
        modules={[Autoplay]}
        slidesPerView={1}
        speed={TRANSITIONS.DEFAULT_SWIPER_DURATION}
        loop={shouldLoop}
        autoplay={
          shouldLoop
            ? {
                delay: 5000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true
              }
            : false
        }
      >
        <span slot="container-start">
          {showNavigation && <NavigationButton direction="prev" />}
          {showNavigation && <NavigationButton direction="next" />}
        </span>

        {cards.map((card, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            {card}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
