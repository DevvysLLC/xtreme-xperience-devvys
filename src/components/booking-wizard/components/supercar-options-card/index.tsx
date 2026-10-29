'use client'

import { useForm } from '@tanstack/react-form'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BOOKING_LAP_QUANTITY_OPTIONS } from '../../../../config/settings'
import type { BookingSupercarFragment } from '../../../../core/dato/fragments/booking-config.typegen'
import { logger } from '../../../../core/logger/logger'
import { useBookingSupercarSchedule } from '../../../../features/booking'
import { getRequiredRateIdsForSupercar } from '../../../../features/booking/use-booking-supercar-schedule'
import {
  useCart,
  useCartAdd,
  useCartClear,
  useCartRemoveLineItem
} from '../../../../features/cart'
import { useDialog } from '../../../../features/dialog'
import { useToast } from '../../../../features/toast'
import {
  RocketRezProductType,
  RocketRezScheduleStatus
} from '../../../../io/schemas'
import type {
  CartLineItemMetadata,
  RocketRezAddLineItemCar
} from '../../../../io/types'
import { getAddToCartLineItemCarMetadata } from '../../../../utils/get-add-to-cart-line-item-car-metadata'
import { getBookingLapsPerSession } from '../../../../utils/get-booking-laps-per-session'
import { getRateTypePrice } from '../../../../utils/get-rate-type-price'
import { getScheduleDiscount } from '../../../../utils/get-schedule-discount'
import { getSeatTypeIdWithOverride } from '../../../../utils/get-seat-type-id-with-override'
import { isScheduleSoldOut } from '../../../../utils/is-schedule-sold-out'
import { CoreBadge } from '../../../core-badge'
import { CoreCta } from '../../../core-cta'
import { CoreImage } from '../../../core-image'
import { CoreTextMarkdown } from '../../../core-text-markdown'
import { useBookingWizardState } from '../../context'
import { SupercarOptionsCardLaps } from './components/supercar-options-card-laps'
import { SupercarOptionsCardTimes } from './components/supercar-options-card-times'
import { SupercarOptionsCardProvider, useSupercarOptionsCard } from './context'
import styles from './style.module.scss'

type Props = {
  rocketRezSeatTypeId: number
  supercar: BookingSupercarFragment
  cardIndex?: number
  isSelected?: boolean
  isCompared?: boolean
  editingLineItemId?: string | null
  onClearEditing?: () => void
  onToggleSelect?: () => void
  onToggleCompare?: () => void
  onClose?: () => void
}

