import clsx from 'clsx'
import type { FC } from 'react'
import { HERO_POSTER_SIZES_MOBILE_ALIGNED } from '../../config/media'
import type { SupercarModelFragment } from '../../core/dato/fragments/supercar-model.typegen'
import { getDatoStringWithModelFallback } from '../../core/string/get-dato-string-with-model-fallback'
import { getSectionId } from '../../core/string/get-section-id'
import { isImage, isVideo } from '../../core/typescript/guards'
import { getHeroLcpImages } from '../../utils/get-hero-lcp-image'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreBadge } from '../core-badge'
import { CoreCta } from '../core-cta'
import { CoreGradient } from '../core-gradient'
import { CoreImage } from '../core-image'
import { CoreMarquee } from '../core-marquee'
import { CorePrice } from '../core-price'
import { CoreTextMarkdown } from '../core-text-markdown'
import { CoreVideo } from '../core-video'
import { CoreVideoLcp } from '../core-video-lcp'
import { GlobalTrackFinderWidget } from '../global-track-finder'
import type { SectionSupercarHeroFragment } from './section-supercar-hero.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionSupercarHeroFragment
  model: SupercarModelFragment | null
  isFirstSection?: boolean
}

export const SectionSupercarHero: FC<Props> = ({
  data,
  model: supercarModel,
  isFirstSection
}) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const {
    id,
    config,
    maxHeight: datoMaxHeight,
    showTrackFinder,
    media: datoMedia,
    subtitle: datoSubtitle,
    title: datoTitle,
    description: datoDescription,
    gradient,
    ctas: datoCtas,
    marquee: datoMarquee,
    largeText: datoLargeText
  } = data

  const { make, featuredMedia, model, displayPrice, badges } =
    supercarModel ?? {}

  const media = datoMedia ?? featuredMedia ?? null
  const titleText = getDatoStringWithModelFallback(datoTitle, model)
  const subtitleText = getDatoStringWithModelFallback(datoSubtitle, make)
  const descriptionText = datoDescription ?? null

  const heroImages = getHeroLcpImages(media)
  const uniqueVideoId = `supercar-hero-video-${id}`

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-supercar-hero"
    >
      <div className={styles.section__inner}>
        {isFirstSection && config?.addFlagPattern && (
          <link
            rel="preload"
            as="image"
            href="/images/flag-background.png"
            fetchPriority="high"
          />
        )}
        {isFirstSection && heroImages && media && isImage(media) && (
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
        {isFirstSection && heroImages && media && isVideo(media) && (
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

        <div
          className={styles.container}
          style={{
            maxHeight: datoMaxHeight ? `${datoMaxHeight}dvh` : '100dvh'
          }}
        >
          <div className={styles.media}>
            {media && isVideo(media) && (
              <>
                {isFirstSection ? (
                  <CoreVideoLcp
                    data={media}
                    uniqueVideoId={uniqueVideoId}
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
                    uniqueVideoId={uniqueVideoId}
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
              <>
                {media.image && media.desktopImage ? (
                  <>
                    <div className={styles.media__imageMobile}>
                      <CoreImage
                        data={{ ...media, desktopImage: null }}
                        priority={true}
                        layout="fill"
                      />
                    </div>
                    <div className={styles.media__imageDesktop}>
                      <CoreImage
                        data={{ ...media, image: media.desktopImage }}
                        priority={true}
                        layout="fill"
                      />
                    </div>
                  </>
                ) : (
                  <CoreImage data={media} priority={true} layout="fill" />
                )}
              </>
            )}

            {gradient && (
              <CoreGradient
                data={gradient}
                className={styles.media__gradient}
              />
            )}
          </div>

          <div className={styles.content}>
            {badges && badges.length > 0 && (
              <div className={styles.badges}>
                {badges.map((badge) => (
                  <CoreBadge key={badge.id} data={badge} />
                ))}
              </div>
            )}

            {titleText && (
              <header>
                {subtitleText && (
                  <p className={styles.subtitle}>{subtitleText}</p>
                )}

                <HeadingTag className={styles.title}>{titleText}</HeadingTag>
              </header>
            )}

            {datoLargeText ? (
              <div className={styles.largeText}>
                <CoreTextMarkdown>{datoLargeText}</CoreTextMarkdown>
              </div>
            ) : displayPrice ? (
              <div className={styles.largeText}>
                <CorePrice
                  data={displayPrice}
                  showPrefix={true}
                  showSuffix={true}
                />
              </div>
            ) : null}

            {descriptionText && (
              <div className={styles.description}>
                <CoreTextMarkdown>{descriptionText}</CoreTextMarkdown>
              </div>
            )}

            {datoCtas && datoCtas.length > 0 && (
              <ul className={styles.ctas}>
                {datoCtas.map((cta) => (
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

          {!showTrackFinder && datoMarquee && (
            <CoreMarquee
              data={{
                text: datoMarquee
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
