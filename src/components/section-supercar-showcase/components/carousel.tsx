'use client'
import clsx from 'clsx'
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/thumbs'
import { Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { TRANSITIONS } from '../../../config/transitions'
import { getRecordLink } from '../../../utils/get-record-link'
import { CoreCta } from '../../core-cta'
import { CoreIcon } from '../../core-icon'
import type { SectionSupercarShowcaseFragment } from '../section-supercar-showcase.typegen'
import styles from '../style.module.scss'
import { SupercarSlide } from './supercar-slide'

type KnownPackageType = 'single' | 'multi'

type SupercarMeta = {
  id: string
  packageType: string | null
  /** Mobile image URL for prefetching */
  imageUrl: string | null
  /** Desktop image URL for prefetching (used on viewports >= 1024px) */
  desktopImageUrl: string | null
}

type Supercar = SectionSupercarShowcaseFragment['supercars'][number]

/** Number of slides ahead to prefetch images for */
const PREFETCH_AHEAD_COUNT = 2

type CarouselProps = {
  /** Metadata for filtering (only id and packageType needed) */
  supercarsMeta: SupercarMeta[]
  /** Raw supercar data for rendering slides dynamically with priority */
  supercarsData: Supercar[]
  /** Pre-rendered thumbnail content indexed by supercar id */
  thumbnailsById: Record<string, ReactNode>
  /** Pre-rendered details content indexed by supercar id */
  detailsById: Record<string, ReactNode>
  mode?: string | null
  translations: {
    previous: string
    next: string
    packageTypeSingle: string
    packageTypeMulti: string
    exploreCar: string
  }
  allowSlideLinkDesktop: boolean
}

export const Carousel: FC<CarouselProps> = ({
  supercarsMeta,
  supercarsData,
  thumbnailsById,
  detailsById,
  mode,
  translations,
  allowSlideLinkDesktop
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const mainSwiperRef = useRef<SwiperType | null>(null)

  const packageTypes = useMemo(() => {
    const types = new Set<KnownPackageType>()
    supercarsMeta.forEach((car) => {
      if (car.packageType === 'single' || car.packageType === 'multi') {
        types.add(car.packageType)
      }
    })
    return Array.from(types)
  }, [supercarsMeta])

  const [activeTab, setActiveTab] = useState<KnownPackageType | ''>(
    () => packageTypes[0] ?? ''
  )

  const filteredSupercarsMeta = useMemo(() => {
    if (!activeTab) {
      return supercarsMeta
    }
    return supercarsMeta.filter((car) => car.packageType === activeTab)
  }, [supercarsMeta, activeTab])

  const filteredSupercarsData = useMemo(() => {
    if (!activeTab) {
      return supercarsData
    }
    return supercarsData.filter((car) => car.model?.packageType === activeTab)
  }, [supercarsData, activeTab])

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex)
  }, [])

  const handleThumbsSwiper = useCallback((swiper: SwiperType) => {
    setThumbsSwiper(swiper)
  }, [])

  const handleMainSwiper = useCallback((swiper: SwiperType) => {
    mainSwiperRef.current = swiper
  }, [])

  useEffect(() => {
    const main = mainSwiperRef.current
    if (main && !main.destroyed && thumbsSwiper && !thumbsSwiper.destroyed) {
      main.thumbs.swiper = thumbsSwiper
      main.thumbs.init()
      main.thumbs.update(true)
    }
  }, [thumbsSwiper])

  const slideCount = filteredSupercarsMeta.length

  // Prefetch images for upcoming slides when activeIndex changes (wrap-around for loop mode)
  // Prefetch both mobile and desktop URLs since CoreImage switches based on viewport
  useEffect(() => {
    if (slideCount === 0) {
      return
    }
    for (let i = 1; i <= PREFETCH_AHEAD_COUNT; i++) {
      const prefetchIndex = (activeIndex + i) % slideCount
      const carToPrefetch = filteredSupercarsMeta[prefetchIndex]
      if (carToPrefetch) {
        // Prefetch mobile image
        if (carToPrefetch.imageUrl) {
          const img = new Image()
          img.src = carToPrefetch.imageUrl
        }
        // Prefetch desktop image
        if (carToPrefetch.desktopImageUrl) {
          const imgDesktop = new Image()
          imgDesktop.src = carToPrefetch.desktopImageUrl
        }
      }
    }
  }, [activeIndex, filteredSupercarsMeta, slideCount])

  const handleTabChange = useCallback((tab: KnownPackageType) => {
    mainSwiperRef.current = null
    setThumbsSwiper(null)
    setActiveTab(tab)
    setActiveIndex(0)
  }, [])

  const activeCar = filteredSupercarsMeta[activeIndex]
  const hasTabs = packageTypes.length > 1
  // Prevent Swiper loop warnings when current filtered set is too small.
  const shouldLoopMainSlider = filteredSupercarsData.length > 2

  const thumbsConfig =
    thumbsSwiper && !thumbsSwiper.destroyed
      ? { swiper: thumbsSwiper }
      : undefined

  const packageTypeLabels: Record<KnownPackageType, string> = {
    single: translations.packageTypeSingle,
    multi: translations.packageTypeMulti
  }

  const getTabStyleType = (isActive: boolean) => {
    if (isActive) {
      return mode === 'black' ? 'white' : 'black'
    }
    return mode === 'black' ? 'white-transparent' : 'white'
  }

  return (
    <div className={styles.showcase}>
      <div className={styles.main}>
        <button
          type="button"
          className={clsx(styles.nav, styles.nav__prev)}
          aria-label={translations.previous}
        >
          <CoreIcon icon="chevron-left" />
        </button>
        <Swiper
          key={`main-${activeTab}`}
          modules={[Thumbs, Navigation]}
          slidesPerView={1.15}
          loop={shouldLoopMainSlider}
          centeredSlides={true}
          navigation={{
            nextEl: `.${styles.nav__next}`,
            prevEl: `.${styles.nav__prev}`
          }}
          thumbs={thumbsConfig}
          speed={TRANSITIONS.DEFAULT_SWIPER_DURATION}
          onSlideChange={handleSlideChange}
          onSwiper={handleMainSwiper}
          watchSlidesProgress={true}
          className={styles.main__slider}
          breakpoints={{
            768: {
              slidesPerView: 1.5
            }
          }}
        >
          {filteredSupercarsData.map((car) => (
            <SwiperSlide key={`main-slideshow-${car.id}`}>
              <SupercarSlide data={car} />

              {allowSlideLinkDesktop && car.config?.handle && (
                <CoreCta
                  href={getRecordLink(
                    { handle: car.config.handle },
                    'supercar'
                  )}
                  text={translations.exploreCar}
                  layoutType="transparent"
                  className={styles.main__link}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          type="button"
          className={clsx(styles.nav, styles.nav__next)}
          aria-label={translations.next}
        >
          <CoreIcon icon="chevron-right" />
        </button>
      </div>

      {activeCar && detailsById[activeCar.id]}

      <div className={styles.thumbs}>
        {hasTabs && (
          <div className={styles.thumbs__tabs}>
            {packageTypes.map((type) => (
              <CoreCta
                key={type}
                text={packageTypeLabels[type]}
                href={null}
                layoutType="pill"
                styleType={getTabStyleType(activeTab === type)}
                sizeType="small"
                onClick={() => {
                  handleTabChange(type)
                }}
                className={clsx(
                  styles.showcase__tab,
                  activeTab === type && styles['showcase__tab--active']
                )}
              />
            ))}
          </div>
        )}

        <Swiper
          key={`thumbs-${activeTab}`}
          modules={[Thumbs]}
          onSwiper={handleThumbsSwiper}
          slidesPerView="auto"
          spaceBetween={8}
          watchSlidesProgress={true}
          speed={TRANSITIONS.DEFAULT_SWIPER_DURATION}
          className={styles.thumbs__slider}
        >
          {filteredSupercarsData.map((car) => (
            <SwiperSlide key={car.id} className={styles.thumbs__slide}>
              {thumbnailsById[car.id]}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
