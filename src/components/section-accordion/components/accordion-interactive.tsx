'use client'
import type { FC, ReactNode } from 'react'
import { useMediaQuery } from '../../../core/viewport/use-media-query'
import { AccordionGroupProvider } from '../../core-accordion'
import type { SectionAccordionFragment } from '../section-accordion.typegen'
import styles from '../style.module.scss'
import { AccordionList } from './accordion-list'
import { AccordionMedia } from './accordion-media'

export type AccordionInteractiveProps = {
  accordion: SectionAccordionFragment['accordion']
  accordionId: string
  header: ReactNode
  ctas: ReactNode
}

/**
 * Client component that handles accordion interactivity.
 * Wraps accordion list and media in a shared context for state management.
 * Server-rendered content (header, CTAs) is passed as children.
 */
export const AccordionInteractive: FC<AccordionInteractiveProps> = ({
  accordion,
  accordionId,
  header,
  ctas
}) => {
  const firstAccordionId = accordion[0]?.id ?? null
  // Only render AccordionMedia on desktop to prevent duplicate media loading on mobile.
  // Must match sg.min(laptopSmall) in style.module.scss (1280px)
  const isDesktop = useMediaQuery('(min-width: 1280px)')

  return (
    <AccordionGroupProvider name={accordionId} defaultOpenId={firstAccordionId}>
      <div className={styles.content}>
        {header}
        <AccordionList accordion={accordion} accordionId={accordionId} />
        {ctas}
      </div>
      {isDesktop && (
        <div className={styles.media}>
          <AccordionMedia accordion={accordion} />
        </div>
      )}
    </AccordionGroupProvider>
  )
}
