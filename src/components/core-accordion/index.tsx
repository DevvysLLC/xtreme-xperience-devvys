'use client'
import { type FC, memo, useCallback, useEffect, useState } from 'react'
import { isImage, isVideo } from '../../core/typescript/guards'
import { CoreIcon } from '../core-icon'
import { CoreImage } from '../core-image'
import { CoreTextMarkdown } from '../core-text-markdown'
import { CoreVideo } from '../core-video'
import { AccordionGroupProvider, useAccordionGroup } from './accordion-context'
import type { CoreAccordionFragment } from './core-accordion.typegen'
import styles from './style.module.scss'

export { AccordionGroupProvider, useAccordionGroup }

export type Props = {
  data: CoreAccordionFragment
  open?: boolean
  name?: string
  hideMedia?: boolean | null
}

export const CoreAccordion: FC<Props> = memo(function CoreAccordion({
  data,
  ...props
}) {
  const { title, body, media } = data
  const { open: _open, name, hideMedia = false } = props

  const accordionGroup = useAccordionGroup()
  const accordionId = data.id

  // Determine if this accordion is open
  // Priority: context state > initial open prop > false
  const isOpenInGroup = accordionGroup?.openId === accordionId
  const [localOpen, setLocalOpen] = useState(_open ?? false)
  const open = accordionGroup && name ? isOpenInGroup : localOpen

  // Handle initial open state when no context
  useEffect(() => {
    if (!accordionGroup && _open !== undefined) {
      setLocalOpen(_open)
    }
  }, [_open, accordionGroup])

  const handleToggle = useCallback(() => {
    if (accordionGroup && name) {
      // Use context to manage group state
      // If currently open, close it. Otherwise, open this one (which closes others)
      accordionGroup.setOpenId(open ? null : accordionId)
    } else {
      // Fallback to local state if no context
      setLocalOpen((prev) => !prev)
    }
  }, [accordionGroup, name, open, accordionId])

  if (!title || !body) {
    return null
  }

  return (
    <div className={styles.accordion} data-open={open}>
      <button
        type="button"
        id={`accordion-title-${data.id}`}
        className={styles.accordion__summary}
        aria-expanded={open}
        aria-controls={`accordion-content-${data.id}`}
        onClick={handleToggle}
      >
        {title}

        <CoreIcon icon={open ? 'minus' : 'plus'} />
      </button>

      <div
        id={`accordion-content-${data.id}`}
        className={styles.accordion__body}
        aria-labelledby={`accordion-title-${data.id}`}
      >
        <div className={styles.accordion__container}>
          <div className={styles.accordion__inner}>
            {!hideMedia && (
              <div className={styles.accordion__media}>
                {media && isVideo(media) && <CoreVideo data={media} />}

                {media && isImage(media) && <CoreImage data={media} />}
              </div>
            )}

            <div className={styles.accordion__content}>
              <CoreTextMarkdown type="rte">{body}</CoreTextMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
