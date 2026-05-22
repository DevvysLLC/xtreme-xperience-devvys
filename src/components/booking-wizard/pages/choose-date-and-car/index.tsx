'use client'

import { useForm } from '@tanstack/react-form'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { ROUTES } from '../../../../config/routes'
import { logger } from '../../../../core/logger/logger'
import {
  useBookingPageChooseDateAndCar,
  useBookingPageMetadata,
  useBookingRequestBackNavigation,
  useBookingResetAfter,
  useBookingWithCart
} from '../../../../features/booking'
import { useDialog } from '../../../../features/dialog'
import { useToast } from '../../../../features/toast'
import type { BookingCarLineItem } from '../../../../io/types'
import { formatEventDateRangeLong } from '../../../../utils/date-time'
import { getCartLineItemReadMetadataKey } from '../../../../utils/get-cart-line-item-metadata-key'
import { getSeatTypeIdWithOverride } from '../../../../utils/get-seat-type-id-with-override'
import { CoreCta } from '../../../core-cta'
import { CoreLoadingSpinner } from '../../../core-loading-spinner'
import { BookingLayout } from '../../components/booking-layout'
import { DateSelect } from '../../components/date-select'
import { DayTab } from '../../components/date-tab'
import { PageFooter } from '../../components/page-footer'
import { PageHeader } from '../../components/page-header'
import { SupercarOptions } from '../../components/supercar-options'
import { useBookingWizardState } from '../../context'
import styles from './style.module.scss'

