import clsx from 'clsx'
import type { FC } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreTextMarkdown } from '../core-text-markdown'
import type { SectionHeadlineFragment } from './section-headline.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionHeadlineFragment
  isFirstSection?: boolean
}

export const SectionHeadline: FC<Props> = ({ data, isFirstSection }) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const { title, id, config } = data
  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-headline"
    >
      <div className={styles.content}>
        {title && (
          <HeadingTag className={styles.title}>
            <CoreTextMarkdown>{title}</CoreTextMarkdown>
          </HeadingTag>
        )}
      </div>
    </section>
  )
}
