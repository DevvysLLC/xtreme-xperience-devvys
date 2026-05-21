import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import type { SupercarBaseFragment } from '../../core/dato/fragments/supercar-base.typegen'
import { getRecordLink } from '../../utils/get-record-link'
import { CoreCta } from '../core-cta'
import { CoreImage } from '../core-image'
import { CorePrice } from '../core-price'
import { CoreTextMarkdown } from '../core-text-markdown'
import type { CardBackgroundColor } from './io'
import styles from './style.module.scss'

export type SupercarCardSimpleData = {
  config: {
    handle: string | null
  } | null
  model: Pick<
    NonNullable<SupercarBaseFragment['model']>,
    'title' | 'tagline' | 'thumbnail' | 'displayPrice'
  > | null
}

export type Props = {
  data: SupercarCardSimpleData
  className?: string
  backgroundColor?: CardBackgroundColor
  addLinks?: boolean
}

export const SupercarCardSimple: FC<Props> = ({ data, ...props }) => {
  const { model: modelData } = data
  const { className, backgroundColor, addLinks = true } = props
  const t = useTranslations('core_supercar_card.card_simple')

  if (!modelData) {
    return null
  }

  const { title, thumbnail, displayPrice, tagline } = modelData

  const recordLink = getRecordLink(data.config ?? { handle: null }, 'supercar')
  const titleText = tagline || title

  return (
    <div
      className={clsx(
        styles.cardSimple,
        className,
        backgroundColor && styles[`cardSimple--bg-${backgroundColor}`]
      )}
    >
      {addLinks && (
        <CoreCta
          href={recordLink}
          className={styles.cardSimple__fullLink}
          layoutType="transparent"
          text={t('view_details_seo', { title: title ?? '' })}
        />
      )}

      <div className={styles.cardSimple__media}>
        {thumbnail && (
          <CoreImage data={thumbnail} layout="fill" objectFit="contain" />
        )}
      </div>

      <div className={styles.cardSimple__content}>
        {titleText && (
          <h3 className={styles.cardSimple__title}>
            <CoreTextMarkdown>{titleText}</CoreTextMarkdown>
          </h3>
        )}
        {displayPrice && (
          <CorePrice
            data={displayPrice}
            showPrefix={true}
            className={styles.cardSimple__price}
          />
        )}
      </div>
    </div>
  )
}
