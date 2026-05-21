import clsx from 'clsx'
import type { FC } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { FaqTabs } from './components/faq-tabs'
import type { SectionFaqFragment } from './section-faq.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionFaqFragment
  isFirstSection?: boolean
}

export const SectionFaq: FC<Props> = ({ data, isFirstSection }) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const { config, id, layout, title, subtitle, faqs } = data

  const tabs = faqs
    .filter(
      (faq): faq is typeof faq & { model: NonNullable<typeof faq.model> } =>
        faq.model !== null
    )
    .map((faq) => faq.model)

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-faq"
    >
      <div className={clsx(styles.container, styles[`container--${layout}`])}>
        <FaqTabs tabs={tabs}>
          {title && <HeadingTag className={styles.title}>{title}</HeadingTag>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </FaqTabs>
      </div>
    </section>
  )
}
