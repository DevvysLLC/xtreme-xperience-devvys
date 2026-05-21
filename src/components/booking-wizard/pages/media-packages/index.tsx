'use client'

import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect } from 'react'
import { logger } from '../../../../core/logger/logger'
import {
  useBookingPageMediaPackages,
  useBookingPageMetadata,
  useBookingRequestBackNavigation,
  useBookingWithCart
} from '../../../../features/booking'
import { useToast } from '../../../../features/toast'
import { BookingLayout } from '../../components/booking-layout'
import { MediaOptions } from '../../components/media-options'
import { PageFooter } from '../../components/page-footer'
import { PageHeader } from '../../components/page-header'
import { useBookingWizardState } from '../../context'

export const MediaPackagesPage = () => {
  const t = useTranslations('booking_wizard.pages.media_packages')
  const { booking, cart } = useBookingWithCart()
  const { showToast } = useToast()
  const pathname = usePathname()
  const { mutate: requestBackNavigation } = useBookingRequestBackNavigation()
  const { isValid, set } = useBookingPageMediaPackages()
  const { state } = useBookingWizardState()
  const pageMetadata = useBookingPageMetadata({
    pages: state.configData?.pages ?? null
  })
  const { hasCars, totalCars } = cart.contents
  const footerSubtitle = hasCars
    ? t('footer.subtitle.cars_added', { count: totalCars })
    : t('footer.subtitle.select_car')

  const handleSubmit = useCallback(async () => {
    const pageIsValid = isValid()
    try {
      await set({
        value: {
          selected: true,
          isValid: pageIsValid,
          isSubmitted: true
        },
        pageIsValid,
        userHasSubmitted: true
      })
    } catch (error) {
      logger.error({ error }, 'media-packages-page.onSubmit: error')
      showToast({ message: t('notifications.error_saving'), type: 'error' })
    }
  }, [isValid, set, showToast, t])

  const title = pageMetadata?.title ?? t('title')
  const description = pageMetadata?.description ?? t('description')

  const handleBack = useCallback(() => {
    requestBackNavigation({ fromPath: pathname })
  }, [pathname, requestBackNavigation])

  useEffect(() => {
    if (booking?.error) {
      showToast({ message: booking.error, type: 'error' })
    }
  }, [booking?.error, showToast])

  return (
    <BookingLayout>
      <section>
        <PageHeader title={title} description={description} />
        <MediaOptions />
        <PageFooter
          title={t('footer.title')}
          subtitle={footerSubtitle}
          isPending={false}
          onBack={handleBack}
          onSubmit={handleSubmit}
          backText={t('button.back')}
          submitText={t('button.continue')}
          savingText={t('button.saving')}
        />
      </section>
    </BookingLayout>
  )
}
