import type { FC } from 'react'
import { HERO_POSTER_SIZES_MOBILE_ALIGNED } from '../../config/media'
import { getSectionId } from '../../core/string/get-section-id'
import { isImage, isVideo } from '../../core/typescript/guards'
import { getHeroLcpImages } from '../../utils/get-hero-lcp-image'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreCta } from '../core-cta'
import { CoreGradient } from '../core-gradient'
import { CoreImage } from '../core-image'
import { CoreTextMarkdown } from '../core-text-markdown'
import { CoreVideo } from '../core-video'
import { CoreVideoControls } from '../core-video-controls'
import type { SectionMediaHeroFragment } from './section-media-hero.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionMediaHeroFragment
  isFirstSection?: boolean
}

export const SectionMediaHero: FC<Props> = ({ data, isFirstSection }) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const { media, config, gradient, title, subtitle, description, ctas, id } =
    data
  const uniqueVideoId = `media-hero-video-${id}`
  const isMediaVideo = media && isVideo(media)
  const isMediaImage = media && isImage(media)
  const heroImages = getHeroLcpImages(media)

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={styles.section}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-media-hero"
    >
      {isFirstSection && heroImages && (
        <>
          {heroImages.mobile && (
            <link
              rel="preload"
              as="image"
              href={heroImages.mobile}
              {...(heroImages.srcSet && {
                imageSrcSet: heroImages.srcSet,
                imageSizes: HERO_POSTER_SIZES_MOBILE_ALIGNED
              })}
              fetchPriority="high"
              media="(max-width: 1023px)"
            />
          )}
          {heroImages.desktop && (
            <link
              rel="preload"
              as="image"
              href={heroImages.desktop}
              {...(heroImages.srcSet && {
                imageSrcSet: heroImages.srcSet,
                imageSizes: HERO_POSTER_SIZES_MOBILE_ALIGNED
              })}
              fetchPriority="high"
              media="(min-width: 1024px)"
            />
          )}
        </>
      )}
      <div className={styles.container}>
        <div className={styles.media}>
          {isMediaVideo && (
            <CoreVideo
              data={media}
              hasOutsideControls={true}
              uniqueVideoId={uniqueVideoId}
              isFirstSection={isFirstSection}
              serverPosterUrls={
                heroImages?.mobile
                  ? {
                      mobile: heroImages.mobile,
                      desktop: heroImages.desktop ?? undefined,
                      srcSet: heroImages.srcSet,
                      alt: heroImages.alt ?? undefined
                    }
                  : undefined
              }
              posterSizes={HERO_POSTER_SIZES_MOBILE_ALIGNED}
            />
          )}

          {isMediaImage && (
            <CoreImage
              data={media}
              layout={'fill'}
              objectFit={'cover'}
              priority={isFirstSection}
            />
          )}
        </div>

        {gradient && <CoreGradient data={gradient} />}

        <div className={styles.content}>
          {title && (
            <header>
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

              <HeadingTag className={styles.title}>{title}</HeadingTag>
            </header>
          )}

          {description && (
            <div className={styles.description}>
              <CoreTextMarkdown>{description}</CoreTextMarkdown>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          {isMediaVideo && media.controls && (
            <CoreVideoControls uniqueVideoId={uniqueVideoId} />
          )}

          {ctas && ctas.length > 0 && (
            <ul className={styles.ctas}>
              {ctas.map((cta) => (
                <li key={cta.id}>
                  <CoreCta data={cta} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
