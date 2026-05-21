'use client'
import clsx from 'clsx'
import type { FC, ReactNode } from 'react'
import type { SectionConfigFragment } from '../../../core/dato/fragments/section-config.typegen'
import { getSectionConfigClasses } from '../../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../../utils/get-section-config-styles'
import { CoreIcon } from '../../core-icon'
import { useAnnouncementBar } from '../../global-header/context/header-context'
import styles from '../style.module.scss'

export type AnnouncementBarWrapperProps = {
  config: SectionConfigFragment | null | undefined
  id?: string
  children: ReactNode
}

export const AnnouncementBarWrapper: FC<AnnouncementBarWrapperProps> = ({
  config,
  id,
  children
}) => {
  const { isAnnouncementBarOpen, setIsAnnouncementBarOpen } =
    useAnnouncementBar()

  const handleClose = () => {
    setIsAnnouncementBarOpen(false)
  }

  return (
    <div
      id={id}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles),
        !isAnnouncementBarOpen && styles['section--closed']
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-announcement-bar"
    >
      {children}
      <button
        type="button"
        className={styles.section__close}
        onClick={handleClose}
      >
        <CoreIcon icon="close" />
      </button>
    </div>
  )
}
