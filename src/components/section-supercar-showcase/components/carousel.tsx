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
import { Navigation } from 'swiper/modules'
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
  title?: string | null
  titleColor?: string
  HeadingTag?: 'h1' | 'h2'
  viewAllCarsCta: ReactNode
}

export const Carousel: FC<CarouselProps> = ({
  supercarsMeta,
  supercarsData,
  thumbnailsById,
  detailsById,
  mode,
  translations,
  allowSlideLinkDesktop,
  title,
  titleColor,
  HeadingTag = 'h2',
  viewAllCarsCta
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
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

  // Combine single and multi-car packages into a single swipe flow, singles first
  const allSupercarsSortedData = useMemo(() => {
    const singles = supercarsData.filter((car) => car.model?.packageType === 'single')
    const multis = supercarsData.filter((car) => car.model?.packageType === 'multi')
    return [...singles, ...multis]
  }, [supercarsData])

  const allSupercarsSortedMeta = useMemo(() => {
    const singles = supercarsMeta.filter((car) => car.packageType === 'single')
    const multis = supercarsMeta.filter((car) => car.packageType === 'multi')
    return [...singles, ...multis]
  }, [supercarsMeta])

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    const index = swiper.realIndex
    const activeCarMeta = allSupercarsSortedMeta[index]
    if (activeCarMeta?.packageType) {
      setActiveTab(activeCarMeta.packageType as KnownPackageType)
    }
    setActiveIndex(index)
  }, [allSupercarsSortedMeta])

  const handleMainSwiper = useCallback((swiper: SwiperType) => {
    mainSwiperRef.current = swiper
  }, [])

  const slideCount = allSupercarsSortedMeta.length

  // Prefetch images for upcoming slides when activeIndex changes
  useEffect(() => {
    if (slideCount === 0) {
      return
    }
    for (let i = 1; i <= PREFETCH_AHEAD_COUNT; i++) {
      const prefetchIndex = (activeIndex + i) % slideCount
      const carToPrefetch = allSupercarsSortedMeta[prefetchIndex]
      if (carToPrefetch) {
        if (carToPrefetch.imageUrl) {
          const img = new Image()
          img.src = carToPrefetch.imageUrl
        }
        if (carToPrefetch.desktopImageUrl) {
          const imgDesktop = new Image()
          imgDesktop.src = carToPrefetch.desktopImageUrl
        }
      }
    }
  }, [activeIndex, allSupercarsSortedMeta, slideCount])

  const firstMultiIndex = useMemo(() => {
    return allSupercarsSortedMeta.findIndex((car) => car.packageType === 'multi')
  }, [allSupercarsSortedMeta])

  const handleTabChange = useCallback((tab: KnownPackageType) => {
    const main = mainSwiperRef.current
    if (main && !main.destroyed) {
      const targetIndex = tab === 'single' ? 0 : firstMultiIndex
      if (targetIndex !== -1) {
        if (main.slideToLoop) {
          main.slideToLoop(targetIndex)
        } else {
          main.slideTo(targetIndex)
        }
      }
    }
    setActiveTab(tab)
  }, [firstMultiIndex])

  const activeCar = allSupercarsSortedMeta[activeIndex]
  const hasTabs = packageTypes.length > 1
  const shouldLoopMainSlider = allSupercarsSortedData.length > 2

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
      {/* 1. Selector Tabs (Moved to the top) */}
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

      {/* 2. Showcase Section Header / Title */}
      {title && (
        <header className={styles.section__header}>
          <HeadingTag
            className={styles.section__title}
            style={{ color: titleColor }}
          >
            {title}
          </HeadingTag>
        </header>
      )}

      {/* 3. Main Swiper Slider */}
      <div className={styles.main}>
        <button
          type="button"
          className={clsx(styles.nav, styles.nav__prev)}
          aria-label={translations.previous}
        >
          <CoreIcon icon="chevron-left" />
        </button>
        <Swiper
          modules={[Navigation]}
          slidesPerView={1.15}
          loop={shouldLoopMainSlider}
          centeredSlides={true}
          navigation={{
            nextEl: `.${styles.nav__next}`,
            prevEl: `.${styles.nav__prev}`
          }}
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
          {allSupercarsSortedData.map((car) => (
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

      {/* 4. Supercar Details Panel (Contains specs & CTA) */}
      {activeCar && detailsById[activeCar.id]}

      {/* 5. View All Cars Link */}
      {viewAllCarsCta}
    </div>
  )
}
