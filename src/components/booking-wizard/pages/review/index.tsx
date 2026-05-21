'use client'

import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { logger } from '../../../../core/logger/logger'
import {
  useBookingPageReview,
  useBookingRequestBackNavigation
} from '../../../../features/booking'
import { useToast } from '../../../../features/toast'
import { CartPage } from '../../../global-cart'
import { BookingLayout } from '../../components/booking-layout'
import { PageFooter } from '../../components/page-footer'

export const ReviewPage = () => {
  const t = useTranslations('booking_wizard.pages.review')
  const pathname = usePathname()
  const pageHook = useBookingPageReview()
  const { mutate: requestBackNavigation } = useBookingRequestBackNavigation()
  const { showToast } = useToast()

  const handleSubmit = async () => {
    const pageIsValid = pageHook.isValid()
    try {
      await pageHook.save({
        value: {
          isValid: pageIsValid,
          isSubmitted: true
        },
        pageIsValid,
        userHasSubmitted: true
      })
    } catch (error) {
      logger.error({ error }, 'review-page.onSubmit: error')
      showToast({ message: t('notifications.error_saving'), type: 'error' })
    }
  }

  const handleBack = () => {
    requestBackNavigation({ fromPath: pathname })
  }

  return (
    <BookingLayout>
      <section>
        <CartPage showActions={false} />
        <PageFooter
          title={t('footer.title')}
          isPending={false}
          onBack={handleBack}
          backText={t('button.back')}
          submitText={t('button.continue')}
          savingText={t('button.saving')}
          onSubmit={handleSubmit}
        />
      </section>
    </BookingLayout>
  )
}
