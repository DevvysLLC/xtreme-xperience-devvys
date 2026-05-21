import clsx from 'clsx'
import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreUsp } from '../core-usp'
import type { SectionUspFragment } from './section-usp.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionUspFragment
  isFirstSection?: boolean
}

const MAX_CARDS = 4

export const SectionUsp: FC<Props> = async ({ data, isFirstSection }) => {
  const { config, id, cards = [] } = data

  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const sectionId = config?.id ?? id
  const t = await getTranslations('section_usp')

  return (
    <section
      id={sectionId}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-usp"
    >
      <HeadingTag className={styles.section__title}>{t('title')}</HeadingTag>

      <div className={styles.container}>
        {cards.slice(0, MAX_CARDS).map((card) => (
          <CoreUsp key={card.id} data={card} />
        ))}
      </div>
    </section>
  )
}
