import clsx from 'clsx'
import type { FC } from 'react'
import { isImage } from '../../../core/typescript/guards'
import { CoreImage } from '../../core-image'
import type { SectionSupercarShowcaseFragment } from '../section-supercar-showcase.typegen'
import styles from '../style.module.scss'

type Supercar = SectionSupercarShowcaseFragment['supercars'][number]

export type ThumbnailProps = {
  data: Supercar
  className?: string
}

export const Thumbnail: FC<ThumbnailProps> = ({ data, className }) => {
  const { model: modelData } = data

  if (!modelData) {
    return null
  }

  const { thumbnail, showcaseThumbnail, make, model, title, packageType } =
    modelData

  const isMultiCar = packageType === 'multi'
  const image = showcaseThumbnail ?? thumbnail

  return (
    <div className={clsx(styles.thumbnail, className)}>
      <div className={styles.thumbnail__media}>
        {isImage(image) && (
          <CoreImage data={image} layout="fill" objectFit="contain" />
        )}
      </div>

      <div className={styles.thumbnail__content}>
        <h3 className={styles.thumbnail__title}>
          {!isMultiCar && <span className={styles.make}>{make}</span>}
          <strong className={styles.thumbnail__model}>
            {isMultiCar ? title : model}
          </strong>
        </h3>
      </div>
    </div>
  )
}
