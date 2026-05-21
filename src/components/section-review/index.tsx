import clsx from 'clsx'
import type { FC } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreCta } from '../core-cta'
import { CoreRating } from '../core-rating'
import { CoreReviewsCard } from '../core-reviews-card'
import { Carousel } from './components/carousel'
import type { SectionReviewFragment } from './section-review.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionReviewFragment
  isFirstSection?: boolean
}

export const SectionReview: FC<Props> = ({ data, isFirstSection }) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const { config, id, title, subtitle, rating, reviews, ctas } = data

  const cards =
    reviews && reviews.length > 0
      ? reviews.map((review) => (
          <CoreReviewsCard key={review.id} data={review} />
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
      data-ga-section-name="section-review"
    >
      <div className={styles.content}>
        <div className={styles.rating}>
          {rating && rating > 0 && <CoreRating rating={rating} />}

          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {title && <HeadingTag className={styles.title}>{title}</HeadingTag>}

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

      <Carousel cards={cards} />
    </section>
  )
}
