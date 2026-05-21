'use client'

import { useForm } from '@tanstack/react-form'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { BOOKING_LAP_QUANTITY_OPTIONS } from '../../../../config/settings'
import type { BookingSupercarFragment } from '../../../../core/dato/fragments/booking-config.typegen'
import { logger } from '../../../../core/logger/logger'
import { useBookingSupercarSchedule } from '../../../../features/booking'
import { useCart, useCartAdd, useCartClear } from '../../../../features/cart'
import { useDialog } from '../../../../features/dialog'
import { useToast } from '../../../../features/toast'
import { RocketRezProductType } from '../../../../io/schemas'
import type { RocketRezAddLineItemCar } from '../../../../io/types'
import { getAddToCartLineItemCarMetadata } from '../../../../utils/get-add-to-cart-line-item-car-metadata'
import { getBookingLapsPerSession } from '../../../../utils/get-booking-laps-per-session'
import { isScheduleSoldOut } from '../../../../utils/is-schedule-sold-out'
import { CoreBadge } from '../../../core-badge'
import { CoreCta } from '../../../core-cta'
import { CoreImage } from '../../../core-image'
import { CoreRocketRezPrice } from '../../../core-rocketrez-price'
import { CoreTextMarkdown } from '../../../core-text-markdown'
import { useBookingWizardState } from '../../context'
import { SupercarOptionsCardLaps } from './components/supercar-options-card-laps'
import { SupercarOptionsCardTimes } from './components/supercar-options-card-times'
import { SupercarOptionsCardProvider, useSupercarOptionsCard } from './context'
import styles from './style.module.scss'

type Props = {
  rocketRezSeatTypeId: number
  supercar: BookingSupercarFragment
}

