'use client'

import clsx from 'clsx'
import { CoreCta } from '../../../core-cta'
import { CoreImage } from '../../../core-image'
import { CorePrice } from '../../../core-price'
import { CoreTextMarkdown } from '../../../core-text-markdown'
import styles from './style.module.scss'

export type MediaOptionsCardProps = {
  id: string
  title: string
  description: string
  price: number
  compareAtPrice?: number
  image: string
}

type Props = {
  data: MediaOptionsCardProps
  layout: 'featured' | 'normal'
}

export const MediaOptionCard: React.FC<Props> = ({ data, layout }) => {
  const { id, title, description, price, compareAtPrice, image } = data

  return (
    <article key={id} className={clsx(styles.card, styles[`card--${layout}`])}>
      <div className={styles.card__media}>
        <CoreImage
          data={{
            id: `${id}-image`,
            image: {
              url: image,
              width: 692,
              height: 870,
              responsiveImage: null
            },
            desktopImage: null
          }}
          layout={'fill'}
          objectFit={'cover'}
        />
      </div>

      <div className={styles.card__content}>
        <div className={styles.card__inner}>
          <div className={styles.card__header}>
            <h2 className={styles.card__title}>
              <CoreTextMarkdown>{title}</CoreTextMarkdown>
            </h2>

            <CorePrice
              data={{
                __typename: 'CorePriceRecord',
                id: `${id}-price`,
                compareAtPrice: compareAtPrice ?? null,
                price: price
              }}
              showPrefix={true}
            />
          </div>

          <div className={styles.card__description}>
            <CoreTextMarkdown type="rte">{description}</CoreTextMarkdown>
          </div>
        </div>

        <div className={styles.card__actions}>
          <CoreCta
            text="Add Xperience"
            className={styles.card__cta}
            styleType="black"
            layoutType="button"
            sizeType="small"
            type="button"
          />
        </div>
      </div>
    </article>
  )
}
