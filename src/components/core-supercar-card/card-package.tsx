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

export const SupercarCardPackage: FC<Props> = ({ data, ...props }) => {
  const { model: modelData } = data
  const { className, backgroundColor, addLinks = true } = props
  const t = useTranslations('core_supercar_card.card_package')

  if (!modelData) {
    return null
  }

  const { thumbnail, displayPrice, tagline, badges, excerpt, title } = modelData
  const recordLink = getRecordLink(data.config, 'supercar')
  const titleText = tagline || title

  return (
    <article
      className={clsx(
        styles.cardPackage,
        className,
        backgroundColor && styles[`cardPackage--bg-${backgroundColor}`]
      )}
    >
      <div className={styles.cardPackage__media}>
        {thumbnail && (
          <CoreImage
            data={thumbnail}
            layout="fill"
            objectFit="contain"
            className={styles.cardPackage__image}
          />
        )}

        <div className={styles.cardPackage__badges}>
          {badges.map((badge) => (
            <CoreBadge key={badge.id} data={badge} />
          ))}
        </div>

        {addLinks && (
          <CoreCta
            href={recordLink}
            className={styles.cardPackage__fullLink}
            layoutType="transparent"
            text={t('view_details_seo', { title: title ?? '' })}
            tabIndex={-1}
          />
        )}
      </div>

      <header className={styles.cardPackage__header}>
        {titleText && (
          <h3 className={styles.cardPackage__title}>
            <CoreTextMarkdown>{titleText}</CoreTextMarkdown>
          </h3>
        )}

        {displayPrice && (
          <CorePrice
            data={displayPrice}
            showPrefix={true}
            className={styles.cardPackage__price}
          />
        )}
      </header>

      {excerpt && (
        <CoreTextMarkdown className={styles.cardPackage__excerpt}>
          {excerpt}
        </CoreTextMarkdown>
      )}

      {addLinks && (
        <div className={styles.cardPackage__actions}>
          <CoreCta
            href={ROUTES.BOOKING.DATE_AND_CAR}
            className={styles.cardPackage__button}
            layoutType="button"
            sizeType="medium"
            styleType="black"
            text={t('book_now')}
          />

          <CoreCta
            href={recordLink}
            className={styles.cardPackage__link}
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