export const DateAndCarPage = () => {
  const t = useTranslations('booking_wizard.pages.date_and_car')
  const { booking, cart } = useBookingWithCart()
  const { cartData, metadata, contents } = cart ?? {}
  const { hasCars, totalCars, totalSessions } = contents ?? {}
  const { state, setSelectedDayDate } = useBookingWizardState()
  const { showDialog } = useDialog()
  const { showToast } = useToast()
  const pathname = usePathname()
  const { mutate: requestBackNavigation } = useBookingRequestBackNavigation()
  const resetAfter = useBookingResetAfter()
  const pageHook = useBookingPageChooseDateAndCar()
  const pageMetadata = useBookingPageMetadata({
    pages: state.configData?.pages ?? null
  })

  const resolvedDefaultValues = useMemo(
    () =>
      pageHook.getDefaultFormValues({
        selectedDay: state.selectedDay,
        selectedEvent: state.selectedEvent,
        activeTabIndex: state.activeTabIndex ?? 0
      }),
    [pageHook, state.selectedDay, state.selectedEvent, state.activeTabIndex]
  )
  const resolvedDefaultValuesKey = useMemo(
    () => JSON.stringify(resolvedDefaultValues),
    [resolvedDefaultValues]
  )

  const form = useForm({
    defaultValues: resolvedDefaultValues,
    onSubmit: async ({ value }) => {
      logger.info({ value }, 'date-and-car-page.onSubmit')
      const carLineItems: BookingCarLineItem[] = []
      if (cartData?.lineItems && metadata) {
        for (const lineItem of cartData.lineItems) {
          const key = getCartLineItemReadMetadataKey({ lineItem })
          const itemMetadata = metadata.find((m) => m.key === key)
          if (itemMetadata?.type === 'car') {
            carLineItems.push({
              id: Number(lineItem.id),
              type: lineItem.type,
              quantity: lineItem.quantity,
              scheduleId: lineItem.scheduleId ?? null,
              rateId: lineItem.rateId ?? null,
              rateType: lineItem.rateType ?? null
            })
          }
        }
      }

      const formValue = {
        ...value,
        cars: carLineItems,
        selectedDate: state.selectedDayDate ?? null,
        selectedEvent: state.selectedEvent?.model?.rocketRezId ?? null,
        selectedDay: state.selectedDayDate ?? null,
        activeTabIndex: state.activeTabIndex ?? 0
      }

      const isValid = pageHook.isValid()

      try {
        await pageHook.save({
          value: formValue,
          pageIsValid: isValid,
          userHasSubmitted: true
        })
      } catch (error) {
        logger.error({ error, value }, 'date-and-car-page.onSubmit: error')
        showToast({ message: t('notifications.error_saving'), type: 'error' })
      }
    }
  })

  const formRef = useRef(form)
  formRef.current = form
  const lastAppliedDefaultValuesKeyRef = useRef(resolvedDefaultValuesKey)

  const submitButtonText = hasCars
    ? t('button.book_sessions', { count: totalSessions ?? 0 })
    : t('button.select_a_drive')

  const footerSubtitle = hasCars
    ? t('footer.subtitle.cars_added', { count: totalCars ?? 0 })
    : t('footer.subtitle.select_car')

  const locationTitle = state.selectedEvent?.model?.track?.model?.nickname ?? ''
  const locationHandle = state.selectedEvent?.model?.track?.config?.handle ?? ''
  const eventDateRange = formatEventDateRangeLong(
    state.selectedEvent?.model?.startDate,
    state.selectedEvent?.model?.endDate
  )
  const trackHref = locationHandle
    ? `${ROUTES.FRONTEND.TRACKS.LISTING}/${locationHandle}`
    : null

  const description = t.rich('description_dynamic', {
    link: (chunks) =>
      trackHref ? (
        <CoreCta
          href={trackHref}
          layoutType="underline"
          styleType="black"
          sizeType="small"
        >
          {chunks}
        </CoreCta>
      ) : (
        <>{chunks}</>
      ),
    location: locationTitle,
    date: eventDateRange
  })

  const title = pageMetadata?.title ?? t('title')
  const activeGroup =
    state.configData?.supercars?.[state.activeTabIndex ?? 0] ?? null
  const selectedEventId = state.selectedEvent?.model?.rocketRezId ?? null
  const resolvedRateIds = useMemo(() => {
    const mappedRateIds =
      activeGroup?.supercars?.map((supercar) =>
        getSeatTypeIdWithOverride({
          defaultSeatTypeId: supercar.rocketRezSeatTypeId,
          overrides: supercar.rocketRezSeatTypeIdOverrides,
          selectedEventId
        })
      ) ?? []

    return Array.from(new Set(mappedRateIds))
  }, [activeGroup?.supercars, selectedEventId])

  const handleBack = useCallback(() => {
    requestBackNavigation({ fromPath: pathname })
  }, [pathname, requestBackNavigation])

  const handleDateSelect = (date: string) => {
    const matchingDay = state.eventData?.schedules?.find(
      (day) => day.date === date
    )
    if (!matchingDay) {
      return
    }

    const isNewDay = state.selectedDayDate !== date

    if (hasCars && isNewDay) {
      showDialog({
        translations: {
          title: t('change_dialog.title'),
          description: t('change_dialog.description'),
          confirmButton: t('change_dialog.button.confirm'),
          cancelButton: t('change_dialog.button.cancel')
        },
        onConfirm: async () => {
          try {
            await resetAfter.mutateAsync({ pageId: 'location' })
            setSelectedDayDate(matchingDay.date ?? null)
          } catch (error) {
            logger.error(
              { error, date },
              'date-and-car-page.handleDateSelect.onConfirm.error'
            )
          }
        }
      })
      return
    }

    setSelectedDayDate(matchingDay.date ?? null)
  }

  // Update isValid based on cart contents (guarded write)
  useEffect(() => {
    const isValid = pageHook.isValid()
    const current = formRef.current.state.values.isValid
    if (current !== isValid) {
      formRef.current.setFieldValue('isValid', isValid)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cart?.contents?.hasCars,
    cart?.contents?.totalCars,
    cart?.contents?.totalSessions
  ])

  useEffect(() => {
    if (booking?.error) {
      showToast({ message: booking.error, type: 'error' })
    }
  }, [booking?.error, showToast])

  useEffect(() => {
    if (lastAppliedDefaultValuesKeyRef.current === resolvedDefaultValuesKey) {
      return
    }

    form.reset(resolvedDefaultValues)
    lastAppliedDefaultValuesKeyRef.current = resolvedDefaultValuesKey
  }, [form, resolvedDefaultValues, resolvedDefaultValuesKey])

  return (
    <BookingLayout>
      <section className={styles.section}>
        <PageHeader title={title} description={description} centeredDesktop />
        <div>
          <div className={styles.section__container}>
            <DateSelect label={t('label.date_select')} />
            <ul className={styles.section__dates}>
              {state.eventData?.schedules?.map((day) => {
                return (
                  <li key={day.date}>
                    <DayTab
                      day={day}
                      schedules={day.schedules}
                      rateIds={resolvedRateIds}
                      isActive={state.selectedDayDate === day.date}
                      onClick={() => {
                        handleDateSelect(day.date)
                      }}
                    />
                  </li>
                )
              })}
            </ul>
          </div>

          <div className={styles.section__cars}>
            {state.isLoadingEventData ? (
              <CoreLoadingSpinner aspectRatio="4/1" />
            ) : (
              <SupercarOptions />
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              form.handleSubmit()
            }}
          >
            <form.Field name="isValid">
              {(field) => (
                <input
                  type="hidden"
                  name={field.name}
                  value={field.state.value ? 'true' : 'false'}
                />
              )}
            </form.Field>

            <form.Field name="isSubmitted">
              {(field) => (
                <input
                  type="hidden"
                  name={field.name}
                  value={field.state.value ? 'true' : 'false'}
                />
              )}
            </form.Field>

            <form.Field name="selectedDate">
              {(field) => (
                <input
                  type="hidden"
                  name={field.name}
                  value={field.state.value ?? ''}
                />
              )}
            </form.Field>

            <form.Field name="activeTabIndex">
              {(field) => (
                <input
                  type="hidden"
                  name={field.name}
                  value={field.state.value ?? 0}
                />
              )}
            </form.Field>

            <form.Field name="selectedEvent">
              {(field) => (
                <input
                  type="hidden"
                  name={field.name}
                  value={field.state.value ?? ''}
                />
              )}
            </form.Field>

            <form.Field name="selectedDay">
              {(field) => (
                <input
                  type="hidden"
                  name={field.name}
                  value={field.state.value ?? ''}
                />
              )}
            </form.Field>

            <form.Field name="cars">
              {() => <input type="hidden" name="cars" value="" />}
            </form.Field>

            <PageFooter
              title={t('footer.title')}
              subtitle={footerSubtitle}
              disabled={!hasCars}
              onBack={handleBack}
              backText={t('button.back')}
              submitText={submitButtonText}
              savingText={t('button.saving')}
              onSubmit={form.handleSubmit}
              isPending={false}
            />
          </form>
        </div>
      </section>
    </BookingLayout>
  )
}
