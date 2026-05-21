'use client'

import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC, type ReactNode, useState } from 'react'
import { useBookingWithCart } from '../../../../features/booking'
import { CoreCta } from '../../../core-cta'
import { CoreIcon } from '../../../core-icon'
import { CartAside } from '../../../global-cart'
import type { SectionAnnouncementBarFragment } from '../../../section-announcement-bar/section-announcement-bar.typegen'
import { bookingWizardConfig } from '../../config'
import { useBookingWizardState } from '../../context'
import styles from '../../style.module.scss'
import { BookingAnnouncement } from '../booking-announcement'
import { ProgressBar } from '../progress-bar'

type Props = {
  children?: ReactNode
  className?: string
}

const isAnnouncementEnabled = (
  ann: SectionAnnouncementBarFragment | null | undefined
): ann is SectionAnnouncementBarFragment =>
  ann !== null &&
  (ann?.cards?.length ?? 0) > 0 &&
  ann?.config?.enabled !== false

export const BookingLayout: FC<Props> = ({ children, className }) => {
  const t = useTranslations('booking_wizard.cart')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const pathname = usePathname()
  const currentPage = bookingWizardConfig.pages.find((p) => p.path === pathname)
  const showCartAside = currentPage?.showCartAside ?? false
  const showAnnouncementBar = currentPage?.showAnnouncementBar ?? false
  const hasNoPaddings = currentPage?.hasNoPaddings ?? false
  const { cart, booking } = useBookingWithCart()
  const { state } = useBookingWizardState()

  const globalAnnouncement = state.configData?.bookingAnnouncement ?? null
  const trackAnnouncement = booking?.track?.model?.bookingAnnouncement ?? null
  const announcementData = isAnnouncementEnabled(globalAnnouncement)
    ? globalAnnouncement
    : isAnnouncementEnabled(trackAnnouncement)
      ? trackAnnouncement
      : null

  return (
    <div className={clsx(styles.wizard, className)}>
      <ProgressBar />
      {showAnnouncementBar && <BookingAnnouncement data={announcementData} />}

      <div className={styles.wizard__container}>
        <div
          className={clsx(
            styles.wizard__content,
            hasNoPaddings && styles['wizard__content--no-paddings']
          )}
        >
          {children}
        </div>

        {showCartAside && (
          <>
            <div className={styles.mobile}>
              <div
                className={clsx(
                  styles.popup,
                  isCartOpen && styles['popup--open']
                )}
              >
                <button
                  type="button"
                  className={styles.popup__title}
                  onClick={() => {
                    setIsCartOpen(!isCartOpen)
                  }}
                >
                  {t('title', {
                    count: cart.contents.totalItems.toString()
                  })}

                  <CoreIcon icon={isCartOpen ? 'close' : 'chevron-down'} />
                </button>

                <div
                  className={styles.popup__content}
                  aria-hidden={!isCartOpen}
                >
                  <CartAside />
                </div>

                <div className={styles.popup__actions}>
                  <CoreCta
                    text={t('continue')}
                    className={styles.popup__button}
                    href={null}
                    layoutType="button"
                    sizeType="small"
                    styleType="black"
                    onClick={() => {
                      setIsCartOpen(!isCartOpen)
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={clsx(styles.wizard__aside, styles.desktop)}>
              <CartAside />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
