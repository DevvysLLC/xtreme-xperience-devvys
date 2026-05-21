import clsx from 'clsx'
import type { FC } from 'react'
import { HERO_POSTER_SIZES_MOBILE_ALIGNED } from '../../config/media'
import { getSectionId } from '../../core/string/get-section-id'
import { isImage, isVideo } from '../../core/typescript/guards'
import { getHeroLcpImages } from '../../utils/get-hero-lcp-image'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreCta } from '../core-cta'
import { CoreGradient } from '../core-gradient'
import { CoreImage } from '../core-image'
import { CoreMarquee } from '../core-marquee'
import { CoreTextMarkdown } from '../core-text-markdown'
import { CoreVideo } from '../core-video'
import { CoreVideoLcp } from '../core-video-lcp'
import { GlobalTrackFinderWidget } from '../global-track-finder'
import type { SectionHeroFragment } from './section-hero.typegen'
import styles from './style.module.scss'

type Props = {
  data: SectionHeroFragment
  isFirstSection?: boolean
}

export const SectionHero: FC<Props> = async ({ data, isFirstSection }) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const {
    showTrackFinder,
    maxHeight,
    media,
    mediaFullHeight,
    subtitle,
    title,
    largeText,
    description,
    gradient,
    ctas,
    marquee,
    config,
    id
  } = data

  const heroImages = getHeroLcpImages(media)
  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-hero"
    >
      {isFirstSection && heroImages && media && isImage(media) && (
        <>
          {/* Mobile: preload only href (480px). Omitting imageSrcSet avoids the browser selecting a larger candidate (e.g. 1440w) from srcSet. */}
          {heroImages.mobile && (
            <link
              rel="preload"
              as="image"
              href={heroImages.mobile}
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
      {isFirstSection && heroImages && media && isVideo(media) && (
        <>
          {heroImages.mobile && (
            <link
              rel="preload"
              as="image"
              href={heroImages.mobile}
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
      <div className={styles.section__inner}>
        <div
          className={clsx(
            styles.container,
            mediaFullHeight && styles['container--full-height']
          )}
          style={{ maxHeight: maxHeight ? `${maxHeight}dvh` : '100dvh' }}
        >
          <div
            className={clsx(
              styles.media,
              mediaFullHeight && styles['media--full-height']
            )}
          >
            {media && isVideo(media) && (
              <>
                {isFirstSection ? (
                  <CoreVideoLcp
                    data={media}
                    uniqueVideoId={`hero-video-${id}`}
                    controlsClassName={styles.media__controls}
                    layout="fill"
                    serverPosterUrls={
                      heroImages?.mobile
                        ? {
                            mobile: heroImages.mobile,
                            desktop: heroImages.desktop ?? undefined,
                            alt: heroImages.alt ?? undefined
                          }
                        : undefined
                    }
                    posterSizes={HERO_POSTER_SIZES_MOBILE_ALIGNED}
                  />
                ) : (
                  <CoreVideo
                    data={media}
                    uniqueVideoId={`hero-video-${id}`}
                    controlsClassName={styles.media__controls}
                    layout="fill"
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
              </>
            )}

            {media && isImage(media) && (
              <CoreImage data={media} priority={true} layout="fill" />
            )}

            {gradient && (
              <CoreGradient
                data={gradient}
                className={styles.media__gradient}
              />
            )}
          </div>

          <div className={styles.content}>
            {title && (
              <header>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

                <HeadingTag className={styles.title}>{title}</HeadingTag>
              </header>
            )}

            {largeText && (
              <div className={styles.largeText}>
                <CoreTextMarkdown>{largeText}</CoreTextMarkdown>
              </div>
            )}

            {description && (
              <div className={styles.description}>
                <CoreTextMarkdown>{description}</CoreTextMarkdown>
              </div>
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

          {showTrackFinder && (
            <div className={styles.trackFinder}>
              <GlobalTrackFinderWidget />
            </div>
          )}

          {!showTrackFinder && marquee && (
            <CoreMarquee
              data={{
                text: marquee
              }}
              containerClass={styles.marquee}
              innerClass={styles.marquee__inner}
            />
          )}
        </div>
      </div>
    </section>
  )
}
