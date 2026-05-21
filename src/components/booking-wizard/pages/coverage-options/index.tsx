'use client'

import { useForm } from '@tanstack/react-form'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { logger } from '../../../../core/logger/logger'
import {
  useBookingPageCoverageOptions,
  useBookingPageMetadata,
  useBookingRequestBackNavigation,
  useBookingWithCart
} from '../../../../features/booking'
import { useCartReplaceInsurance } from '../../../../features/cart'
import { useToast } from '../../../../features/toast'
import { BookingLayout } from '../../components/booking-layout'
import { InsuranceOptions } from '../../components/insurance-options'
import { PageFooter } from '../../components/page-footer'
import { PageHeader } from '../../components/page-header'
import { useBookingWizardState } from '../../context'

export const CoverageOptionsPage = () => {
  const t = useTranslations('booking_wizard.pages.coverage_options')
  const { booking, cart, isLoading } = useBookingWithCart()
  const { state } = useBookingWizardState()
  const pathname = usePathname()
  const pageMetadata = useBookingPageMetadata({
    pages: state.configData?.pages ?? null
  })
  const { mutate: requestBackNavigation } = useBookingRequestBackNavigation()
  const { hasCars, totalCars, insuranceSessions } = cart?.contents ?? {}
  const { mutateAsync: replaceInsurance, isPending } = useCartReplaceInsurance()
  const pageHook = useBookingPageCoverageOptions()
  const runOnceRef = useRef(true)
  const { showToast } = useToast()

  const footerSubtitle = hasCars
    ? t('footer.subtitle.cars_added', { count: totalCars })
    : t('footer.subtitle.select_car')
  const insuranceOptions = useMemo(
    () => state.configData?.insurance ?? [],
    [state.configData?.insurance]
  )
  const firstInsuranceRocketRezId =
    insuranceOptions[0]?.model?.rocketRezId ?? ''
  const firstInsuranceRocketRezType =
    insuranceOptions[0]?.model?.rocketRezType ?? ''
  const title = pageMetadata?.title ?? t('title')
  const description = pageMetadata?.description ?? t('description')

  // load persisted or default values
  const { getDefaultFormValues } = pageHook
  const defaultValues = useMemo(
    () =>
      getDefaultFormValues({
        insuranceSessions: insuranceSessions ?? 0,
        firstInsuranceRocketRezId: firstInsuranceRocketRezId ?? '',
        firstInsuranceRocketRezType: firstInsuranceRocketRezType ?? ''
      }),
    [
      getDefaultFormValues,
      insuranceSessions,
      firstInsuranceRocketRezId,
      firstInsuranceRocketRezType
    ]
  )

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      logger.info({ value }, 'coverage-options-page.onSubmit')

      const selectedInsurance = insuranceOptions.find(
        (option) => option.model?.rocketRezId === value.id
      )

      if (!selectedInsurance) {
        logger.error(
          { value, insuranceOptions },
          'coverage-options-page.onSubmit: insurance not found'
        )
        return
      }

      const lineItem = {
        id: Number(value.id),
        type: value.type || selectedInsurance.model?.rocketRezType || '',
        quantity: value.quantity
      }

      try {
        await replaceInsurance({
          insurance: selectedInsurance,
          lineItem
        })

        const pageIsValid = pageHook.isValid()

        await pageHook.save({
          value,
          pageIsValid,
          userHasSubmitted: true
        })
      } catch (error) {
        logger.error({ error, value }, 'coverage-options-page.onSubmit: error')
        showToast({ message: t('notifications.error_saving'), type: 'error' })
      }
    }
  })

  // we can skip this page under certain circumstances
  // this is to avoid the user having to select insurance when insuranceSessions === 0
  // IMPORTANT: we must wait for the cart to be loaded before making this decision
  // otherwise insuranceSessions === 0 during loading would incorrectly trigger a skip
  const { skipCoverageOptions } = pageHook
  useEffect(() => {
    const handleSkipCoverageOptionsAsync = async () => {
      // Don't skip while cart is still loading - insuranceSessions defaults to 0 before cart data loads
      if (isLoading) {
        return
      }
      if (runOnceRef.current && cart.contents.insuranceSessions === 0) {
        logger.info(
          'coverage-options-page.useEffect: skipping coverage options'
        )
        runOnceRef.current = false
        await skipCoverageOptions()
      }
    }
    handleSkipCoverageOptionsAsync()
  }, [skipCoverageOptions, cart.contents.insuranceSessions, isLoading])

  // Update isValid based on cart contents
  useEffect(() => {
    const isValid = pageHook.isValid()
    form.setFieldValue('isValid', isValid)
    // Intentionally omit pageHook to prevent infinite re-render loop.
    // pageHook.isValid() reads cart contents; only re-run when those change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cart?.contents?.cartHasValidInsurance,
    cart?.contents?.hasCars,
    cart?.contents?.totalCars,
    cart?.contents?.totalSessions,
    form
  ])

  // Update quantity when insuranceSessions changes (sessions that require insurance)
  useEffect(() => {
    form.setFieldValue('quantity', insuranceSessions)
  }, [insuranceSessions, form])

  // Update id and type when firstInsuranceRocketRezId and firstInsuranceRocketRezType change
  useEffect(() => {
    if (firstInsuranceRocketRezId) {
      const currentId = form.getFieldValue('id')
      if (!currentId || currentId.trim() === '') {
        form.setFieldValue('id', firstInsuranceRocketRezId)
        if (firstInsuranceRocketRezType) {
          form.setFieldValue('type', firstInsuranceRocketRezType)
        }
      }
    }
  }, [firstInsuranceRocketRezId, firstInsuranceRocketRezType, form])

  // handle errors
  useEffect(() => {
    if (booking?.error) {
      showToast({ message: booking.error, type: 'error' })
    }
  }, [booking?.error, showToast])

  // Compute disabled client-side only to avoid SSR/client hydration mismatch.
  // During SSR, formId is '' (no store data), which would render disabled={true}.
  // On the client, formId is the persisted value ('56' etc), rendering disabled={false}.
  // React 19 does not patch up hydration mismatches, so the server-disabled button
  // would stay disabled. Using useState(false) ensures server and client agree on
  // the initial render, then the effect updates to the real value after mount.
  const [isDisabled, setIsDisabled] = useState(false)
  useEffect(() => {
    setIsDisabled(!form.store.state.values.id || form.store.state.isSubmitting)
  }, [form.store.state.values.id, form.store.state.isSubmitting])

  const handleBack = () => {
    requestBackNavigation({ fromPath: pathname })
  }

  return (
    <BookingLayout>
      <section>
        <PageHeader title={title} description={description} />

        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field name="quantity">
            {(field) => (
              <input
                type="hidden"
                name={field.name}
                value={field.state.value}
              />
            )}
          </form.Field>
          <form.Field name="type">
            {(field) => (
              <input
                type="hidden"
                name={field.name}
                value={field.state.value || ''}
              />
            )}
          </form.Field>
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
          <form.Field
            name="id"
            validators={{
              onMount: ({ value }) =>
                !value.trim() ? t('validation.required') : undefined,
              onChange: ({ value }) =>
                !value.trim() ? t('validation.required') : undefined
            }}
          >
            {(field) => (
              <InsuranceOptions
                form={form}
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors[0]
                    : undefined
                }
              />
            )}
          </form.Field>
          <PageFooter
            title={t('footer.title')}
            subtitle={footerSubtitle}
            isPending={isPending}
            onBack={handleBack}
            backText={t('button.back')}
            submitText={t('button.continue')}
            savingText={t('button.saving')}
            onSubmit={form.handleSubmit}
            disabled={isDisabled}
          />
        </form>
      </section>
    </BookingLayout>
  )
}
