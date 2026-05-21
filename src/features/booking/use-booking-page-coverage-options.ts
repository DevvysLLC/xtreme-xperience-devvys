'use client'

import { useCallback, useMemo } from 'react'
import { CHOOSE_ON_DRIVE_DAY_INPUT_VALUE } from '../../config/settings'
import { logger } from '../../core/logger/logger'
import { BookingPageCoverageOptionsFormValueSchema } from '../../io/schemas'
import type {
  BookingPageCoverageOptionsFormValue,
  BookingWizardPageCoverageOptionsInput
} from '../../io/types'
import { getFormValue } from '../../utils/get-form-value'
import { useCart } from '../cart'
import { LOG_NAMESPACE } from './config'
import { useBooking } from './use-booking'
import { useBookingSetCoverageOptions } from './use-booking-set-coverage-options'

/**
 * Coverage options selection page hook
 *
 * - Stores insurance/coverage selections
 * - Validates cart matches stored data
 * - Requires date and car page to be complete
 */
export const useBookingPageCoverageOptions = () => {
  const { data } = useBooking()
  const { data: cartData } = useCart()
  const contents = cartData?.contents ?? {}
  const setCoverageOptions = useBookingSetCoverageOptions()

  const get = useCallback(() => {
    logger.info({ data }, `${LOG_NAMESPACE}: page.coverageOptions.get`)
    return data?.coverage_options ?? null
  }, [data])
  const persisted = data?.coverage_options ?? null

  const getDefaultFormValues = useCallback(
    (params: {
      insuranceSessions: number
      firstInsuranceRocketRezId: string
      firstInsuranceRocketRezType: string
    }): BookingPageCoverageOptionsFormValue => {
      const storedState = get()
      const storedValueResult =
        storedState?.value !== null && storedState?.value !== undefined
          ? BookingPageCoverageOptionsFormValueSchema.safeParse(
              storedState.value
            )
          : { success: false, data: null }
      const stored = storedValueResult.success ? storedValueResult.data : null

      const quantity = getFormValue(
        null,
        stored?.quantity,
        params.insuranceSessions
      )
      const id = getFormValue(
        null,
        stored?.id,
        params.firstInsuranceRocketRezId || ''
      )
      const type = getFormValue(
        null,
        stored?.type,
        params.firstInsuranceRocketRezType || ''
      )

      const parsed = BookingPageCoverageOptionsFormValueSchema.safeParse({
        quantity:
          typeof quantity === 'number' ? quantity : params.insuranceSessions,
        id:
          typeof id === 'string' ? id : params.firstInsuranceRocketRezId || '',
        type:
          typeof type === 'string'
            ? type
            : params.firstInsuranceRocketRezType || '',
        isValid: false,
        isSubmitted: false
      })

      const value: BookingPageCoverageOptionsFormValue = parsed.success
        ? parsed.data
        : (() => {
            if (!parsed.success) {
              logger.error(
                { issues: parsed.error.issues },
                `${LOG_NAMESPACE}: page.coverageOptions.getDefaultFormValues: Invalid form value, using fallback`
              )
            }
            return BookingPageCoverageOptionsFormValueSchema.parse({
              quantity: params.insuranceSessions,
              id: params.firstInsuranceRocketRezId || '',
              type: params.firstInsuranceRocketRezType || '',
              isValid: false,
              isSubmitted: false
            })
          })()

      logger.info(
        { params, value },
        `${LOG_NAMESPACE}: page.coverageOptions.getDefaultFormValues`
      )
      return value
    },
    [get]
  )

  const save = useCallback(
    (input: BookingWizardPageCoverageOptionsInput) =>
      setCoverageOptions.mutateAsync(input),
    [setCoverageOptions]
  )

  const isValid = useCallback(() => {
    const valid = Boolean(data?.date_and_car) && contents.cartHasValidInsurance

    logger.info({ valid }, `${LOG_NAMESPACE}: page.coverageOptions.isValid`)

    return valid
  }, [data?.date_and_car, contents.cartHasValidInsurance])

  const skipCoverageOptions = useCallback(async () => {
    const formValue = {
      quantity: contents.insuranceSessions ?? 0,
      id: CHOOSE_ON_DRIVE_DAY_INPUT_VALUE,
      type: 'Retail',
      isValid: true,
      isSubmitted: false
    }

    logger.info(
      { formValue },
      `${LOG_NAMESPACE}: page.coverageOptions.skipCoverageOptions: Auto-setting coverage options to skip this page`
    )

    await save({
      value: formValue,
      pageIsValid: true,
      userHasSubmitted: false,
      chooseOnDriveDay: true
    })

    logger.info(
      { formValue },
      `${LOG_NAMESPACE}: page.coverageOptions.skipCoverageOptions: Page value set`
    )
  }, [save, contents.insuranceSessions])

  return useMemo(
    () => ({
      persisted,
      get,
      save,
      set: save,
      isValid,
      getDefaultFormValues,
      skipCoverageOptions
    }),
    [persisted, get, save, isValid, getDefaultFormValues, skipCoverageOptions]
  )
}

export type UseBookingPageCoverageOptionsReturn = ReturnType<
  typeof useBookingPageCoverageOptions
>
