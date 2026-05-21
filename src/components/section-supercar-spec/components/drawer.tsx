'use client'
import { type FC, memo } from 'react'
import { ROUTES } from '../../../config/routes'
import type { SupercarModelFragment } from '../../../core/dato/fragments/supercar-model.typegen'
import { isImage } from '../../../core/typescript/guards'
import { CoreCta } from '../../core-cta'
import { CoreImage } from '../../core-image'
import { CorePrice } from '../../core-price'
import { CoreTextMarkdown } from '../../core-text-markdown'
import { Drawer } from '../../global-drawer'
import styles from '../style.module.scss'
import type { DrawerTranslations } from './types'

type Props = {
  data: SupercarModelFragment
  translations: DrawerTranslations
}
export const SupercarFullSpecDrawer: FC<Props> = memo(
  ({ data, translations: t }) => {
    const {
      engine,
      topSpeed,
      horsepower,
      maxParticipantHeight,
      torque,
      zeroToSixty,
      weight,
      origin,
      transmission,
      vehicleLayout,
      value,
      displayPrice,
      specModalImage,
      specModalDescription
    } = data

    return (
      <Drawer title={t.title} id="supercar-full-spec-drawer">
        <div className={styles.drawer}>
          {specModalImage && isImage(specModalImage) && (
            <div className={styles.drawer__media}>
              <CoreImage data={specModalImage} />
            </div>
          )}

          {specModalDescription && (
            <div className={styles.drawer__description}>
              <CoreTextMarkdown type="rte">
                {specModalDescription}
              </CoreTextMarkdown>
            </div>
          )}

          <ul className={styles.drawer__details}>
            {engine && (
              <li className={styles.drawer__detail}>
                <strong className={styles.drawer__detail__label}>
                  {t.engine}
                </strong>
                <span className={styles.drawer__detail__value}>{engine}</span>
              </li>
            )}
            {topSpeed && (
              <li className={styles.drawer__detail}>
                <strong className={styles.drawer__detail__label}>
                  {t.top_speed}
                </strong>
                <span className={styles.drawer__detail__value}>{topSpeed}</span>
              </li>
            )}
            {horsepower && (
              <li className={styles.drawer__detail}>
                <strong className={styles.drawer__detail__label}>
                  {t.horsepower}
                </strong>
                <span className={styles.drawer__detail__value}>
                  {horsepower}
                </span>
              </li>
            )}
            {maxParticipantHeight && (
              <li className={styles.drawer__detail}>
                <strong className={styles.drawer__detail__label}>
                  {t.max_participant_height}
                </strong>
                <span className={styles.drawer__detail__value}>
                  {maxParticipantHeight}
                </span>
              </li>
            )}
            {torque && (
              <li className={styles.drawer__detail}>
                <strong className={styles.drawer__detail__label}>
                  {t.torque}
                </strong>
                <span className={styles.drawer__detail__value}>{torque}</span>
              </li>
            )}
            {zeroToSixty && (
              <li className={styles.drawer__detail}>
                <strong className={styles.drawer__detail__label}>
                  {t.zero_to_sixty}
                </strong>
                <span className={styles.drawer__detail__value}>
                  {zeroToSixty}
                </span>
              </li>
            )}
            {weight && (
              <li className={styles.drawer__detail}>
                <strong className={styles.drawer__detail__label}>
                  {t.weight}
                </strong>
                <span className={styles.drawer__detail__value}>{weight}</span>
              </li>
            )}
            {origin && (
              <li className={styles.drawer__detail}>
                <strong className={styles.drawer__detail__label}>
                  {t.origin}
                </strong>
                <span className={styles.drawer__detail__value}>{origin}</span>
              </li>
            )}
            {transmission && (
              <li className={styles.drawer__detail}>
                <strong className={styles.drawer__detail__label}>
                  {t.transmission}
                </strong>
                <span className={styles.drawer__detail__value}>
                  {transmission}
                </span>
              </li>
            )}
            {vehicleLayout && (
              <li className={styles.drawer__detail}>
                <strong className={styles.drawer__detail__label}>
                  {t.vehicle_layout}
                </strong>
                <span className={styles.drawer__detail__value}>
                  {vehicleLayout}
                </span>
              </li>
            )}
            {value && (
              <li className={styles.drawer__detail}>
                <strong className={styles.drawer__detail__label}>
                  {t.value}
                </strong>
                <span className={styles.drawer__detail__value}>{value}</span>
              </li>
            )}
            {displayPrice && (
              <li className={styles.drawer__detail}>
                <strong className={styles.drawer__detail__label}>
                  {t.starting_price}
                </strong>
                <span className={styles.drawer__detail__value}>
                  <CorePrice data={displayPrice} />
                </span>
              </li>
            )}
          </ul>

          <div className={styles.drawer__actions}>
            <CoreCta
              href={ROUTES.BOOKING.HOME}
              className={styles.drawer__button}
              layoutType="button"
              sizeType="medium"
              styleType="black"
              text={t.book_now}
            />

            <CoreCta
              href={ROUTES.FRONTEND.GIFT_CARDS}
              className={styles.drawer__link}
              layoutType="underline"
              sizeType="medium"
              styleType="black"
              text={t.give_as_gift}
            />
          </div>
        </div>
      </Drawer>
    )
  }
)

SupercarFullSpecDrawer.displayName = 'SupercarFullSpecDrawer'
