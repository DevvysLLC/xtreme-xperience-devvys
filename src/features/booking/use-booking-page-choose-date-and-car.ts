'use client'

import { useCallback, useMemo } from 'react'
import { logger } from '../../core/logger/logger'
import { BookingPageChooseDateAndCarFormValueSchema } from '../../io/schemas'
import type {
  BookingPageChooseDateAndCarFormValue,
  BookingSetDateAndCarInput
} from '../../io/types'
import { getFormValue } from '../../utils/get-form-value'
import { useCart } from '../cart'
import { LOG_NAMESPACE } from './config'
import { useBooking } from './use-booking'
import { useBookingSetDateAndCar } from './use-booking-set-date-and-car'

/**
 * Date and car selection page hook
 *
 * - Stores selected date, event, day, and cars
 * - Validates cart matches stored selections
 * - Requires location page to be complete
 */
export const useBookingPageChooseDateAndCar = () => {
  const { data } = useBooking()
  const { data: cartData } = useCart()
  const setDateAndCar = useBookingSetDateAndCar()

  const get = useCallback(() => {
    logger.info({ data }, `${LOG_NAMESPACE}: page.dateAndCar.get`)
    return data?.date_and_car ?? null
  }, [data])
  const persisted = data?.date_and_car ?? null

  const getDefaultFormValues = useCallback(
    (contextState: {
      selectedDay?: { date: string | null } | null
      selectedEvent?: { model?: { rocketRezId?: string | null } | null } | null
      activeTabIndex?: number
    }): BookingPageChooseDateAndCarFormValue => {
      const storedState = get()
      const storedValueResult =
        storedState?.value !== null && storedState?.value !== undefined
          ? BookingPageChooseDateAndCarFormValueSchema.safeParse(
              storedState.value
            )
          : { success: false, data: null }
      const stored = storedValueResult.success ? storedValueResult.data : null

      const selectedDate = getFormValue(
        stored?.selectedDate ?? null,
        contextState.selectedDay?.date ?? null,
        null
      )
      const selectedEvent = getFormValue(
        stored?.selectedEvent ?? null,
        contextState.selectedEvent?.model?.rocketRezId ?? null,
        null
      )
      const selectedDay = getFormValue(
        stored?.selectedDay ?? null,
        contextState.selectedDay?.date ?? null,
        null
      )
      const activeTabIndexValue = getFormValue(
        stored?.activeTabIndex,
        contextState.activeTabIndex,
        0
      )
      const activeTabIndex =
        typeof activeTabIndexValue === 'number' ? activeTabIndexValue : 0

      const parsed = BookingPageChooseDateAndCarFormValueSchema.safeParse({
        cars: stored?.cars ?? [],
        selectedDate,
        selectedEvent,
        selectedDay,
        activeTabIndex,
        isValid: false,
        isSubmitted: false
      })

      const value: BookingPageChooseDateAndCarFormValue = parsed.success
        ? parsed.data
        : (() => {
            if (!parsed.success) {
              logger.error(
                { issues: parsed.error.issues },
                `${LOG_NAMESPACE}: page.dateAndCar.getDefaultFormValues: Invalid form value, using fallback`
              )
            }
            return BookingPageChooseDateAndCarFormValueSchema.parse({
              cars: [],
              selectedDate: null,
              selectedEvent: null,
              selectedDay: null,
              activeTabIndex: 0,
              isValid: false,
              isSubmitted: false
            })
          })()

      logger.info(
        { contextState, storedState, stored, value },
        `${LOG_NAMESPACE}: page.dateAndCar.getDefaultFormValues`
      )
      return value
    },
    [get]
  )

  const save = useCallback(
    (input: BookingSetDateAndCarInput) => setDateAndCar.mutateAsync(input),
    [setDateAndCar]
  )

  const isValid = useCallback(() => {
    const valid = Boolean(
      data?.event &&
        data?.track &&
        cartData?.contents.hasCars &&
        cartData?.contents.totalCars > 0 &&
        cartData?.contents.totalSessions > 0
    )
    logger.info({ valid }, `${LOG_NAMESPACE}: page.dateAndCar.isValid`)
    return valid
  }, [data?.event, data?.track, cartData?.contents])

  return useMemo(
    () => ({
      persisted,
      get,
      save,
      set: save,
      isValid,
      getDefaultFormValues
    }),
    [persisted, get, save, isValid, getDefaultFormValues]
  )
}

export type UseBookingPageChooseDateAndCarReturn = ReturnType<
  typeof useBookingPageChooseDateAndCar
>
