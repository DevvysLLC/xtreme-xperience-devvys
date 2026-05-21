'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { type FC, type ReactNode, useState } from 'react'
import type { SectionConfigFragment } from '../../../../../core/dato/fragments/section-config.typegen'
import { getSectionConfigClasses } from '../../../../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../../../../utils/get-section-config-styles'
import { CoreIcon } from '../../../../core-icon'
import styles from '../style.module.scss'

export type BookingAnnouncementBarWrapperProps = {
  config: SectionConfigFragment | null | undefined
  id?: string
  children: ReactNode
}

export const BookingAnnouncementBarWrapper: FC<
  BookingAnnouncementBarWrapperProps
> = ({ config, id, children }) => {
  const t = useTranslations('booking_wizard.booking_announcement')
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <div
      id={id}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles),
        !isOpen && styles['section--closed']
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="booking-announcement-bar"
    >
      {children}
      <button
        type="button"
        className={styles.section__close}
        onClick={handleClose}
        aria-label={t('button.close')}
      >
        <CoreIcon icon="close" />
      </button>
    </div>
  )
}
