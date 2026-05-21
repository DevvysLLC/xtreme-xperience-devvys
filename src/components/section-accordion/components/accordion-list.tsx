'use client'
import type { FC } from 'react'
import { useMediaQuery } from '../../../core/viewport/use-media-query'
import { CoreAccordion } from '../../core-accordion'
import type { SectionAccordionFragment } from '../section-accordion.typegen'
import styles from '../style.module.scss'

export type AccordionListProps = {
  accordion: SectionAccordionFragment['accordion']
  accordionId: string
}

export const AccordionList: FC<AccordionListProps> = ({
  accordion,
  accordionId
}) => {
  // Hide inline media on desktop (shown in separate panel instead)
  // Must match sg.min(laptopSmall) in style.module.scss (1280px)
  const isDesktop = useMediaQuery('(min-width: 1280px)')

  return (
    <div className={styles.accordion}>
      {accordion.map((item) => (
        <CoreAccordion
          key={item.id}
          data={item}
          name={accordionId}
          hideMedia={isDesktop}
        />
      ))}
    </div>
  )
}
