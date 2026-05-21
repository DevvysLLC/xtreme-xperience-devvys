import clsx from 'clsx'
import type { FC } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreCta } from '../core-cta'
import { SocialGridCarousel } from './components/social-grid-carousel'
import type { SectionSocialGridFragment } from './section-social-grid.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionSocialGridFragment
  isFirstSection?: boolean
}

export const SectionSocialGrid: FC<Props> = ({ data, isFirstSection }) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const {
    config,
    id,
    title,
    subtitle,
    description,
    cards = [],
    titleCta
  } = data
  const { addBottomBorder } = config ?? {}

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.socialGrid,
        addBottomBorder && styles['socialGrid--bottom-border']
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-social-grid"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.content}>
            {title || subtitle ? (
              <HeadingTag className={styles.title}>
                {title} {subtitle && <strong>{subtitle}</strong>}
                {titleCta && (
                  <CoreCta
                    data={titleCta}
                    layoutType="transparent"
                    className={styles.title__cta}
                  />
                )}
              </HeadingTag>
            ) : null}
            {description && <p className={styles.description}>{description}</p>}
          </div>
        </div>

        {cards.length > 0 && (
          <SocialGridCarousel cards={cards} showNavigation={cards.length > 4} />
        )}
      </div>
    </section>
  )
}
