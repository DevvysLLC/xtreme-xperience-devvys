'use client'
import type { FC } from 'react'
import { isImage, isVideo } from '../../../core/typescript/guards'
import { useAccordionGroup } from '../../core-accordion'
import { CoreImage } from '../../core-image'
import { CoreVideo } from '../../core-video'
import type { SectionAccordionFragment } from '../section-accordion.typegen'
import styles from '../style.module.scss'

export type AccordionMediaProps = {
  accordion: SectionAccordionFragment['accordion']
}

export const AccordionMedia: FC<AccordionMediaProps> = ({ accordion }) => {
  const accordionGroup = useAccordionGroup()
  const openId = accordionGroup?.openId ?? null
  const activeAccordion = openId
    ? accordion.find((item) => item.id === openId)
    : null
  const defaultMedia = accordion.find((item) => item.media)?.media ?? null
  const activeMedia = activeAccordion ? activeAccordion.media : defaultMedia

  if (!activeMedia) {
    return null
  }

  return (
    <>
      {isVideo(activeMedia) && (
        <CoreVideo
          data={activeMedia}
          layout="fill"
          controlsClassName={styles.media__controls}
        />
      )}
      {isImage(activeMedia) && <CoreImage data={activeMedia} layout="fill" />}
    </>
  )
}
