'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import type { InsuranceFragment } from '../../../../core/dato/fragments/insurance.typegen'
import { CoreBadge } from '../../../core-badge'
import { CoreIcon } from '../../../core-icon'
import { CorePrice } from '../../../core-price'
import { CoreTextMarkdown } from '../../../core-text-markdown'
import styles from './style.module.scss'

export type InsuranceOptionsCardProps = {
  insurance: InsuranceFragment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  quantity: number
  onSelect?: () => void
}

export const InsuranceOptionsCard: React.FC<InsuranceOptionsCardProps> = ({
  insurance,
  form,
  quantity,
  onSelect
}) => {
  const t = useTranslations('booking_wizard.pages.coverage_options.card')
  const model = insurance.model
  const name = model?.title ?? ''
  const rocketRezId = model?.rocketRezId ?? ''
  const description = model?.description ?? null
  const price = model?.price?.price ?? null
  const compareAtPrice = model?.price?.compareAtPrice ?? null
  const coverage = model?.coverage ?? null
  const total = price ? price * quantity : null
  const priceBadgeText = t('price_badge', { quantity: quantity.toString() })

  return (
    <div className={styles.card}>
      <div className={styles.card__title}>
        <form.Field name="id">
          {(field: {
            name: string
            state: { value: string }
            handleChange: (value: string) => void
            handleBlur: () => void
          }) => (
            <>
              <div className={styles.radio}>
                <input
                  type="radio"
                  id={insurance.id}
                  name={field.name}
                  value={rocketRezId}
                  checked={field.state.value === rocketRezId}
                  onChange={() => {
                    field.handleChange(rocketRezId)
                    onSelect?.()
                  }}
                  onBlur={field.handleBlur}
                />
                <label htmlFor={insurance.id}>
                  <CoreTextMarkdown>{name}</CoreTextMarkdown>
                </label>
              </div>
            </>
          )}
        </form.Field>
      </div>

      <div className={styles.card__coverage}>
        {coverage && (
          <CoreTextMarkdown type="rte" className={styles.card__coverage__text}>
            {coverage}
          </CoreTextMarkdown>
        )}
      </div>

      <div className={styles.card__price}>
        {price && (
          <>
            <div className={clsx(styles.card__label, styles.mobile)}>
              {t('cost_per_car')}
            </div>

            <CorePrice
              data={{
                __typename: 'CorePriceRecord',
                id: `${insurance.id}-price`,
                compareAtPrice: compareAtPrice ?? null,
                price: price ?? null
              }}
            />

            <CoreBadge
              label={priceBadgeText}
              backgroundColor="#F0EDEB"
              color="#111111"
            />
          </>
        )}
      </div>

      <div className={styles.card__total}>
        {total && (
          <>
            <div className={clsx(styles.card__label, styles.mobile)}>
              {t('total')}
            </div>

            <CorePrice
              data={{
                __typename: 'CorePriceRecord',
                id: `${insurance.id}-total`,
                compareAtPrice: null,
                price: total
              }}
            />
          </>
        )}
      </div>

      <div className={styles.card__tags}>
        {model?.badge && (
          <CoreBadge
            data={model.badge}
            backgroundColor="#EB642C"
            color="#fff"
          />
        )}
      </div>

      <div className={styles.card__description}>
        {description && (
          <details className={styles.card__details}>
            <summary className={styles.card__details__summary}>
              {t('learn_more')}
              <CoreIcon icon="chevron-down" />
            </summary>
            <div className={styles.card__details__content}>
              <CoreTextMarkdown type="rte">{description}</CoreTextMarkdown>
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
