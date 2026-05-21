import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { ROUTES } from '../../config/routes'
import type { SupercarBaseFragment } from '../../core/dato/fragments/supercar-base.typegen'
import { getRecordLink } from '../../utils/get-record-link'
import { CoreBadge } from '../core-badge'
import { CoreCta } from '../core-cta'
import { CoreImage } from '../core-image'
import { CorePrice } from '../core-price'
import { CoreTextMarkdown } from '../core-text-markdown'
import type { CardBackgroundColor } from './io'
import styles from './style.module.scss'

export type Props = {
  data: SupercarBaseFragment
  className?: string
  backgroundColor?: CardBackgroundColor
  addLinks?: boolean
}

export const SupercarCardStats: FC<Props> = ({ data, ...props }) => {
  const { model: modelData } = data
  const { className, backgroundColor, addLinks = true } = props
  const t = useTranslations('core_supercar_card.card_stats')

  if (!modelData) {
    return null
  }

  const {
    title,
    tagline,
    thumbnail,
    displayPrice,
    badges,
    value,
    horsepower,
    zeroToSixty,
    topSpeed
  } = modelData
  const recordLink = getRecordLink(data.config, 'supercar')
  const titleText = tagline || title

  return (
    <article
      className={clsx(
        styles.cardStats,
        className,
        backgroundColor && styles[`cardStats--bg-${backgroundColor}`]
      )}
    >
      <div className={styles.cardStats__media}>
        {thumbnail && (
          <CoreImage
            data={thumbnail}
            layout="fill"
            objectFit="contain"
            className={styles.cardStats__image}
          />
        )}

        <div className={styles.cardStats__badges}>
          {badges.map((badge) => (
            <CoreBadge key={badge.id} data={badge} />
          ))}
        </div>

        {addLinks && (
          <CoreCta
            href={recordLink}
            className={styles.cardStats__fullLink}
            layoutType="transparent"
            text={t('view_details_seo', { title: title ?? '' })}
            tabIndex={-1}
          />
        )}
      </div>

      <header className={styles.cardStats__header}>
        {titleText && (
          <h3 className={styles.cardStats__title}>
            <CoreTextMarkdown>{titleText}</CoreTextMarkdown>
          </h3>
        )}

        {displayPrice && (
          <CorePrice
            data={displayPrice}
            showPrefix={true}
            className={styles.cardStats__price}
          />
        )}
      </header>

      <ul className={styles.cardStats__details}>
        {value && (
          <li>
            <strong>{t('value')}</strong>
            <span>{value}</span>
          </li>
        )}
        {horsepower && (
          <li>
            <strong>{t('horsepower')}</strong>
            <span>{horsepower}</span>
          </li>
        )}
        {zeroToSixty && (
          <li>
            <strong>{t('zero_to_sixty')}</strong>
            <span>{zeroToSixty}</span>
          </li>
        )}
        {topSpeed && (
          <li>
            <strong>{t('top_speed')}</strong>
            <span>{topSpeed}</span>
          </li>
        )}
      </ul>

      {addLinks && (
        <div className={styles.cardStats__actions}>
          <CoreCta
            href={ROUTES.BOOKING.DATE_AND_CAR}
            className={styles.cardStats__button}
            layoutType="button"
            sizeType="medium"
            styleType="black"
            text={t('book_now')}
          />

          <CoreCta
            href={recordLink}
            layoutType="underline"
            sizeType="medium"
            styleType="black"
            text={t('view_details')}
            ariaLabel={t('view_details_seo', { title: title ?? '' })}
          />
        </div>
      )}
    </article>
  )
}
