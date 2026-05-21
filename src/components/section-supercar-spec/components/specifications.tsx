import { type FC, memo } from 'react'
import { isNotEmpty } from '../../../core/typescript/guards'
import styles from '../style.module.scss'
import { SupercarSpecButton } from './button'
import type { SpecificationData, SpecificationTranslations } from './types'

type Props = {
  data: SpecificationData
  translations: SpecificationTranslations
  showButton?: boolean
}

export const SupercarSpecifications: FC<Props> = memo(
  ({ data, translations: t, showButton = true }) => {
    const { topSpeed, horsepower, maxParticipantHeight, zeroToSixty, value } =
      data

    return (
      <div className={styles.specifications}>
        <ul className={styles.specifications__list}>
          {isNotEmpty(topSpeed) && (
            <li className={styles.specification}>
              <span className={styles.specification__label}>{t.top_speed}</span>
              <strong className={styles.specification__value}>
                {topSpeed}
              </strong>
            </li>
          )}
          {isNotEmpty(horsepower) && (
            <li className={styles.specification}>
              <span className={styles.specification__label}>
                {t.horsepower}
              </span>
              <strong className={styles.specification__value}>
                {horsepower}
              </strong>
            </li>
          )}
          {isNotEmpty(maxParticipantHeight) && (
            <li className={styles.specification}>
              <span className={styles.specification__label}>
                {t.max_participant_height}
              </span>
              <strong className={styles.specification__value}>
                {maxParticipantHeight}
              </strong>
            </li>
          )}
          {isNotEmpty(zeroToSixty) && (
            <li className={styles.specification}>
              <span className={styles.specification__label}>
                {t.zero_to_sixty}
              </span>
              <strong className={styles.specification__value}>
                {zeroToSixty}
              </strong>
            </li>
          )}
          {isNotEmpty(value) && (
            <li className={styles.specification}>
              <span className={styles.specification__label}>{t.value}</span>
              <strong className={styles.specification__value}>{value}</strong>
            </li>
          )}
          {showButton && (
            <li className={styles.desktop}>
              <SupercarSpecButton text={t.view_specs} />
            </li>
          )}
        </ul>

        {showButton && (
          <SupercarSpecButton className={styles.mobile} text={t.view_specs} />
        )}
      </div>
    )
  }
)

SupercarSpecifications.displayName = 'SupercarSpecifications'
