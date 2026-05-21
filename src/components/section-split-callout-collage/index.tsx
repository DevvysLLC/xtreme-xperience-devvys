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
import type { SectionSplitCalloutCollageFragment } from './section-split-callout-collage.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionSplitCalloutCollageFragment
  isFirstSection?: boolean
}

type ValidLayout = 'reverse' | 'default'

const isValidLayout = (layout: string | null): layout is ValidLayout => {
  return layout === 'reverse' || layout === 'default'
}

export const SectionSplitCalloutCollage: FC<Props> = ({
  data,
  isFirstSection
}) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const { layout, title, subtitle, description, gallery, ctas, config, id } =
    data

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        isValidLayout(layout) && styles[`section--${layout}`],
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-split-callout-collage"
    >
      <div className={clsx(styles.section__media)}>
        {gallery.map((media, index) => (
          <div
            key={media.id}
            className={clsx(
              styles.media,
              gallery.length === 1 && styles['media--single'],
              gallery.length === 2 && index + 1 === 2 && styles['media--full']
            )}
          >
            {isImage(media) && (
              <CoreImage data={media} layout={'fill'} objectFit={'cover'} />
            )}
            {isVideo(media) && (
              <CoreVideo
                data={media}
                layout={'fill'}
                controlsClassName={styles.media__controls}
              />
            )}
          </div>
        ))}
      </div>

      <div className={styles.section__content}>
        {title && <HeadingTag className={styles.title}>{title}</HeadingTag>}

        {subtitle && (
          <div className={styles.subtitle}>
            <CoreTextMarkdown>{subtitle}</CoreTextMarkdown>
          </div>
        )}

        {description && (
          <CoreTextMarkdown type="rte" className={styles.description}>
            {description}
          </CoreTextMarkdown>
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
    </section>
  )
}
