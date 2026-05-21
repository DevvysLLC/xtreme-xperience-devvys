import clsx from 'clsx'
import { getTranslations } from 'next-intl/server'
import { CoreBadge } from '../../../../components/core-badge'
import { CoreCountdown } from '../../../../components/core-countdown'
import { CorePrice } from '../../../../components/core-price'
import styles from '../style.module.scss'

export default async function StyleguideButtonsPage() {
  const t = await getTranslations('styleguide.components')

  // Dates for countdown examples
  const now = new Date()
  const date24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const date48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000)

  return (
    <div className={styles.components}>
      <div className={styles.components__section}>
        <div
          className={clsx(
            styles.components__row,
            styles['components__row--header']
          )}
        >
          <div className={styles.components__row}>
            <span className={styles.components__heading}>
              {t('sections.core_badge.title')}
            </span>
          </div>
          <div className={styles.components__row}>
            <CoreBadge
              data={{
                __typename: 'CoreBadgeRecord',
                id: 'styleguide-badge-01',
                backgroundColor: {
                  __typename: 'ColorField',
                  hex: '#000000'
                },
                color: {
                  __typename: 'ColorField',
                  hex: '#FFFFFF'
                },
                label: 'Core Badge'
              }}
            />
          </div>
          <div className={styles.components__row}>
            <CoreBadge
              data={{
                __typename: 'CoreBadgeRecord',
                id: 'styleguide-badge-02',
                backgroundColor: {
                  __typename: 'ColorField',
                  hex: '#EB642C'
                },
                color: {
                  __typename: 'ColorField',
                  hex: '#FFFFFF'
                },
                label: 'Core Badge'
              }}
            />
          </div>
        </div>
      </div>
      <div className={styles.components__section}>
        <div
          className={clsx(
            styles.components__row,
            styles['components__row--header']
          )}
        >
          <div className={styles.components__row}>
            <span className={styles.components__heading}>
              {t('sections.core_price.title')}
            </span>
          </div>
          <div className={styles.components__row}>
            <CorePrice
              data={{
                __typename: 'CorePriceRecord',
                id: 'styleguide-price-01',
                compareAtPrice: 479,
                price: 359
              }}
              showPrefix={true}
              showSuffix={true}
              className={styles.corePrice__example__01}
            />
          </div>
          <div className={styles.components__row}>
            <CorePrice
              data={{
                __typename: 'CorePriceRecord',
                id: 'styleguide-price-01',
                compareAtPrice: 479,
                price: 359
              }}
              showPrefix={true}
              className={styles.corePrice__example__02}
            />
          </div>
        </div>
      </div>
      <div className={styles.components__section}>
        <div
          className={clsx(
            styles.components__row,
            styles['components__row--header']
          )}
        >
          <div className={styles.components__row}>
            <span className={styles.components__heading}>
              {t('sections.core_countdown.title')}
            </span>
          </div>
          <div className={styles.components__row}>
            <CoreCountdown
              data={{
                end: date24Hours.toISOString()
              }}
              className={styles.coreCountdown__example__01}
            />
          </div>
          <div className={styles.components__row}>
            <CoreCountdown
              data={{
                end: date48Hours.toISOString()
              }}
              className={styles.coreCountdown__example__02}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
