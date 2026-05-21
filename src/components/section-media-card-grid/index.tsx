import clsx from 'clsx'
import type { FC } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreCta } from '../core-cta'
import { CoreMediaCard } from '../core-media-card'
import { CoreTextMarkdown } from '../core-text-markdown'
import { Carousel } from './components/carousel'
import type { SectionMediaCardGridFragment } from './section-media-card-grid.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionMediaCardGridFragment
  isFirstSection?: boolean
}

export const SectionMediaCardGrid: FC<Props> = ({ data, isFirstSection }) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const { config, id, title, description, cards, ctas } = data
  const layout =
    'layout' in data &&
    typeof data.layout === 'string' &&
    data.layout.toLowerCase() === 'grid'
      ? 'grid'
      : 'carousel'

  const mediaCards =
    cards && cards.length > 0
      ? cards.map((card) => <CoreMediaCard key={card.id} data={card} />)
      : null

  const gridMediaCards =
    cards && cards.length > 0
      ? cards.map((card) => (
          <CoreMediaCard
            key={card.id}
            data={card}
            className={styles.section__grid__card}
          />
        ))
      : null

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-media-card-grid"
    >
      {title ? (
        <header className={styles.section__header}>
          <HeadingTag className={styles.section__title}>{title}</HeadingTag>

          {description ? (
            <div className={styles.section__description}>
              <CoreTextMarkdown type="rte">{description}</CoreTextMarkdown>
            </div>
          ) : null}
        </header>
      ) : null}

      {layout === 'grid' ? (
        <div className={styles.section__grid}>{gridMediaCards}</div>
      ) : (
        <Carousel cards={mediaCards} totalCards={cards?.length ?? 0} />
      )}

      {ctas && ctas.length > 0 && (
        <ul className={styles.section__actions}>
          {ctas.map((cta) => (
            <li key={cta.id}>
              <CoreCta data={cta} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
