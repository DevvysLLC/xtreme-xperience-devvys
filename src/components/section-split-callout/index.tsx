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
import type { SectionSplitCalloutFragment } from './section-split-callout.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionSplitCalloutFragment
  isFirstSection?: boolean
}

type ValidLayout = 'reverse' | 'default'

const isValidLayout = (layout: string | null): layout is ValidLayout => {
  return layout === 'reverse' || layout === 'default'
}

export const SectionSplitCallout: FC<Props> = ({ data, isFirstSection }) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const { layout, title, subtitle, description, media, ctas, config, id } = data

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        isValidLayout(layout) && styles[`section--${layout}`],
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-split-callout"
    >
      <div className={styles.media}>
        {media && isImage(media) && (
          <CoreImage data={media} layout={'fill'} objectFit={'cover'} />
        )}

        {media && isVideo(media) && <CoreVideo data={media} layout={'fill'} />}
      </div>

      <div className={styles.content}>
        {title && <HeadingTag className={styles.title}>{title}</HeadingTag>}

        {subtitle && (
          <div className={styles.subtitle}>
            <CoreTextMarkdown>{subtitle}</CoreTextMarkdown>
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
    </section>
  )
}
