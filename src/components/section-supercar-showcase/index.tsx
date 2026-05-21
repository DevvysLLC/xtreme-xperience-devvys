import clsx from 'clsx'
import { getTranslations } from 'next-intl/server'
import type { FC, ReactNode } from 'react'
import { ROUTES } from '../../config/routes'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreCta } from '../core-cta'
import { Carousel } from './components/carousel'
import { SupercarDetails } from './components/supercar-details'
import { Thumbnail } from './components/thumbnail'
import type { SectionSupercarShowcaseFragment } from './section-supercar-showcase.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionSupercarShowcaseFragment
  isFirstSection?: boolean
}

export const SectionSupercarShowcase: FC<Props> = async ({
  data,
  isFirstSection
}) => {
  const { config, id, title, titleColor, supercars, allowSlideLinkDesktop } =
    data
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const t = await getTranslations('section_supercar_showcase.carousel')

  if (!supercars || supercars.length === 0) {
    return null
  }

  // Pre-render all content on the server
  // Include responsive image URLs for client-side prefetching (with imgix params)
  // We need both mobile and desktop URLs since CoreImage switches based on viewport
  const supercarsMeta = supercars.map((car) => {
    const showcaseThumbnail = car.model?.showcaseThumbnail
    const thumbnail = car.model?.thumbnail
    const imageSource = showcaseThumbnail ?? thumbnail

    return {
      id: car.id,
      packageType: car.model?.packageType ?? null,
      // Mobile image URL (responsiveImage.src includes imgix params)
      imageUrl: imageSource?.image?.responsiveImage?.src ?? null,
      // Desktop image URL (CoreImage uses this on viewports >= 1024px)
      desktopImageUrl: imageSource?.desktopImage?.responsiveImage?.src ?? null
    }
  })

  const detailTranslations = {
    topSpeed: t('top_speed'),
    horsepower: t('horsepower'),
    zeroToSixty: t('zero_to_sixty'),
    startingAt: t('starting_at'),
    exploreCar: t('explore_car')
  }

  // Pre-render thumbnails and details indexed by id
  // Slides are now rendered dynamically in the carousel with priority based on activeIndex
  const thumbnailsById: Record<string, ReactNode> = {}
  const detailsById: Record<string, ReactNode> = {}

  supercars.forEach((car) => {
    thumbnailsById[car.id] = <Thumbnail key={car.id} data={car} />
    detailsById[car.id] = (
      <SupercarDetails
        key={car.id}
        data={car}
        mode={config?.mode}
        translations={detailTranslations}
      />
    )
  })

  const carouselTranslations = {
    previous: t('previous'),
    next: t('next'),
    packageTypeSingle: t('package_type.single'),
    packageTypeMulti: t('package_type.multi'),
    exploreCar: t('explore_car')
  }

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-supercar-showcase"
    >
      {title && (
        <header className={styles.section__header}>
          <HeadingTag
            className={styles.section__title}
            style={{ color: titleColor?.hex }}
          >
            {title}
          </HeadingTag>
        </header>
      )}

      <Carousel
        supercarsMeta={supercarsMeta}
        supercarsData={supercars}
        thumbnailsById={thumbnailsById}
        detailsById={detailsById}
        mode={config?.mode}
        allowSlideLinkDesktop={allowSlideLinkDesktop}
        translations={carouselTranslations}
      />

      <div className={styles.section__actions}>
        <CoreCta
          href={ROUTES.FRONTEND.SUPERCARS.LISTING}
          text={t('view_all_cars')}
          layoutType="underline"
          styleType={
            config?.mode === 'black' || config?.mode === 'gray'
              ? 'white'
              : 'black'
          }
          sizeType="medium"
        />
      </div>
    </section>
  )
}
