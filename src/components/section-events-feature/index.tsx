import clsx from 'clsx'
import { getSectionId } from '../../core/string/get-section-id'
import { getUtcTodayString } from '../../utils/date-time'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreCta } from '../core-cta'
import { CoreEventCard } from '../core-event-card'
import { CoreTextMarkdown } from '../core-text-markdown'
import { Carousel } from './components/carousel'
import type { SectionEventsFeatureFragment } from './section-events-feature.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionEventsFeatureFragment
  isFirstSection?: boolean
}

export const SectionEventsFeature = ({ data, isFirstSection }: Props) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const {
    config,
    id,
    title,
    subtitle,
    description,
    ctas,
    events: datoEvents
  } = data
  const today = getUtcTodayString()
  const enabledEvents =
    datoEvents.filter((event) => {
      if (!event.model?.enabled) {
        return false
      }

      const endDate = event.model.endDate ?? event.model.startDate

      if (!endDate) {
        return true
      }

      return endDate >= today
    }) ?? []
  const showCtas = ctas && ctas.length > 0
  const cards =
    enabledEvents.length > 0
      ? enabledEvents.map((event) => (
          <CoreEventCard key={event.id} data={event} mode={config?.mode} />
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
      data-ga-section-name="section-events-feature"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          {title && <HeadingTag className={styles.title}>{title}</HeadingTag>}

          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>

        <div className={styles.content}>
          {description && (
            <div className={styles.description}>
              <CoreTextMarkdown>{description}</CoreTextMarkdown>
            </div>
          )}

          {showCtas && (
            <ul className={clsx(styles.ctas, styles.desktop)}>
              {ctas.map((cta) => (
                <li key={cta.id}>
                  <CoreCta data={cta} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Carousel cards={cards} mode={config?.mode} />

      {showCtas && (
        <ul className={clsx(styles.ctas, styles.mobile)}>
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
