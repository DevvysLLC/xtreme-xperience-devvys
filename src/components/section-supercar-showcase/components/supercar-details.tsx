import clsx from 'clsx'
import type { FC } from 'react'
import { isImage } from '../../../core/typescript/guards'
import { getRecordLink } from '../../../utils/get-record-link'
import { CoreCta } from '../../core-cta'
import { CoreIcon } from '../../core-icon'
import { CoreImage } from '../../core-image'
import { CorePrice } from '../../core-price'
import type { SectionSupercarShowcaseFragment } from '../section-supercar-showcase.typegen'
import styles from '../style.module.scss'

type Supercar = SectionSupercarShowcaseFragment['supercars'][number]

export type SupercarDetailsProps = {
  data: Supercar
  mode?: string | null
  translations: {
    topSpeed: string
    horsepower: string
    zeroToSixty: string
    startingAt: string
    exploreCar: string
  }
}

export const SupercarDetails: FC<SupercarDetailsProps> = ({
  data,
  mode,
  translations
}) => {
  const { model: activeModel, config: activeConfig } = data
  const isMultiCar = activeModel?.packageType === 'multi'

  return (
    <div
      className={clsx(styles.details, isMultiCar && styles['details--multi'])}
    >
      {/* 1. Brand/Model Title & Logo */}
      <div className={styles.details__content}>
        {activeModel?.logoMaker && isImage(activeModel.logoMaker) && (
          <div className={styles.details__content__logo}>
            <CoreImage
              data={activeModel.logoMaker}
              className={styles.details__content__logo__image}
            />
          </div>
        )}
        <h3 className={styles.details__content__model}>
          {activeModel?.make}
          <strong>
            {isMultiCar ? activeModel?.title : activeModel?.model}
          </strong>
        </h3>
      </div>

      {/* 2. Starting Price */}
      {activeModel?.displayPrice && (
        <div className={styles.details__price}>
          <span className={styles.details__price__label}>
            {translations.startingAt}
          </span>
          <span className={styles.details__price__value}>
            <CorePrice data={activeModel.displayPrice} />
          </span>
        </div>
      )}

      {/* 3. Specs / Stats (only for single cars) */}
      {!isMultiCar && (
        <div className={styles.details__specs}>
          {activeModel?.topSpeed && (
            <div className={styles.details__spec}>
              <span className={styles.details__spec__label}>
                <span className={styles.details__spec__icon}>
                  <CoreIcon icon="speed" />
                </span>
                <span className={styles.details__spec__label__text}>
                  {translations.topSpeed}
                </span>
              </span>
              <span className={styles.details__spec__value}>
                {activeModel.topSpeed}
              </span>
            </div>
          )}
          {activeModel?.horsepower && (
            <div className={styles.details__spec}>
              <span className={styles.details__spec__label}>
                <span className={styles.details__spec__icon}>
                  <CoreIcon icon="horsepower" />
                </span>
                <span className={styles.details__spec__label__text}>
                  {translations.horsepower}
                </span>
              </span>
              <span className={styles.details__spec__value}>
                {activeModel.horsepower}
              </span>
            </div>
          )}
          {activeModel?.zeroToSixty && (
            <div className={styles.details__spec}>
              <span className={styles.details__spec__label}>
                <span className={styles.details__spec__icon}>
                  <CoreIcon icon="mph" />
                </span>
                <span className={styles.details__spec__label__text}>
                  {translations.zeroToSixty}
                </span>
              </span>
              <span className={styles.details__spec__value}>
                {activeModel.zeroToSixty}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 4. Explore Car CTA */}
      {activeConfig?.handle && (
        <div className={styles.details__cta}>
          <CoreCta
            href={getRecordLink({ handle: activeConfig.handle }, 'supercar')}
            text={translations.exploreCar}
            layoutType="button"
            styleType={mode === 'black' ? 'white' : 'black'}
            sizeType="medium"
          />
        </div>
      )}
    </div>
  )
}
