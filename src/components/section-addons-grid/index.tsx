import type { FC } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreAddonsCard } from '../core-addons-card'
import { Navigation } from './components/navigation'
import type { SectionAddonsGridFragment } from './section-addons-grid.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionAddonsGridFragment
  isFirstSection?: boolean
}

export const SectionAddonsGrid: FC<Props> = (props) => {
  const { data, isFirstSection } = props
  const { config, id, addons, title, description, ctas } = data
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={styles.section}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-addons-grid"
    >
      <div className={styles.header}>
        {title && <HeadingTag className={styles.title}>{title}</HeadingTag>}
        {description && <p className={styles.description}>{description}</p>}
        <Navigation ctas={ctas} />
      </div>
      <div className={styles.grid}>
        {addons &&
          addons.length > 0 &&
          addons.map((addon) => (
            <CoreAddonsCard key={addon.id} addon={addon} />
          ))}
      </div>
    </section>
  )
}
