'use client'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'
import {
  useBookingSetCurrentPage,
  useBookingSetIntendedPage,
  useBookingWithCart
} from '../../../../features/booking'
import type { BookingWizardPage } from '../../config'
import {
  bookingWizardConfig,
  isPageBlockedByRules,
  isPageDataComplete
} from '../../config'
import styles from './style.module.scss'

export const ProgressBar: React.FC = () => {
  const t = useTranslations('booking_wizard.pages')
  const tProgressBar = useTranslations('booking_wizard.progress_bar')
  const pathname = usePathname()
  const { booking, cart } = useBookingWithCart()
  const { mutate: setCurrentPage } = useBookingSetCurrentPage()
  const { mutate: setIntendedPage } = useBookingSetIntendedPage()
  const pages = bookingWizardConfig.pages.filter((page) => page.enabled)
  const currentPageIndex = pages.findIndex((page) => page.path === pathname)

  const blockCtx = useMemo(
    () => ({
      hasEventOrTrack: Boolean(booking?.event) || Boolean(booking?.track),
      insuranceSessions: cart.contents.insuranceSessions,
      hasOnlyRideAlongs: cart.contents.hasOnlyRideAlongs
    }),
    [
      booking?.event,
      booking?.track,
      cart.contents.insuranceSessions,
      cart.contents.hasOnlyRideAlongs
    ]
  )

  const handlePageClick = useCallback(
    (page: BookingWizardPage) => {
      setIntendedPage(page.id)
      setCurrentPage(page.id)
    },
    [setIntendedPage, setCurrentPage]
  )

  const progressBarFillStyle = useMemo(() => {
    // Handle case when current page is not in enabled pages list (e.g., /booking)
    if (currentPageIndex < 0) {
      return { transform: 'translateX(-100%)' }
    }
    const alpha = currentPageIndex + 1 === pages.length ? 1 : 0.5

    return {
      transform: `translateX(${((currentPageIndex + alpha) / pages.length) * 100 - 100}%)`
    }
  }, [currentPageIndex, pages.length])

  return (
    <nav className={styles.progressBar} aria-label={tProgressBar('aria_label')}>
      <div className={styles.progressBar__bar}>
        <div
          className={styles.progressBar__bar__fill}
          style={progressBarFillStyle}
        />
      </div>

      <ol className={styles.progressBar__list}>
        {pages.map((page, index) => {
          const pageId = page.id
          const isActive = page.path === pathname
          const isCompleted = isPageDataComplete(pageId, booking)
          const isBlocked = isPageBlockedByRules(pageId, blockCtx)
          const isAccessible =
            !isBlocked &&
            ((currentPageIndex >= 0 && index <= currentPageIndex) ||
              isCompleted)
          const title = t(`${pageId}.progress_bar.title`)

          return (
            <li
              key={pageId}
              className={clsx(
                styles.progressBar__list__item,
                isActive && styles['progressBar__list__item--active'],
                isCompleted && styles['progressBar__list__item--completed']
              )}
            >
              {isAccessible ? (
                <button
                  type="button"
                  onClick={() => {
                    handlePageClick(page)
                  }}
                  aria-current={isActive ? 'step' : undefined}
                  className={clsx(
                    styles.progressBar__item,
                    styles['progressBar__item--link']
                  )}
                >
                  <span>{title}</span>
                </button>
              ) : (
                <span className={styles.progressBar__item}>
                  <span>{title}</span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
