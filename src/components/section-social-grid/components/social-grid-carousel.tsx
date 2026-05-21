'use client'

import clsx from 'clsx'
import { type FC, memo, useCallback, useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation } from 'swiper/modules'
import { TRANSITIONS } from '../../../config/transitions'
import { CoreIcon } from '../../core-icon'
import { CoreSocialCard } from '../../core-social-card'
import type { SectionSocialGridFragment } from '../section-social-grid.typegen'
import styles from '../style.module.scss'
import 'swiper/css'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'

type Card = SectionSocialGridFragment['cards'][number]

export type Props = {
  cards: Card[]
  showNavigation: boolean
}

const SocialGridCarouselInner: FC<Props> = ({ cards, showNavigation }) => {
  const [isInitialized, setIsInitialized] = useState(false)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  const handleInit = useCallback((swiper: SwiperType) => {
    // Re-attach navigation after swiper initializes with the refs
    if (
      swiper.params.navigation &&
      typeof swiper.params.navigation !== 'boolean'
    ) {
      swiper.params.navigation.prevEl = prevRef.current
      swiper.params.navigation.nextEl = nextRef.current
      swiper.navigation.init()
      swiper.navigation.update()
    }
    setIsInitialized(true)
  }, [])

  if (cards.length === 0) {
    return null
  }

  // Loop mode needs enough slides for the largest configured slidesPerView (4).
  const shouldLoop = cards.length > 4

  return (
    <div className={styles.carouselContainer}>
      {showNavigation && (
        <div className={styles.navigation}>
          <button className={styles.navigation__prev} ref={prevRef}>
            <CoreIcon icon="chevron-left" />
          </button>
          <button className={styles.navigation__next} ref={nextRef}>
            <CoreIcon icon="chevron-right" />
          </button>
        </div>
      )}

      <div className={styles.slider__wrapper}>
        {!isInitialized && (
          <div className={styles.slider__placeholder} aria-hidden="true" />
        )}
        <Swiper
          modules={[Navigation]}
          slidesPerView={4}
          spaceBetween={16}
          speed={TRANSITIONS.DEFAULT_SWIPER_DURATION}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current
          }}
          loop={shouldLoop}
          breakpoints={{
            0: {
              slidesPerView: 2,
              spaceBetween: 0,
              slidesOffsetBefore: 24,
              slidesOffsetAfter: 24
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
              slidesOffsetBefore: 0,
              slidesOffsetAfter: 0
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 16
            }
          }}
          className={clsx(
            styles.slider,
            isInitialized && styles.slider__initialized
          )}
          onInit={handleInit}
        >
          {isInitialized &&
            cards.map((card) => (
              <SwiperSlide key={card.id} className={styles.slide}>
                <CoreSocialCard data={card} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  )
}

// Memoize to prevent re-renders when parent re-renders with same cards
export const SocialGridCarousel = memo(SocialGridCarouselInner)