const SupercarOptionsCardContent: React.FC<Props> = ({
  supercar: bookingSupercar,
  rocketRezSeatTypeId,
  cardIndex = 0,
  isSelected: isSelectedProp,
  // isCompared = false,
  editingLineItemId = null,
  onClearEditing,
  onToggleSelect,
  // onToggleCompare,
  onClose
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
  const { lowestAvailablePrice, getEffectivePrice } =
    useBookingSupercarSchedule()
  const { mutateAsync, isPending } = useCartAdd()
  const { mutateAsync: removeLineItemAsync, isPending: isRemoving } =
    useCartRemoveLineItem()
  const { data: cartResponse } = useCart()
  const [internalSelected, setInternalSelected] = useState(false)
  const isSelected =
    isSelectedProp !== undefined ? isSelectedProp : internalSelected

  const toggleSelected = useCallback(() => {
    if (onToggleSelect) {
      onToggleSelect()
    } else {
      setInternalSelected((prev) => !prev)
    }
  }, [onToggleSelect])

  const closeSelected = useCallback(() => {
    if (onClose) {
      onClose()
    } else {
      setInternalSelected(false)
    }
  }, [onClose])

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const inlineRef = useRef<HTMLElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const handleTimeSelect = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }, 100)
    }
  }, [])

  useEffect(() => {
    if (isSelected && inlineRef.current) {
      const timer = setTimeout(() => {
        inlineRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isSelected])

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
      ? `<strong>${supercar.model?.model}</strong>`
      : (supercar.model?.title ??
        `Supercar <strong>${rocketRezSeatTypeId}</strong>`)
  const thumbnail = bookingSupercar.thumbnailOverride
    ? bookingSupercar.thumbnailOverride
    : supercar.model?.thumbnail
      ? supercar.model?.thumbnail
      : null
  const id = state.selectedEvent?.model?.rocketRezId ?? null
  const badge = bookingSupercar.badgeOverride ?? null
  const isMulticar = bookingSupercar.isMulticar

  const modalTitle = useMemo(() => {
    if (bookingSupercar.titleOverride) {
      return bookingSupercar.titleOverride.replace(/<[^>]*>/g, '').trim()
    }
    if (supercar.model?.make && supercar.model?.model) {
      return `${supercar.model.make} ${supercar.model.model}`.toUpperCase()
    }
    return (supercar.model?.title ?? `SUPERCAR ${rocketRezSeatTypeId}`).toUpperCase()
  }, [bookingSupercar.titleOverride, supercar.model, rocketRezSeatTypeId])

  const lapsText = useMemo(() => {
    const laps = lapsPerSession ?? (isMulticar ? (bookingSupercar.multicarCount ? bookingSupercar.multicarCount * 4 : 8) : 4)
    return `${laps} total laps on track. `
  }, [lapsPerSession, isMulticar, bookingSupercar.multicarCount])

  const lowestPrice = useMemo(
    () => lowestAvailablePrice(schedules, rocketRezSeatTypeId, isMulticar),
    [schedules, rocketRezSeatTypeId, lowestAvailablePrice, isMulticar]
  )

  const discountRules = state.configData?.discountRules
  const trackId = state.selectedEvent?.model?.track?.config?.id ?? null

  const lowestDiscountedPrice = useMemo(() => {
    if (!schedules || schedules.length === 0 || !lowestPrice) {
      return lowestPrice
    }
    let minPrice = lowestPrice.price
    let minCompareAt = lowestPrice.compareAtPrice
    let matchedBadge: string | null = null
    let matchedBadgeBg: string | null = null
    let matchedBadgeText: string | null = null

    for (const schedule of schedules) {
      if (schedule.scheduleStatus !== RocketRezScheduleStatus.AVAILABLE) {
        continue
      }
      const matchedSeatType = (schedule.seatTypes ?? []).find(
        (seatType) =>
          seatType?.available != null &&
          seatType.available > 0 &&
          (seatType.rates ?? []).some((rate) => rate.id === rocketRezSeatTypeId)
      )
      if (!matchedSeatType) {
        continue
      }
      const matchedRate = (matchedSeatType.rates ?? []).find(
        (rate) => rate.id === rocketRezSeatTypeId
      )
      const rtp = getRateTypePrice(matchedRate?.rateTypes?.[0])
      if (!rtp?.hasPrice || rtp.price === null) {
        continue
      }

      const disc = getScheduleDiscount({
        scheduleStartTime: schedule.startTime,
        scheduleDate: state.selectedDayDate,
        basePrice: rtp.price,
        existingCompareAtPrice: rtp.compareAtPrice,
        eventId: state.selectedEvent?.id,
        trackId,
        supercarId: String(supercar.id),
        isRideAlong: bookingSupercar.isRideAlong,
        isMulticar,
        rules: discountRules
      })

      if (disc.price < minPrice) {
        minPrice = disc.price
        minCompareAt = disc.compareAtPrice ?? rtp.price
        if (disc.badgeLabel) {
          matchedBadge = disc.badgeLabel
          matchedBadgeBg = disc.badgeBackgroundColor ?? null
          matchedBadgeText = disc.badgeTextColor ?? null
        }
      }
    }

    return {
      price: minPrice,
      compareAtPrice: minCompareAt,
      promoBadge: matchedBadge,
      badgeBackgroundColor: matchedBadgeBg,
      badgeTextColor: matchedBadgeText
    }
  }, [
    schedules,
    lowestPrice,
    rocketRezSeatTypeId,
    state.selectedDayDate,
    state.selectedEvent?.id,
    trackId,
    supercar.id,
    bookingSupercar.isRideAlong,
    isMulticar,
    discountRules
  ])

  // Highest standard price for this car across every event day (prototype's "Standard value")
  const standardValue = useMemo(() => {
    if (isMulticar) {
      return null
    }
    const allSchedules =
      state.eventData?.schedules?.flatMap((day) => day.schedules ?? []) ?? []
    let highest = 0
    for (const schedule of allSchedules) {
      const value = getEffectivePrice(schedule, rocketRezSeatTypeId)
      if (value > highest) {
        highest = value
      }
    }
    return highest > 0 ? highest : null
  }, [state.eventData?.schedules, getEffectivePrice, rocketRezSeatTypeId, isMulticar])

  // For packages (isMulticar), resolve all required rate IDs from the first available schedule
  // to determine sold-out status accurately
  const packageRateIds = useMemo(() => {
    if (!isMulticar) {
      return undefined
    }
    const firstAvailableSchedule = schedules.find(
      (s) => s.scheduleStatus === RocketRezScheduleStatus.AVAILABLE
    )
    if (!firstAvailableSchedule) {
      return undefined
    }
    return getRequiredRateIdsForSupercar(
      firstAvailableSchedule,
      rocketRezSeatTypeId,
      true
    )
  }, [isMulticar, schedules, rocketRezSeatTypeId])

  // Check if sold out: no schedules, all unavailable, all prices are 0, or all have 0 availability
  const soldOut = isScheduleSoldOut(
    schedules,
    isMulticar && packageRateIds ? packageRateIds : rocketRezSeatTypeId
  )

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

  const addToCart = async (
    lineItemOriginal: ValidatedLineItem,
    isoDate: string
  ) => {
    const activeTabIndex = state.activeTabIndex ?? 0
    const activeGroupTitle =
      state.configData?.supercars?.[activeTabIndex]?.title ?? null

    const lineItem = {
      ...lineItemOriginal,
      rateType: lineItemOriginal.rateType || 'Participant'
    }

    // Compute currentPrice, referenceValue, and savings for this car
    const quantity = cardState.selectedQuantity ?? 1
    const selectedSlotPrice =
      cardState.selectedDaySchedule?.rateTypePrice?.price
    const currentPrice =
      ((selectedSlotPrice ??
        (bookingSupercar.priceOverride?.price != null
          ? bookingSupercar.priceOverride.price / 100
          : null)) ??
        0) * quantity
    const selectedCompareAt =
      (bookingSupercar.priceOverride?.compareAtPrice != null
        ? bookingSupercar.priceOverride.compareAtPrice / 100
        : null) ??
      cardState.selectedDaySchedule?.rateTypePrice?.compareAtPrice ??
      null
    const cmsCompareAt = (selectedCompareAt ?? 0) * quantity
    const refVal =
      cmsCompareAt > currentPrice
        ? cmsCompareAt
        : standardValue !== null
          ? standardValue * quantity
          : 0
    const carSavings =
      refVal > currentPrice ? Math.floor(refVal - currentPrice) : 0

    const earlyPerUnit = cardState.selectedDaySchedule?.discountAmount ?? 0
    const earlySavings = earlyPerUnit * quantity
    const savingsBreakdown: Array<{ category: string; amount: number }> = []
    if (earlySavings > 0) {
      const label =
        cardState.selectedDaySchedule?.discountLabel || 'Early sessions'
      savingsBreakdown.push({ category: label, amount: earlySavings })
    }

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
        multicarCount: bookingSupercar.multicarCount,
        titleOverride: bookingSupercar.titleOverride,
        thumbnailOverride: bookingSupercar.thumbnailOverride
      },
      lapsPerSession,
      referenceValue: refVal > 0 ? refVal : null,
      savings: carSavings > 0 ? carSavings : null,
      savingsBreakdown: savingsBreakdown.length > 0 ? savingsBreakdown : null,
      seatTypeId: rocketRezSeatTypeId
    })

    // For packages, build one line item per rate in the package category,
    // all sharing the same scheduleId — required by RocketRez API
    let lineItems: ValidatedLineItem[] = [lineItem]
    let metadataPayload: CartLineItemMetadata | CartLineItemMetadata[] =
      metadata

    if (isMulticar && lineItem.scheduleId) {
      const selectedSchedule = schedules.find(
        (s) => s.id === lineItem.scheduleId
      )
      if (selectedSchedule) {
        const allRateIds = getRequiredRateIdsForSupercar(
          selectedSchedule,
          rocketRezSeatTypeId,
          true
        )
        // Build one line item per rate (each rate = one car in the package)
        lineItems = allRateIds.map((rateId) => ({
          ...lineItem,
          rateId,
          rateType: 'Participant'
        }))

        // Retrieve all supercars across ALL groups to properly resolve child car fragments
        const activeGroupSupercars =
          state.configData?.supercars?.flatMap((group) => group.supercars) ?? []

        // Generate metadata for each of the cars in the package
        const metadataList: CartLineItemMetadata[] = [metadata]
        for (const item of lineItems) {
          // Find the supercar fragment in DatoCMS config that maps to this rateId
          const matchingBookingSupercar = activeGroupSupercars.find((bs) => {
            const resolvedId = getSeatTypeIdWithOverride({
              defaultSeatTypeId: bs.rocketRezSeatTypeId,
              overrides: bs.rocketRezSeatTypeIdOverrides,
              selectedEventId: id
            })
            return resolvedId === item.rateId
          })

          if (matchingBookingSupercar) {
            metadataList.push(
              getAddToCartLineItemCarMetadata({
                supercar: matchingBookingSupercar.supercar,
                lineItem: item,
                userSelectionState: {
                  date: isoDate,
                  activeGroupTitle: activeGroupTitle ?? undefined
                },
                bookingSupercar: {
                  cartLineItemLabel:
                    matchingBookingSupercar.cartLineItemLabel ||
                    bookingSupercar.cartLineItemLabel,
                  isMulticar: matchingBookingSupercar.isMulticar,
                  isRideAlong: matchingBookingSupercar.isRideAlong,
                  multicarCount: matchingBookingSupercar.multicarCount,
                  titleOverride: matchingBookingSupercar.titleOverride,
                  thumbnailOverride: matchingBookingSupercar.thumbnailOverride
                },
                lapsPerSession
              })
            )
          } else {
            // Fallback: if we couldn't match a supercar from the CMS, use the primary supercar's metadata
            metadataList.push(
              getAddToCartLineItemCarMetadata({
                supercar,
                lineItem: item,
                userSelectionState: {
                  date: isoDate,
                  activeGroupTitle: activeGroupTitle ?? undefined
                },
                bookingSupercar: {
                  cartLineItemLabel: bookingSupercar.cartLineItemLabel,
                  isMulticar: bookingSupercar.isMulticar,
                  isRideAlong: bookingSupercar.isRideAlong,
                  multicarCount: bookingSupercar.multicarCount,
                  titleOverride: bookingSupercar.titleOverride,
                  thumbnailOverride: bookingSupercar.thumbnailOverride
                },
                lapsPerSession
              })
            )
          }
        }
        metadataPayload = metadataList
      }
    }

    try {
      // Only send the base lineItem to RocketRez.
      // RocketRez will automatically bundle the sub-items on the backend.
      // However, we still pass the full metadataPayload so the UI can label
      // the automatically generated sub-items when RocketRez returns them.
      await mutateAsync({
        request: { lineItems: [lineItem] },
        metadata: metadataPayload
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

      if (editingLineItemId) {
        const itemToRemove = cartResponse?.cartData?.lineItems?.find(
          (item) => String(item.id) === String(editingLineItemId)
        )
        if (itemToRemove) {
          try {
            await removeLineItemAsync({ lineItem: itemToRemove })
          } catch (err) {
            logger.error(
              { err, itemToRemove },
              'supercar-options-card.removeOldLineItem.error'
            )
          }
        }
        onClearEditing?.()
        try {
          sessionStorage.removeItem('pendingEditLineItemId')
        } catch (error) {
          logger.debug({ error }, 'supercar-options-card.sessionStorage.remove.error')
        }
      }

      await addToCart(lineItem, isoDate)
    }
  })

  // Reset card state when selected day changes
  const prevSelectedDayDateRef = useRef(state.selectedDayDate)
  useEffect(() => {
    if (prevSelectedDayDateRef.current !== state.selectedDayDate) {
      prevSelectedDayDateRef.current = state.selectedDayDate
      setSelectedDaySchedule(null)
      setSelectedQuantity(1)
      closeSelected()
      form.reset()
    }
  }, [
    state.selectedDayDate,
    form,
    setSelectedDaySchedule,
    setSelectedQuantity,
    closeSelected
  ])

  const handleRemove = () => {
    closeSelected()
    setSelectedDaySchedule(null)
    setSelectedQuantity(1)
    form.reset()
    onClearEditing?.()
    try {
      sessionStorage.removeItem('pendingEditLineItemId')
    } catch (error) {
      logger.debug({ error }, 'supercar-options-card.handleRemove.sessionStorage.error')
    }
  }

  const r = Math.floor(cardIndex / 2)
  const cardOrderDesktop = r * 3 + (cardIndex % 2)
  const inlineOrderDesktop = r * 3 + 2
  const cardOrderMobile = cardOrderDesktop
  const inlineOrderMobile = inlineOrderDesktop

  const cardStyle: React.CSSProperties & Record<string, number> = {
    '--card-order-desktop': cardOrderDesktop,
    '--card-order-mobile': cardOrderMobile
  }
  const inlineStyle: React.CSSProperties & Record<string, number> = {
    '--inline-order-desktop': inlineOrderDesktop,
    '--inline-order-mobile': inlineOrderMobile
  }

  const trackName = state.selectedEvent?.model?.track?.model?.nickname ?? ''
  const panelTitle =
    supercar.model?.make && supercar.model?.model && !bookingSupercar.titleOverride
      ? `${supercar.model.make} ${supercar.model.model}`
      : null

  const promoBadge =
    lowestDiscountedPrice &&
    'promoBadge' in lowestDiscountedPrice &&
    lowestDiscountedPrice.promoBadge
      ? {
          __typename: 'CoreBadgeRecord' as const,
          id: 'promo-badge',
          label: lowestDiscountedPrice.promoBadge,
          backgroundColor: {
            __typename: 'ColorField' as const,
            hex:
              ('badgeBackgroundColor' in lowestDiscountedPrice &&
                lowestDiscountedPrice.badgeBackgroundColor) ||
              '#D32F2F'
          },
          color: {
            __typename: 'ColorField' as const,
            hex:
              ('badgeTextColor' in lowestDiscountedPrice &&
                lowestDiscountedPrice.badgeTextColor) ||
              '#FFFFFF'
          }
        }
      : null

  const cmsBadge = badge ?? promoBadge ?? supercar.model?.badges?.[0] ?? null

  const renderPrice = (selectedMode: boolean) => {
    const showSelected =
      selectedMode && !!cardState.selectedDaySchedule?.price
    const quantity = showSelected ? (cardState.selectedQuantity ?? 1) : 1
    const selectedSlotPrice =
      cardState.selectedDaySchedule?.rateTypePrice?.price
    const activeLowest = lowestDiscountedPrice ?? lowestPrice
    const currentPrice = showSelected
      ? ((selectedSlotPrice ??
          (bookingSupercar.priceOverride?.price != null
            ? bookingSupercar.priceOverride.price / 100
            : null)) ??
          0) * quantity
      : bookingSupercar.priceOverride?.price != null
        ? bookingSupercar.priceOverride.price / 100
        : (activeLowest?.price ?? null)
    if (currentPrice === null || currentPrice === 0) {
      return null
    }
    const selectedCompareAt =
      (bookingSupercar.priceOverride?.compareAtPrice != null
        ? bookingSupercar.priceOverride.compareAtPrice / 100
        : null) ??
      cardState.selectedDaySchedule?.rateTypePrice?.compareAtPrice ??
      null
    const cmsCompareAt = showSelected
      ? (selectedCompareAt ?? 0) * quantity
      : bookingSupercar.priceOverride?.compareAtPrice != null
        ? bookingSupercar.priceOverride.compareAtPrice / 100
        : (activeLowest?.compareAtPrice ?? 0)
    const referenceValue =
      cmsCompareAt > currentPrice
        ? cmsCompareAt
        : standardValue !== null
          ? standardValue * quantity
          : 0
    const savings =
      referenceValue > currentPrice
        ? Math.floor(referenceValue - currentPrice)
        : 0
    return (
      <div
        className={styles.price_display}
        data-price={currentPrice}
        data-savings={savings}
      >
        {savings > 0 && (
          <span className={styles.price_display__reference}>
            {isMulticar ? 'Full value' : 'Standard value'}{' '}
            <del>${Math.ceil(referenceValue)}</del>
          </span>
        )}
        <div className={styles.price_display__line}>
          <span className={styles.price_display__money}>
            {!showSelected && (
              <span className={styles.price_display__from}>From </span>
            )}
            ${Math.ceil(currentPrice)}
          </span>
          {savings > 0 && (
            <>
              <span
                className={styles.price_display__separator}
                aria-hidden="true"
              >
                |
              </span>
              <span className={styles.price_display__saving}>
                Save {!showSelected && 'up to '}${savings}
              </span>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <article
        id={`supercar-card-${rocketRezSeatTypeId}`}
        className={clsx(styles.card, isSelected && styles['card--open'])}
        style={cardStyle}
      >
        <div className={styles.card__media}>
          {thumbnail && <CoreImage data={thumbnail} />}
          {cmsBadge && cmsBadge.label?.trim() && (
            <div className={styles.card__badge}>
              <CoreBadge data={cmsBadge} />
            </div>
          )}
        </div>
        <div
          className={clsx(
            styles.card__header,
            soldOut && styles['card__header--sold-out']
          )}
        >
          {!bookingSupercar.titleOverride && supercar.model?.make && (
            <p className={styles.card__make}>{supercar.model.make}</p>
          )}
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
              renderPrice(false)
            )}
          </div>
          {!soldOut && (
            <div className={styles.card__actions}>
              <CoreCta
                text={isSelected ? t('button.selecting') : t('button.select')}
                href={null}
                type="button"
                layoutType="button"
                styleType="black"
                sizeType="medium"
                onClick={toggleSelected}
              />
            </div>
          )}
        </div>
      </article>

      {isDetailsOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className={styles.modal_backdrop}
            onClick={() => setIsDetailsOpen(false)}
          >
            <div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`modal-title-${rocketRezSeatTypeId}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modal__head}>
                <h2
                  id={`modal-title-${rocketRezSeatTypeId}`}
                  className={styles.modal__title}
                >
                  {modalTitle}
                </h2>
                <button
                  type="button"
                  className={styles.modal__close}
                  aria-label="Close dialog"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className={styles.modal__body}>
                <div className={styles.modal__visual}>
                  {thumbnail && <CoreImage data={thumbnail} />}
                </div>
                <p className={styles.modal__lead}>
                  <strong>
                    {bookingSupercar.whatsIncludedLeadOverride ||
                      (bookingSupercar.isRideAlong
                        ? 'Ride with a professional driver.'
                        : isMulticar
                          ? 'Experience more than one dream car.'
                          : (state.configData?.whatsIncludedLead ||
                            'You drive. A professional instructor rides with you.'))}
                  </strong>
                </p>
                <p className={styles.modal__desc}>
                  {lapsText}
                  {bookingSupercar.whatsIncludedDescriptionOverride ||
                    (bookingSupercar.isRideAlong
                      ? 'A passenger experience.'
                      : (state.configData?.whatsIncludedDescription ||
                        'No prior track experience needed. Instruction included.'))}
                </p>

                <div className={styles.modal__price}>
                  {renderPrice(false)}
                </div>

                <div className={styles.modal__notice}>
                  {bookingSupercar.whatsIncludedNoticeOverride ||
                    (isMulticar &&
                    (bookingSupercar.titleOverride?.toLowerCase().includes('fleet') ||
                      bookingSupercar.multicarCount === 8)
                      ? 'Includes all 8 cars, track insurance, a lead-car ride, Full-Throttle and skip-the-line access.'
                      : bookingSupercar.isRideAlong
                        ? 'Confirm passenger eligibility in the live booking flow.'
                        : (state.configData?.whatsIncludedNotice ||
                          'Required coverage is additional and shown before you continue. Photos, video, and ride-alongs are optional.'))}
                </div>

                <button
                  type="button"
                  className={styles.modal__cta}
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsDetailsOpen(false)
                    if (!isSelected) {
                      toggleSelected()
                    } else {
                      setTimeout(() => {
                        inlineRef.current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start'
                        })
                      }, 100)
                    }
                  }}
                >
                  Choose a time
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {!soldOut && isSelected && (
        <section
          ref={inlineRef}
          id={`supercar-time-panel-${rocketRezSeatTypeId}`}
          className={styles.inline}
          aria-label={`${t('label.quantity')} / ${t('label.schedules')}`}
          style={inlineStyle}
        >
          <div className={styles.inline__heading}>
            <div>
              {panelTitle ? (
                <h2 className={styles.inline__title}>{panelTitle}</h2>
              ) : (
                <h2 className={styles.inline__title}>
                  <CoreTextMarkdown>{title}</CoreTextMarkdown>
                </h2>
              )}
              {trackName && (
                <p className={styles.inline__subtitle}>
                  {trackName} · Local track time
                </p>
              )}
            </div>
            <button
              type="button"
              className={styles.inline__close}
              onClick={handleRemove}
              aria-label={t('button.remove')}
            >
              ×
            </button>
          </div>

          <div className={styles.card__form} role="form">
            <form.Field name="id">
              {(field) => (
                <input
                  type="hidden"
                  name={field.name}
                  value={String(field.state.value ?? '')}
                />
              )}
            </form.Field>
            <form.Field name="type">
              {(field) => (
                <input
                  type="hidden"
                  name={field.name}
                  value={String(field.state.value ?? '')}
                />
              )}
            </form.Field>
            <form.Field name="scheduleId">
              {(field) => (
                <input
                  type="hidden"
                  name={field.name}
                  value={String(field.state.value ?? '')}
                />
              )}
            </form.Field>
            <form.Field name="rateId">
              {(field) => (
                <input
                  type="hidden"
                  name={field.name}
                  value={String(field.state.value ?? '')}
                />
              )}
            </form.Field>
            <form.Field name="rateType">
              {(field) => (
                <input
                  type="hidden"
                  name={field.name}
                  value={String(field.state.value ?? '')}
                />
              )}
            </form.Field>

            <div className={styles.inline__body}>
              <div className={styles.inline__config}>
                {!bookingSupercar.hideLapSelection && (
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
                )}
              </div>

              <div className={styles.inline__times}>
                <form.Field name="scheduleId">
                  {(field) => {
                    const supercarId = supercar.id ?? rocketRezSeatTypeId
                    return (
                      <SupercarOptionsCardTimes
                        supercarId={supercarId}
                        rocketRezSeatTypeId={rocketRezSeatTypeId}
                        packageRateIds={packageRateIds}
                        isMulticar={isMulticar}
                        isRideAlong={bookingSupercar.isRideAlong}
                        schedules={schedules}
                        field={field}
                        form={form}
                        priceOverride={bookingSupercar.priceOverride}
                        onTimeSelect={handleTimeSelect}
                      />
                    )
                  }}
                </form.Field>
              </div>
            </div>

            <div ref={bottomRef} className={styles.inline__bottom}>
              <div className={styles.inline__total}>
                {renderPrice(true)}
                {!cardState.selectedDaySchedule && (
                  <p className={styles.inline__note}>
                    Choose a start time to confirm your price.
                  </p>
                )}
              </div>
              <CoreCta
                text={
                  editingLineItemId
                    ? t('button.update_cart')
                    : t('button.add_to_cart')
                }
                disabled={!cardState.selectedDaySchedule || isPending || isRemoving}
                onClick={() => {
                  form.handleSubmit()
                }}
                layoutType="button"
                styleType="orange"
                sizeType="medium"
                className={styles.inline__add}
              />
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export const SupercarOptionsCard: React.FC<Props> = ({
  supercar,
  rocketRezSeatTypeId,
  cardIndex,
  isSelected,
  isCompared,
  editingLineItemId,
  onClearEditing,
  onToggleSelect,
  onToggleCompare,
  onClose
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
        cardIndex={cardIndex}
        isSelected={isSelected}
        isCompared={isCompared}
        editingLineItemId={editingLineItemId}
        onClearEditing={onClearEditing}
        onToggleSelect={onToggleSelect}
        onToggleCompare={onToggleCompare}
        onClose={onClose}
      />
    </SupercarOptionsCardProvider>
  )
}
