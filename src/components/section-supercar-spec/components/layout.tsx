import clsx from 'clsx'
import { type FC, memo, type ReactNode } from 'react'
import type { SectionConfigFragment } from '../../../core/dato/fragments/section-config.typegen'
import { isImage } from '../../../core/typescript/guards'
import { getSectionConfigClasses } from '../../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../../utils/get-section-config-styles'
import { CoreBadge } from '../../core-badge'
import { CoreIcon } from '../../core-icon'
import { CoreImage } from '../../core-image'
import { CorePrice } from '../../core-price'
import { CoreTextMarkdown } from '../../core-text-markdown'
import styles from '../style.module.scss'
import { ModelViewer3d } from './model-viewer'
import type { ContentData, LayoutTranslations, MediaData } from './types'

type Props = {
  sectionId: string
  config: SectionConfigFragment | null
  content: ContentData
  media: MediaData
  translations: LayoutTranslations
  isFirstSection?: boolean
  mediaSlot?: ReactNode
  specifications?: ReactNode
  drawer?: ReactNode
}

export const SupercarSpecLayout: FC<Props> = memo(
  ({
    sectionId,
    config,
    content,
    media,
    translations: t,
    isFirstSection,
    mediaSlot,
    specifications,
    drawer
  }) => {
    const HeadingTag = isFirstSection ? 'h1' : 'h2'
    const { description, specBadges, displayPrice, rideAlongPrice } = content
    const { thumbnail, modelViewer3d } = media

    return (
      <>
        <section
          id={sectionId}
          className={clsx(
            styles.section,
            ...getSectionConfigClasses(config, styles)
          )}
          style={getSectionConfigStyles(config)}
          data-ga-section-name="section-supercar-spec"
        >
          <div className={styles.container}>
            <div className={styles.content}>
              <HeadingTag className={styles.title}>
                {rideAlongPrice && (
                  <>
                    {t.ride_along_prefix}{' '}
                    <CorePrice data={rideAlongPrice} hideOnSale={true} />{' '}
                    {t.ride_along_suffix}
                  </>
                )}
                {rideAlongPrice && displayPrice && <br />}
                {displayPrice && (
                  <>
                    {t.supercar_xperiences_prefix}{' '}
                    <CorePrice data={displayPrice} hideOnSale={true} />{' '}
                  </>
                )}
              </HeadingTag>

              {description && (
                <div className={styles.description}>
                  <CoreTextMarkdown type="rte">{description}</CoreTextMarkdown>
                </div>
              )}

              {specBadges && specBadges.length > 0 && (
                <div className={styles.badges}>
                  {specBadges.map((badge) => (
                    <CoreBadge key={badge.id} data={badge} />
                  ))}
                </div>
              )}
            </div>

            <div className={styles.media}>
              {modelViewer3d ? (
                <div className={styles.media__inner}>
                  <ModelViewer3d
                    modelViewer3d={modelViewer3d}
                    className={styles.media__model}
                  />

                  <div className={styles.media__icon}>
                    <CoreIcon icon="3d" />
                  </div>
                </div>
              ) : (
                thumbnail &&
                isImage(thumbnail) && (
                  <div className={styles.media__inner}>
                    <CoreImage
                      data={thumbnail}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                )
              )}

              {mediaSlot}
            </div>
          </div>

          {specifications}
          {drawer}
        </section>
      </>
    )
  }
)

SupercarSpecLayout.displayName = 'SupercarSpecLayout'
