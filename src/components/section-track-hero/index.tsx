import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import { HERO_POSTER_SIZES_MOBILE_ALIGNED } from '../../config/media'
import { ROUTES } from '../../config/routes'
import type { TrackFragment } from '../../core/dato/fragments/track.typegen'
import type { TrackModelFragment } from '../../core/dato/fragments/track-model.typegen'
import { getDatoStringWithModelFallback } from '../../core/string/get-dato-string-with-model-fallback'
import { getSectionId } from '../../core/string/get-section-id'
import { isImage, isVideo } from '../../core/typescript/guards'
import { getEventDataFragment } from '../../utils/get-event-data-fragment'
import { getHeroLcpImages } from '../../utils/get-hero-lcp-image'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { getTrackEventToShow } from '../../utils/get-track-event-to-show'
import { BookingEventLink } from '../booking-event-link'
import { CoreBadge } from '../core-badge'
import { CoreCta } from '../core-cta'
import { CoreGradient } from '../core-gradient'
import { CoreImage } from '../core-image'
import { CoreMarquee } from '../core-marquee'
import { CorePrice } from '../core-price'
import { CoreTextMarkdown } from '../core-text-markdown'
import { CoreVideo } from '../core-video'
import { CoreVideoLcp } from '../core-video-lcp'
import { Events } from './components/events'
import { TrackNotifyMeButton } from '../track-notify-me-button'
import type { SectionTrackHeroFragment } from './section-track-hero.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionTrackHeroFragment
  model: TrackModelFragment | null
  track: TrackFragment | null
  isFirstSection?: boolean
}

export const SectionTrackHero: FC<Props> = async ({
  data,
  model,
  track,
  isFirstSection
}) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const t = await getTranslations('section_track_hero')
  const {
    config,
    id,
    maxHeight: datoMaxHeight,
    media: datoMedia,
    gradient,
    title: datoTitle,
    subtitle: datoSubtitle,
    description: datoDescription,
    marquee,
    showEvents,
    showPrices
  } = data

  const {
    nickname: modelNickname,
    city: modelCity,
    featuredMedia: modelFeaturedMedia,
    drivingPrice: modelDrivingPrice,
    rideAlongPrice: modelRideAlongPrice,
    badges: modelBadges,
    trackSvg: modelTrackSvg,
    events: modelEvents,
    featuredEvent: modelFeaturedEvent,
    notifyMeCta
  } = model ?? {}

  const events = modelEvents ?? []
  const media = datoMedia ?? modelFeaturedMedia ?? null
  const title = getDatoStringWithModelFallback(datoTitle, modelNickname)
  const subtitle = getDatoStringWithModelFallback(datoSubtitle, modelCity)
  const heroImages = getHeroLcpImages(media)
  const sectionId = getSectionId(config?.customId, id)
  const uniqueVideoId = `track-hero-video-${id}`

  // Resolve the event for the "Book Now" button: use the featured event when
  // valid, otherwise fall back to the next upcoming event (matches the date
  // label rendered by <Events />).
  const { eventToShow: bookingEvent } = getTrackEventToShow(
    modelFeaturedEvent,
    events
  )
  const bookingEventFragment =
    bookingEvent?.model && track
      ? getEventDataFragment(
          bookingEvent.id,
          bookingEvent.model,
          track.config,
          track.model
        )
      : null

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={styles.section}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-track-hero"
    >
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
        className={styles.section__inner}
        style={{ maxHeight: datoMaxHeight ? `${datoMaxHeight}dvh` : '100dvh' }}
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
            <CoreGradient data={gradient} className={styles.media__gradient} />
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.content__inner}>
            <header className={styles.header}>
              {modelBadges && modelBadges.length > 0 && (
                <div className={styles.badges}>
                  {modelBadges.map((badge) => (
                    <CoreBadge key={badge.id} data={badge} />
                  ))}
                </div>
              )}

              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

              {title && (
                <HeadingTag className={styles.title}>{title}</HeadingTag>
              )}
            </header>

            {showPrices && (
              <div className={styles.description}>
                {modelRideAlongPrice && (
                  <>
                    {t('ride_along_prefix')}{' '}
                    <CorePrice data={modelRideAlongPrice} hideOnSale={true} />{' '}
                    {t('ride_along_suffix')}
                  </>
                )}
                {modelRideAlongPrice && modelDrivingPrice && <br />}
                {modelDrivingPrice && (
                  <>
                    {t('supercar_xperiences_prefix')}{' '}
                    <CorePrice data={modelDrivingPrice} hideOnSale={true} />{' '}
                    {t('supercar_xperiences_suffix')}
                  </>
                )}
              </div>
            )}

            {datoDescription && (
              <div className={styles.description}>
                <CoreTextMarkdown>{datoDescription}</CoreTextMarkdown>
              </div>
            )}

            <div className={styles.footer}>
              <Events
                track={track}
                showEvents={showEvents}
                featuredEvent={modelFeaturedEvent}
                events={events}
                sectionId={sectionId}
              />

              <ul className={styles.ctas}>
                <li>
                  {bookingEvent?.model?.soldOut ? (
                    notifyMeCta ? (
                      <CoreCta
                        data={notifyMeCta}
                        text={t('notify_me')}
                        layoutType="button"
                        styleType="orange"
                        sizeType="small"
                        className={styles.cta}
                      />
                    ) : (
                      <TrackNotifyMeButton
                        trackName={modelNickname ?? datoTitle ?? 'this track'}
                        soldOut={true}
                        text={t('notify_me')}
                        className={styles.cta}
                      />
                    )
                  ) : (
                    <BookingEventLink
                      track={track}
                      event={bookingEventFragment}
                      setHomeTrack={true}
                      text={t('book_now')}
                      layoutType="button"
                      styleType="orange"
                      sizeType="small"
                      className={styles.cta}
                    />
                  )}
                </li>

                <li>
                  <CoreCta
                    href={ROUTES.FRONTEND.GIFT_CARDS}
                    className={styles.cta}
                    layoutType="button"
                    styleType="white-transparent"
                    sizeType="small"
                    text={t('buy_gift_card')}
                  />
                </li>
              </ul>
            </div>
          </div>

          {modelTrackSvg && (
            <div className={styles.map}>
              <CoreImage
                data={{
                  id: modelTrackSvg.id,
                  image: modelTrackSvg,
                  desktopImage: null
                }}
              />
            </div>
          )}
        </div>

        {marquee && (
          <CoreMarquee
            data={{
              text: marquee
            }}
            containerClass={styles.marquee}
            innerClass={styles.marquee__inner}
          />
        )}
      </div>
    </section>
  )
}
