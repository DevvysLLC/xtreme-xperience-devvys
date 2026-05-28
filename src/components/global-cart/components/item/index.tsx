'use client'

import clsx from 'clsx'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { logger } from '../../../../core/logger/logger'
import { sentenceCase } from '../../../../core/string/sentence-case'
import {
  useCartLineItemMetadata,
  useCartRemoveLineItem
} from '../../../../features/cart'
import type {
  CartLineItemMetadata,
  RocketRezLineItem
} from '../../../../io/types'
import { CoreBadge } from '../../../core-badge'
import { CoreCta } from '../../../core-cta'
import { CoreIcon } from '../../../core-icon'
import { CoreLoadingSpinner } from '../../../core-loading-spinner'
import { CoreRocketRezPrice } from '../../../core-rocketrez-price'
import { CoreTextMarkdown } from '../../../core-text-markdown'
import styles from './style.module.scss'

type Props = {
  lineItem: RocketRezLineItem
  compact?: boolean
  readOnly?: boolean
  metadata?: CartLineItemMetadata | null
}

export const CartLineItem: FC<Props> = ({
  lineItem,
  compact = false,
  readOnly = false,
  metadata: externalMetadata
}) => {
  const t = useTranslations('global_cart')
  const { mutateAsync } = useCartRemoveLineItem()
  const cartMetadata = useCartLineItemMetadata({ lineItem })
  const metadata =
    externalMetadata !== undefined ? externalMetadata : cartMetadata.metadata
  const isLoading =
    externalMetadata !== undefined ? false : cartMetadata.isLoading

  const { id, subTotal, price, discountAmount } = lineItem
  const hasDiscount =
    discountAmount !== undefined &&
    discountAmount !== null &&
    discountAmount > 0
  const { title, image, subtitle, label, properties, type } = metadata ?? {}
  const fallbackTitle = `${lineItem.type} #${lineItem.productId}`
  const displayTitle = title?.trim() || fallbackTitle
  const { date, laps } = properties ?? {}
  const displaySubtitle = label ? sentenceCase(label) : subtitle

  const handleRemove = async () => {
    try {
      await mutateAsync({ lineItem })
    } catch (error) {
      logger.error({ error, lineItem }, 'cart-item.handleRemove.error')
    }
  }

  if (compact) {
    return (
      <article className={styles.CartLineItemCompact}>
        {!readOnly && type !== 'insurance' && (
          <button
            type="button"
            onClick={handleRemove}
            className={styles.CartLineItemCompact__remove}
            aria-label={t('item.remove')}
          >
            <CoreIcon icon="close" />
          </button>
        )}

        <div className={styles.CartLineItemCompact__media}>
          <img
            src={image || '/images/fallback.png'}
            alt={displayTitle}
            className={styles.CartLineItemCompact__image}
          />
        </div>

        <div className={styles.CartLineItemCompact__content}>
          <div className={styles.CartLineItemCompact__header}>
              <h3 className={styles.CartLineItemCompact__title}>
                <CoreTextMarkdown>{displayTitle}</CoreTextMarkdown>
              </h3>
            {displaySubtitle && <p>{displaySubtitle}</p>}
          </div>

          <hr className={styles.CartLineItemCompact__divider} />

          {date && (
            <p className={styles.CartLineItemCompact__date}>
              {format(date, 'EEE M/d/yy - h:mm a')}
            </p>
          )}

          <CoreRocketRezPrice
            data={{
              id: `${id}-price`,
              price: price * (lineItem.quantity ?? 1)
            }}
            className={styles.CartLineItemCompact__price}
            priceClassName="u-color-orange"
            valueInCents={false}
          />
        </div>
      </article>
    )
  }

  return (
    <article className={styles.CartLineItem}>
      {isLoading ? (
        <CoreLoadingSpinner aspectRatio="16/9" />
      ) : (
        <>
          <div className={styles.CartLineItem__media}>
            <img
              src={image || '/images/fallback.png'}
              alt={displayTitle}
              className={styles.CartLineItem__image}
              loading="lazy"
            />
          </div>

          <div className={styles.CartLineItem__title}>
            <h3>
              <CoreTextMarkdown>{displayTitle}</CoreTextMarkdown>
            </h3>

            {displaySubtitle && (
              <div className={styles.CartLineItem__subtitle}>
                <CoreTextMarkdown>{displaySubtitle}</CoreTextMarkdown>
              </div>
            )}
          </div>

          <div className={styles.CartLineItem__content}>
            {date && (
              <div className={styles.CartLineItem__date}>
                {format(date, 'EEEE M/d/yy')}
              </div>
            )}

            {date && (
              <div className={styles.CartLineItem__time}>
                {format(date, 'h:mm a')}

                {type !== 'addon' && laps && (
                  <div
                    className={clsx(
                      styles.CartLineItem__laps,
                      styles['CartLineItem__laps--mobile']
                    )}
                  >
                    <CoreBadge
                      label={`${laps} laps`}
                      backgroundColor="#F0EDEB"
                      color="#111111"
                    />
                  </div>
                )}
              </div>
            )}

            {type === 'addon' ? (
              <div />
            ) : (
              <div
                className={clsx(
                  styles.CartLineItem__laps,
                  styles['CartLineItem__laps--desktop']
                )}
              >
                {laps && (
                  <CoreBadge
                    label={`${laps} laps`}
                    backgroundColor="#F0EDEB"
                    color="#111111"
                  />
                )}
              </div>
            )}

            <div className={styles.CartLineItem__inner}>
              <CoreRocketRezPrice
                className={styles.CartLineItem__price}
                priceClassName="u-color-orange"
                data={{
                  id: `${id}-price`,
                  price: price * (lineItem.quantity ?? 1)
                }}
                valueInCents={false}
              />

              {!readOnly && type !== 'insurance' && (
                <CoreCta
                  text={t('item.remove')}
                  className={styles.CartLineItem__remove}
                  onClick={handleRemove}
                  styleType="black"
                  layoutType="text"
                  sizeType="small"
                  type="button"
                />
              )}
            </div>
          </div>
        </>
      )}
    </article>
  )
}
