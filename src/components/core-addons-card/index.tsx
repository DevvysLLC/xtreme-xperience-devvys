'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import type { AddonFragment } from '../../core/dato/fragments/addon.typegen'
import { RocketRezProductTypeSchema } from '../../io'
import { CoreAddToCartForm } from '../core-add-to-cart-form'
import { CoreBadge } from '../core-badge'
import { CoreCta } from '../core-cta'
import { CoreImage } from '../core-image'
import { CorePrice } from '../core-price'
import { CoreTextMarkdown } from '../core-text-markdown'
import styles from './style.module.scss'

export type CoreAddonsCardProps = {
  addon: AddonFragment
  showQuantitySelector?: boolean
  layout?: 'default' | 'upsell' | 'featured'
  onAddToCart?: (rocketRezId: number) => void
}

export const CoreAddonsCard: FC<CoreAddonsCardProps> = (props) => {
  const t = useTranslations('core_addons_card')
  const { model } = props.addon ?? {}
  const { layout = 'default', onAddToCart } = props
  const {
    id,
    badge,
    thumbnail,
    title,
    description,
    price,
    rocketRezId,
    rocketRezType
  } = model ?? {}

  const productId = rocketRezId ? Number(rocketRezId) : null
  const parsedType = RocketRezProductTypeSchema.safeParse(rocketRezType)
  const validProductType = parsedType.success ? parsedType.data : null

  if (!title || !price) {
    return null
  }

  const handleCustomAddToCart = () => {
    if (onAddToCart && productId) {
      onAddToCart(productId)
    }
  }

  return (
    <article className={clsx(styles.card, layout && styles[`card--${layout}`])}>
      <div className={styles.card__media}>
        {badge && (
          <div className={styles.card__badge}>
            <CoreBadge data={badge} />
          </div>
        )}

        <CoreImage
          withFallback={true}
          data={
            thumbnail ?? {
              id: `fallback-image-${id ?? 'unknown'}`,
              image: {
                format: 'png',
                url: '/images/fallback.png',
                width: 800,
                height: 800,
                alt: null,
                title: null,
                focalPoint: null,
                responsiveImage: null
              },
              desktopImage: null
            }
          }
          layout={'fill'}
          objectFit={'cover'}
        />
      </div>

      <div className={styles.card__inner}>
        <div className={styles.card__content}>
          <div className={styles.card__header}>
            <h2 className={styles.card__title}>{title}</h2>

            <CorePrice data={price} showPrefix={true} />
          </div>

          {description && (
            <div className={styles.card__description}>
              <CoreTextMarkdown type="rte">{description}</CoreTextMarkdown>
            </div>
          )}
        </div>

        <div className={styles.card__actions}>
          {onAddToCart && productId ? (
            <CoreCta
              text={t('button.add_to_cart')}
              href={null}
              type="button"
              layoutType="button"
              styleType="black"
              sizeType="small"
              onClick={handleCustomAddToCart}
              className={styles.card__cta}
            />
          ) : productId && validProductType ? (
            <CoreAddToCartForm
              id={productId}
              type={validProductType}
              quantity={1}
              addon={props.addon}
              buttonText={t('button.add_to_cart')}
              className={styles.card__cta}
              styleType="black"
              layoutType="button"
              sizeType="small"
              showQuantitySelector={props.showQuantitySelector}
            />
          ) : null}
        </div>
      </div>
    </article>
  )
}
