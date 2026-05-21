import { type FC, memo } from 'react'
import type { ReviewFragment } from '../../core/dato/fragments/review.typegen'
import { isImage, isVideo } from '../../core/typescript/guards'
import { CoreImage } from '../core-image'
import { CoreRating } from '../core-rating'
import { CoreTextMarkdown } from '../core-text-markdown'
import { CoreVideo } from '../core-video'
import styles from './style.module.scss'

export type CoreReviewsCardProps = {
  data: ReviewFragment
}

const CoreReviewsCardComponent: FC<CoreReviewsCardProps> = ({ data }) => {
  const { model } = data
  const title = model?.title ?? ''
  const rating = model?.rating ?? 0
  const quote = model?.quote ?? ''
  const media = model?.media ?? null
  const attribution = model?.attribution ?? ''

  return (
    <article className={styles.card}>
      <div className={styles.card__media}>
        {media && isImage(media) && <CoreImage data={media} layout="fill" />}

        {media && isVideo(media) && <CoreVideo data={media} layout="fill" />}
      </div>

      <CoreRating rating={rating} sizeType="small" />

      {title && <h3 className={styles.card__title}>{title}</h3>}

      {quote && (
        <blockquote className={styles.card__quote}>
          <CoreTextMarkdown type="rte">{quote}</CoreTextMarkdown>
        </blockquote>
      )}

      {attribution && <p className={styles.card__author}>{attribution}</p>}
    </article>
  )
}

export const CoreReviewsCard = memo(CoreReviewsCardComponent)
