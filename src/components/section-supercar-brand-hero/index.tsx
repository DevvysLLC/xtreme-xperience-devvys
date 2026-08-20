import clsx from 'clsx'
import { CoreImage } from '../../components/core-image'
import { CoreVideo } from '../../components/core-video'
import { HERO_POSTER_SIZES_MOBILE_ALIGNED } from '../../config/media'
import { getSectionId } from '../../core/string/get-section-id'
import { isImage, isVideo } from '../../core/typescript/guards'
import { getHeroLcpImages } from '../../utils/get-hero-lcp-image'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreGradient } from '../core-gradient'
import { CoreSVGImage } from '../core-svg-upload'
import { VideoSoundCta } from './components/video-sound-cta'
import type { SectionSupercarBrandHeroFragment } from './section-supercar-brand-hero.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionSupercarBrandHeroFragment
  isFirstSection?: boolean
}

export const SectionSupercarBrandHero = async ({
  data,
  isFirstSection
}: Props) => {
  const { config, id, media, gradient, logo, maxHeight } = data
  const heroImages = getHeroLcpImages(media)
  const uniqueVideoId = `supercar-brand-hero-video-${id}`

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-supercar-brand-hero"
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

      <div
        className={styles.section__inner}
        style={{ maxHeight: maxHeight ? `${maxHeight}dvh` : '100dvh' }}
      >
        <div className={styles.media}>
          {media && isVideo(media) && (
            <CoreVideo
              data={media}
              uniqueVideoId={uniqueVideoId}
              controlsClassName={styles.media__controls}
              layout="fill"
              isFirstSection={isFirstSection}
              preload="auto"
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

          {media && isImage(media) && (
            <>
              {media.image && media.desktopImage ? (
                <>
                  <div className={styles.media__imageMobile}>
                    <CoreImage
                      data={{ ...media, desktopImage: null }}
                      priority={isFirstSection}
                      layout="fill"
                    />
                  </div>
                  <div className={styles.media__imageDesktop}>
                    <CoreImage
                      data={{ ...media, image: media.desktopImage }}
                      priority={isFirstSection}
                      layout="fill"
                    />
                  </div>
                </>
              ) : (
                <CoreImage
                  data={media}
                  priority={isFirstSection}
                  layout="fill"
                />
              )}
            </>
          )}

          {gradient && (
            <CoreGradient data={gradient} className={styles.media__gradient} />
          )}
        </div>

        <div className={styles.content}>
          {logo && (
            <CoreSVGImage key={logo.id} data={logo} className={styles.logo} />
          )}

          {media && isVideo(media) && (
            <VideoSoundCta uniqueVideoId={uniqueVideoId} />
          )}
        </div>
      </div>
    </section>
  )
}
