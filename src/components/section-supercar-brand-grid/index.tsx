import clsx from 'clsx'
import type { FC } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreSVGImage } from '../core-svg-upload'
import { CoreTextMarkdown } from '../core-text-markdown'
import type { SectionSupercarBrandGridFragment } from './section-supercar-brand-grid.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionSupercarBrandGridFragment
  isFirstSection?: boolean
}

export const SectionSupercarBrandGrid: FC<Props> = ({
  data,
  isFirstSection
}) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const { logos, config, id, title, description } = data
  const maxLogos = 6

  if (logos.length === 0) {
    return null
  }

  const hasHeader = title || description
  const logosToUse = logos.slice(0, maxLogos)

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-supercar-brand-grid"
    >
      {hasHeader && (
        <header className={styles.section__header}>
          {title && (
            <HeadingTag className={styles.section__title}>{title}</HeadingTag>
          )}

          {description && (
            <div className={styles.section__description}>
              <CoreTextMarkdown type="rte">{description}</CoreTextMarkdown>
            </div>
          )}
        </header>
      )}

      <div className={styles.logos}>
        {logosToUse.map((logo) => (
          <CoreSVGImage key={logo.id} data={logo} className={styles.logo} />
        ))}
      </div>
    </section>
  )
}
