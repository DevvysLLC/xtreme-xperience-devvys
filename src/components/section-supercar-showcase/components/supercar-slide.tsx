import type { FC } from 'react'
import { isImage } from '../../../core/typescript/guards'
import { CoreImage } from '../../core-image'
import type { SectionSupercarShowcaseFragment } from '../section-supercar-showcase.typegen'
import styles from '../style.module.scss'

type Supercar = SectionSupercarShowcaseFragment['supercars'][number]

export type SupercarSlideProps = {
  data: Supercar
}

export const SupercarSlide: FC<SupercarSlideProps> = ({ data }) => {
  const image = data.model?.showcaseThumbnail ?? data.model?.thumbnail

  if (!isImage(image)) {
    return null
  }

  return (
    <CoreImage data={image} className={styles.main__image} fadeInDuration={0} />
  )
}
