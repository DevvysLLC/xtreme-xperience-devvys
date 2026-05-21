'use client'

import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { logger } from '../../../../core/logger/logger'
import {
  useBookingPageMetadata,
  useBookingPageRideAlong,
  useBookingRequestBackNavigation,
  useBookingWithCart
} from '../../../../features/booking'
import { useCartAdd } from '../../../../features/cart'
import { useToast } from '../../../../features/toast'
import { RocketRezProductType } from '../../../../io/schemas'
import type { RocketRezAddLineItem } from '../../../../io/types'
import { findMatchingEarliestEventScheduleForRateId } from '../../../../utils/find-matching-earliest-event-schedule-for-rate-id'
import { getRideAlongCartMetadata } from '../../../../utils/get-ride-along-cart-metadata'
import { BookingLayout } from '../../components/booking-layout'
import { PageFooter } from '../../components/page-footer'
import { PageHeader } from '../../components/page-header'
import { RideAlongOptions } from '../../components/ride-along-options'
import { useBookingWizardState } from '../../context'

export const RideAlongPage = () => {
  const t = useTranslations('booking_wizard.pages.ride_along')
  const { booking, cart, isLoading } = useBookingWithCart()
  const { showToast } = useToast()
  const pathname = usePathname()
  const { state } = useBookingWizardState()
  const pageMetadata = useBookingPageMetadata({
    pages: state.configData?.pages ?? null
  })
  const pageHook = useBookingPageRideAlong()
  const { mutate: requestBackNavigation } = useBookingRequestBackNavigation()
  const { mutateAsync, isPending } = useCartAdd()
  const runOnceRef = useRef(true)

  const { contents } = cart ?? {}
  const { hasCars, totalCars, hasOnlyRideAlongs } = contents ?? {}
  const footerSubtitle = hasCars
    ? t('footer.subtitle.cars_added', { count: totalCars })
    : t('footer.subtitle.select_car')

  const eventData = state.eventData
  const selectedDayDate = state.selectedDayDate

  const selectedDaySchedules = useMemo(() => {
    if (!eventData?.schedules || !selectedDayDate) {
      return null
    }
    return (
      eventData.schedules.find(
        (schedule) => schedule.date === selectedDayDate
      ) ?? null
    )
  }, [eventData?.schedules, selectedDayDate])

  // Originally we built ride-along to be an addon
  // we now need this to be a full event booking while keeping the UI the same
  // to acheive this override the add to cart in the addoncard
  // using the ID in the card we find and build an atc payload for the first available timeslot
  const handleAddToCart = useCallback(
    async (rocketRezId: number) => {
      if (isPending) {
        return
      }

      const schedule = findMatchingEarliestEventScheduleForRateId(
        selectedDaySchedules ? [selectedDaySchedules] : null,
        rocketRezId,
        cart?.metadata ?? []
      )

      if (!schedule) {
        logger.warn(
          { rocketRezId, selectedDay: selectedDayDate },
          'RideAlongPage: No available schedule found for rate'
        )
        showToast({
          message: t('notifications.not_available'),
          type: 'error'
        })
        return
      }

      const eventId = state.selectedEvent?.model?.rocketRezId
      if (!eventId) {
        logger.error(
          { eventId },
          'RideAlongPage: No event ID found in booking state'
        )
        showToast({
          message: t('notifications.unable_to_add'),
          type: 'error'
        })
        return
      }

      const seatType = schedule.seatTypes?.[0]
      const rate = seatType?.rates?.[0]

      if (!seatType || !rate) {
        logger.error(
          { schedule },
          'RideAlongPage: Schedule missing seatType or rate'
        )
        return
      }

      const lineItem: RocketRezAddLineItem = {
        id: Number(eventId),
        type: RocketRezProductType.EVENT,
        quantity: 1,
        scheduleId: schedule.id ?? null,
        rateId: rate.id,
        seatTypeId: seatType.id ?? null,
        rateType: rate.rateTypes[0]?.type ?? null
      }

      const date = selectedDayDate ?? ''
      const isoDate =
        date && schedule.startTime ? `${date}T${schedule.startTime}` : date

      const metadata = getRideAlongCartMetadata(
        state.configData,
        state.selectedEvent?.id ?? null,
        rate.id,
        lineItem,
        isoDate
      )

      logger.info(
        { lineItem, metadata, schedule },
        'RideAlongPage: Adding ride-along to cart'
      )

      try {
        await mutateAsync({
          request: { lineItems: [lineItem] },
          metadata
        })

        showToast({
          message: t('notifications.added_to_cart'),
          type: 'success'
        })
      } catch (error) {
        logger.error(
          { error, lineItem },
          'RideAlongPage: Error adding ride-along to cart'
        )
        showToast({
          message: t('notifications.error_adding_to_cart'),
          type: 'error'
        })
      }
    },
    [
      isPending,
      selectedDaySchedules,
      selectedDayDate,
      state.configData,
      state.selectedEvent?.id,
      state.selectedEvent?.model?.rocketRezId,
      cart?.metadata,
      mutateAsync,
      showToast,
      t
    ]
  )

  const handleSubmit = useCallback(async () => {
    const pageIsValid = pageHook.isValid()
    try {
      await pageHook.save({
        value: {
          selected: true,
          isValid: pageIsValid,
          isSubmitted: true
        },
        pageIsValid,
        userHasSubmitted: true
      })
    } catch (error) {
      logger.error({ error }, 'RideAlongPage: Error saving page state')
      showToast({
        message: t('notifications.error_saving'),
        type: 'error'
      })
    }
  }, [pageHook, showToast, t])

  const handleBack = useCallback(() => {
    requestBackNavigation({ fromPath: pathname })
  }, [pathname, requestBackNavigation])

  const title = pageMetadata?.title ?? t('title')
  const description = pageMetadata?.description ?? t('description')

  useEffect(() => {
    if (booking?.error) {
      showToast({ message: booking.error, type: 'error' })
    }
  }, [booking?.error, showToast])

  useEffect(() => {
    const handleSkipRideAlongAsync = async () => {
      if (isLoading) {
        return
      }
      if (!runOnceRef.current) {
        return
      }
      // Set ref to false after initial determination, regardless of whether skip occurs.
      // This prevents unexpected navigation if cart changes later (e.g., user removes cars via sidebar).
      runOnceRef.current = false

      if (hasOnlyRideAlongs) {
        logger.info(
          'RideAlongPage: Skipping ride-along page (hasOnlyRideAlongs)'
        )
        await pageHook.skipRideAlong()
      }
    }
    handleSkipRideAlongAsync()
  }, [pageHook, hasOnlyRideAlongs, isLoading])

  return (
    <BookingLayout>
      <section>
        <PageHeader title={title} description={description} />

        <RideAlongOptions onAddToCart={handleAddToCart} />

        <PageFooter
          title={t('footer.title')}
          subtitle={footerSubtitle}
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
