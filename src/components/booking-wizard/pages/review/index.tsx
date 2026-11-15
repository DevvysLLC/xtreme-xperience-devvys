'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ROUTES } from '../../../../config/routes'
import { logger } from '../../../../core/logger/logger'
import {
  useBookingPageReview,
  useBookingRequestBackNavigation,
  useBookingSetIntendedPage
} from '../../../../features/booking'
import { useCartRecreateHold } from '../../../../features/cart'
import { useToast } from '../../../../features/toast'
import { CartPage } from '../../../global-cart'
import { BookingLayout } from '../../components/booking-layout'
import { PageFooter } from '../../components/page-footer'

export const ReviewPage = () => {
  const t = useTranslations('booking_wizard.pages.review')
  const pathname = usePathname()
  const router = useRouter()
  const pageHook = useBookingPageReview()
  const { mutate: requestBackNavigation } = useBookingRequestBackNavigation()
  const { mutateAsync: setIntendedPage } = useBookingSetIntendedPage()
  const { recreateHold, isRecreating } = useCartRecreateHold()
  const { showToast } = useToast()

  const handleSubmit = async () => {
    try {
      const holdResult = await recreateHold()
      if (holdResult.status === 'sold_out') {
        showToast({
          message: 'That time just sold out.',
          type: 'error'
        })
        try {
          if (holdResult.seatTypeId) {
            sessionStorage.setItem(
              'pendingEditSeatTypeId',
              String(holdResult.seatTypeId)
            )
          }
          if (holdResult.failedLineItem?.id != null) {
            sessionStorage.setItem(
              'pendingEditLineItemId',
              String(holdResult.failedLineItem.id)
            )
          }
        } catch (storageError) {
          logger.warn(
            { storageError },
            'review-page.handleSubmit.sessionStorage.error'
          )
        }
        await setIntendedPage('date_and_car')
        router.push(ROUTES.BOOKING.DATE_AND_CAR)
        return
      }

      if (holdResult.status === 'available' && holdResult.priceChanged) {
        showToast({
          message:
            'The price in your cart has been updated. Please review your updated total before continuing to payment.',
          type: 'info'
        })
        return
      }
    } catch (recreateError) {
      logger.error({ recreateError }, 'review-page.recreateHold: error')
    }

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
        <CartPage showActions={false} title="MY CART" />
        <PageFooter
          title={t('footer.title')}
          isPending={isRecreating}
          onBack={handleBack}
          backText={t('button.back')}
          submitText="CHECKOUT"
          savingText={t('button.saving')}
          onSubmit={handleSubmit}
        />
      </section>
    </BookingLayout>
  )
}
