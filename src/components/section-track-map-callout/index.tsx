import clsx from 'clsx'
import type { FC } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { isImage, isVideo } from '../../core/typescript/guards'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreCta } from '../core-cta'
import { CoreImage } from '../core-image'
import { CoreTextMarkdown } from '../core-text-markdown'
import { CoreVideo } from '../core-video'
import type { SectionTrackMapCalloutFragment } from './section-track-map-callout.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionTrackMapCalloutFragment
  isFirstSection?: boolean
}

type ValidLayout = 'reverse' | 'default'

const isValidLayout = (layout: string | null): layout is ValidLayout => {
  return layout === 'reverse' || layout === 'default'
}

export const SectionTrackMapCallout: FC<Props> = ({ data, isFirstSection }) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const { layout, title, subtitle, description, media, ctas, config, id } = data

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-track-map-callout"
    >
      <div
        className={clsx(
          styles.container,
          isValidLayout(layout) && styles[`container--${layout}`]
        )}
      >
        <div className={styles.media}>
          {media && isImage(media) && (
            <CoreImage data={media} layout={'fill'} objectFit={'cover'} />
          )}

          {media && isVideo(media) && (
            <CoreVideo data={media} layout={'fill'} />
          )}

          {ctas && ctas.length > 0 && (
            <CoreCta data={ctas[0]} layoutType="transparent" tabIndex={-1} />
          )}
        </div>

        <div className={styles.content}>
          {title && <HeadingTag className={styles.title}>{title}</HeadingTag>}

          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

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
      </div>
    </section>
  )
}