const SupercarOptionsCardContent: React.FC<Props> = ({
  supercar: bookingSupercar,
  rocketRezSeatTypeId
}) => {
  const t = useTranslations(
    'booking_wizard.pages.date_and_car.supercar_options_card'
  )
  const tDialog = useTranslations(
    'booking_wizard.dialog_cannot_add_car_for_different_date'
  )
  const tToast = useTranslations('booking_wizard')
  const { state } = useBookingWizardState()
  const { state: cardState } = useSupercarOptionsCard()
  const { lowestAvailablePrice } = useBookingSupercarSchedule()
  const { mutateAsync, isPending } = useCartAdd()
  const [isSelected, setIsSelected] = useState(false)
  const { data } = useCart()
  const clearCart = useCartClear()
  const { showDialog } = useDialog()
  const { showToast } = useToast()
  const { setSelectedDaySchedule, setSelectedQuantity } =
    useSupercarOptionsCard()
  const supercar = bookingSupercar.supercar
  const selectedDaySchedules =
    state.eventData?.schedules?.find(
      (schedule) => schedule.date === state.selectedDayDate
    ) ?? null
  const addToCartSuccessMessage =
    state.configData?.addToCartSuccessMessage?.trim() ||
    tToast('notifications.added_to_cart')
  const addToCartErrorMessage =
    state.configData?.addToCartErrorMessage?.trim() ||
    tToast('notifications.error_adding_to_cart')
  const lapsPerSession = getBookingLapsPerSession({
    configData: state.configData,
    selectedEventId: state.selectedEvent?.id
  })
  const schedules = useMemo(
    () => selectedDaySchedules?.schedules ?? [],
    [selectedDaySchedules?.schedules]
  )
  const title = bookingSupercar.titleOverride
    ? bookingSupercar.titleOverride
    : supercar.model?.make && supercar.model?.model
      ? `${supercar.model?.make} <strong>${supercar.model?.model}</strong>`
      : (supercar.model?.title ??
        `Supercar <strong>${rocketRezSeatTypeId}</strong>`)
  const thumbnail = bookingSupercar.thumbnailOverride
    ? bookingSupercar.thumbnailOverride
    : supercar.model?.thumbnail
      ? supercar.model?.thumbnail
      : null
  const id = state.selectedEvent?.model?.rocketRezId ?? null
  const badge = bookingSupercar.badgeOverride ?? null
  const lowestPrice = useMemo(
    () => lowestAvailablePrice(schedules, rocketRezSeatTypeId),
    [schedules, rocketRezSeatTypeId, lowestAvailablePrice]
  )

  // Check if sold out: no schedules, all unavailable, all prices are 0, or all have 0 availability
  const soldOut = isScheduleSoldOut(schedules, rocketRezSeatTypeId)

  // Check if cart has cars with a different date than the selected date
  const getExistingCartDate = (): string | null => {
    if (!data?.contents?.hasCars) {
      return null
    }
    // Find the first car's date from metadata
    const carMetadata = data.metadata.find((meta) => meta.type === 'car')
    return carMetadata?.properties?.date?.split('T')[0] ?? null
  }

  const defaultValues: RocketRezAddLineItemCar = {
    id: id ? Number(id) : 0,
    type: RocketRezProductType.EVENT,
    quantity: 1,
    scheduleId: null,
    rateId: null,
    rateType: null
  }

  type ValidatedLineItem = {
    id: number
    type: string
    quantity: number
    scheduleId: number | null
    rateId: number | null
    rateType: string | null
  }

  const addToCart = async (lineItem: ValidatedLineItem, isoDate: string) => {
    const activeTabIndex = state.activeTabIndex ?? 0
    const activeGroupTitle =
      state.configData?.supercars?.[activeTabIndex]?.title ?? null

    const metadata = getAddToCartLineItemCarMetadata({
      supercar,
      lineItem,
      userSelectionState: {
        date: isoDate,
        activeGroupTitle: activeGroupTitle ?? undefined
      },
      bookingSupercar: {
        cartLineItemLabel: bookingSupercar.cartLineItemLabel,
        isMulticar: bookingSupercar.isMulticar,
        isRideAlong: bookingSupercar.isRideAlong,
        multicarCount: bookingSupercar.multicarCount
      },
      lapsPerSession
    })

    try {
      await mutateAsync({
        request: { lineItems: [lineItem] },
        metadata
      })

      showToast({
        message: addToCartSuccessMessage,
        type: 'success'
      })
    } catch {
      showToast({
        message: addToCartErrorMessage,
        type: 'error'
      })
    }
  }

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const itemId = value.id
      const itemType = value.type
      const itemQuantity = value.quantity

      if (itemId == null || itemType == null || itemQuantity == null) {
        logger.error('Form validation error: missing required fields', {
          value
        })
        return
      }

      const lineItem: ValidatedLineItem = {
        id: itemId,
        type: itemType,
        quantity: itemQuantity,
        scheduleId: value.scheduleId ?? null,
        rateId: value.rateId ?? null,
        rateType: value.rateType ?? null
      }

      // Combine date and time into ISO 8601 datetime string
      const selectedDate = state.selectedDayDate ?? ''
      const startTime = cardState.selectedDaySchedule?.startTime ?? ''
      const isoDate =
        selectedDate && startTime
          ? `${selectedDate}T${startTime}`
          : selectedDate

      // Check if cart has cars with different date
      const existingCartDate = getExistingCartDate()
      const hasDateConflict =
        existingCartDate !== null && existingCartDate !== selectedDate

      if (hasDateConflict) {
        showDialog({
          translations: {
            title: tDialog('title'),
            description: tDialog('description'),
            confirmButton: tDialog('confirm'),
            cancelButton: tDialog('cancel')
          },
          onConfirm: async () => {
            try {
              await clearCart.mutateAsync(undefined)
              await addToCart(lineItem, isoDate)
            } catch (error) {
              logger.error(
                { error, lineItem, isoDate },
                'supercar-options-card.onConfirm.error'
              )
            }
          }
        })
        return
      }

      await addToCart(lineItem, isoDate)
    }
  })

  // Reset card state when selected day changes
  useEffect(() => {
    setSelectedDaySchedule(null)
    setSelectedQuantity(1)
    setIsSelected(false)
    form.reset()
  }, [state.selectedDayDate, form, setSelectedDaySchedule, setSelectedQuantity])

  const handleRemove = () => {
    setIsSelected(false)
    setSelectedDaySchedule(null)
    setSelectedQuantity(1)
    form.reset()
  }

  return (
    <article className={styles.card}>
      <div className={styles.card__media}>
        {thumbnail && <CoreImage data={thumbnail} />}
      </div>
      <div
        className={clsx(
          styles.card__header,
          soldOut && styles['card__header--sold-out']
        )}
      >
        <h3 className={styles.card__title}>
          <CoreTextMarkdown>{title}</CoreTextMarkdown>
        </h3>
        <div className={styles.card__price}>
          {soldOut ? (
            <CoreBadge
              label={t('badge.sold_out')}
              backgroundColor="#F0EDEB"
              color="#111111"
            />
          ) : (
            <>
              {isSelected && cardState.selectedDaySchedule?.price ? (
                <CoreRocketRezPrice
                  data={{
                    id: `${cardState.selectedDaySchedule.scheduleId}-price`,
                    compareAtPrice:
                      (cardState.selectedDaySchedule?.rateTypePrice
                        ?.compareAtPrice ?? 0) *
                      (cardState.selectedQuantity ?? 0),
                    price:
                      (cardState.selectedDaySchedule?.rateTypePrice?.price ??
                        0) * (cardState.selectedQuantity ?? 0)
                  }}
                  showPrefix={true}
                />
              ) : (
                <>
                  {lowestPrice && (
                    <CoreRocketRezPrice
                      data={{
                        id: `${rocketRezSeatTypeId}-lowest-price`,
                        price: lowestPrice.price,
                        compareAtPrice: null
                      }}
                      showPrefix={true}
                    />
                  )}
                </>
              )}

              {badge && <CoreBadge data={badge} />}
            </>
          )}
        </div>
      </div>
      {!soldOut && (
        <div className={styles.card__content}>
          {isSelected && (
            <div className={styles.card__form} role="form">
              <div className={styles.card__options}>
                <form.Field name="id">
                  {(field) => (
                    <input
                      type="hidden"
                      name={field.name}
                      value={field.state.value ?? ''}
                    />
                  )}
                </form.Field>
                <form.Field name="type">
                  {(field) => (
                    <input
                      type="hidden"
                      name={field.name}
                      value={field.state.value ?? ''}
                    />
                  )}
                </form.Field>
                <form.Field name="scheduleId">
                  {(field) => (
                    <input
                      type="hidden"
                      name={field.name}
                      value={field.state.value ?? ''}
                    />
                  )}
                </form.Field>
                <form.Field name="rateId">
                  {(field) => (
                    <input
                      type="hidden"
                      name={field.name}
                      value={field.state.value ?? ''}
                    />
                  )}
                </form.Field>
                <form.Field name="rateType">
                  {(field) => (
                    <input
                      type="hidden"
                      name={field.name}
                      value={field.state.value ?? ''}
                    />
                  )}
                </form.Field>

                <form.Field name="quantity">
                  {(field) => {
                    const supercarId = supercar.id ?? rocketRezSeatTypeId
                    return (
                      <SupercarOptionsCardLaps
                        supercarId={supercarId}
                        field={field}
                        schedules={schedules}
                        rocketRezSeatTypeId={rocketRezSeatTypeId}
                      />
                    )
                  }}
                </form.Field>

                <form.Field name="scheduleId">
                  {(field) => {
                    const supercarId = supercar.id ?? rocketRezSeatTypeId
                    return (
                      <SupercarOptionsCardTimes
                        supercarId={supercarId}
                        rocketRezSeatTypeId={rocketRezSeatTypeId}
                        schedules={schedules}
                        field={field}
                        form={form}
                      />
                    )
                  }}
                </form.Field>
              </div>

              <div className={styles.card__actions}>
                <CoreCta
                  text={t('button.add_to_cart')}
                  disabled={!cardState.selectedDaySchedule || isPending}
                  onClick={() => {
                    form.handleSubmit()
                  }}
                  layoutType="button"
                  styleType="black"
                  sizeType="medium"
                />
                <CoreCta
                  onClick={handleRemove}
                  className={styles.card__link}
                  text={t('button.remove')}
                  styleType="black"
                  layoutType="text"
                  type="button"
                />
              </div>
            </div>
          )}
          {!isSelected && (
            <div className={styles.card__actions}>
              <CoreCta
                text={t('button.select')}
                href={null}
                type="submit"
                layoutType="button"
                styleType="black"
                sizeType="medium"
                onClick={() => {
                  setIsSelected(true)
                }}
              />
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export const SupercarOptionsCard: React.FC<Props> = ({
  supercar,
  rocketRezSeatTypeId
}) => {
  const initialLapQuantityOption = BOOKING_LAP_QUANTITY_OPTIONS.find(
    (option) => option.quantity === 1
  ) ||
    BOOKING_LAP_QUANTITY_OPTIONS[0] || {
      label: '3 Laps',
      quantity: 1,
      laps: 3,
      description: ''
    }

  return (
    <SupercarOptionsCardProvider
      initialLapQuantityOption={initialLapQuantityOption}
    >
      <SupercarOptionsCardContent
        supercar={supercar}
        rocketRezSeatTypeId={rocketRezSeatTypeId}
      />
    </SupercarOptionsCardProvider>
  )
}
