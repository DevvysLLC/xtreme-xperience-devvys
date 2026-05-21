import clsx from 'clsx'
import type { FC } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreCta } from '../core-cta'
import { AccordionInteractive } from './components/accordion-interactive'
import type { SectionAccordionFragment } from './section-accordion.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionAccordionFragment
  isFirstSection?: boolean
}

type ValidLayout = 'reverse' | 'default'

const isValidLayout = (layout: string | null): layout is ValidLayout => {
  return layout === 'reverse' || layout === 'default'
}

export const SectionAccordion: FC<Props> = ({ data, isFirstSection }) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const { config, id, title, subtitle, layout, accordion, ctas } = data
  const layoutType = isValidLayout(layout) ? layout : 'default'
  const accordionId = `section-accordion-${id}`
  const headerContent = (
    <div key={`section-accordion-header-${id}`} className={styles.header}>
      {title && <HeadingTag className={styles.title}>{title}</HeadingTag>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  )

  const ctasContent =
    ctas && ctas.length > 0 ? (
      <ul key={`section-accordion-ctas-${id}`} className={styles.ctas}>
        {ctas.map((cta) => (
          <li key={cta.id}>
            <CoreCta data={cta} />
          </li>
        ))}
      </ul>
    ) : null

  return (
    <section
      id={getSectionId(config?.customId, id)}
      data-ga-section-name="section-accordion"
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles),
        layoutType === 'reverse' && styles['section--reverse']
      )}
      style={getSectionConfigStyles(config)}
    >
      <AccordionInteractive
        accordion={accordion}
        accordionId={accordionId}
        header={headerContent}
        ctas={ctasContent}
      />
    </section>
  )
}
