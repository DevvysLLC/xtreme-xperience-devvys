'use client'

import { useForm } from '@tanstack/react-form'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { type FC, useEffect } from 'react'
import type { AddonFragment } from '../../core/dato/fragments/addon.typegen'
import { useCart, useCartAddAddon } from '../../features/cart'
import { useToast } from '../../features/toast'
import type { RocketRezProductTypeValue } from '../../io'
import { RocketRezProductType } from '../../io/schemas'
import type { RocketRezAddLineItemAddon } from '../../io/types'
import { DRAWER_REQUEST_OPEN_MESSAGE_NAME } from '../../core/messaging/main/messages/open-drawer'
import { useMainBus } from '../../core/messaging/main/react'
import { CART_DRAWER_ID } from '../global-cart'
import { CoreCta } from '../core-cta'
import type { LayoutType, SizeType, StyleType } from '../core-cta/io'
import { QuantitySelector } from './components/quantity-selector'
import styles from './style.module.scss'

const MAX_QUANTITY = 5

export type CoreAddToCartFormProps = {
  id: number
  type: RocketRezProductTypeValue
  quantity?: number
  scheduleId?: number | null
  rateId?: number | null
  rateType?: string | null
  addon: AddonFragment
  buttonText?: string
  layoutType?: LayoutType
  styleType?: StyleType
  sizeType?: SizeType
  className?: string
  showQuantitySelector?: boolean
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const CoreAddToCartForm: FC<CoreAddToCartFormProps> = (props) => {
  const t = useTranslations('core_add_to_cart_form')
  const { showToast } = useToast()
  const {
    id,
    type,
    quantity: initialQuantity = 1,
    addon,
    buttonText,
    layoutType = 'button',
    styleType = 'black',
    sizeType = 'medium',
    className,
    showQuantitySelector = false,
    onSuccess,
    onError
  } = props
  const { mutateAsync, isPending } = useCartAddAddon()
  const { data: cart } = useCart()
  const bus = useMainBus(DRAWER_REQUEST_OPEN_MESSAGE_NAME, () => {
    // No-op
  })
  const defaultValues = {
    id,
    type,
    quantity: initialQuantity
  }
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const isMissingRequiredProps = !value.id || !value.type
      if (isMissingRequiredProps) {
        const error = t('error.missing_required')
        onError?.(new Error(error))
        return
      }
      const lineItem: RocketRezAddLineItemAddon = {
        id: value.id,
        type: value.type,
        quantity: value.quantity
      }

      const parentEventLineItem = (cart?.cartData?.lineItems ?? []).find(
        (item) =>
          item.type.toLowerCase() === RocketRezProductType.EVENT.toLowerCase()
      )

      if (parentEventLineItem) {
        lineItem.parentLineItemId = parentEventLineItem.id
      }

      const selectedDateTime =
        cart?.metadata.find((meta) => meta.type === 'car')?.properties?.date ??
        null

      try {
        await mutateAsync({
          addon,
          lineItem,
          date: selectedDateTime
        })
        showToast({
          message: t('notifications.added_to_cart'),
          type: 'success'
        })
        bus.send({
          name: DRAWER_REQUEST_OPEN_MESSAGE_NAME,
          details: { id: CART_DRAWER_ID }
        })
        onSuccess?.()
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : t('error.generic')
        showToast({
          message: t('notifications.error_adding_to_cart'),
          type: 'error'
        })
        onError?.(err instanceof Error ? err : new Error(errorMessage))
      }
    }
  })

  useEffect(() => {
    form.setFieldValue('id', id)
  }, [id, form])

  useEffect(() => {
    form.setFieldValue('type', type)
  }, [type, form])

  useEffect(() => {
    form.setFieldValue('quantity', initialQuantity)
  }, [initialQuantity, form])

  const buttonLabel = buttonText ?? t('button.add')
  const buttonLoadingLabel = t('button.adding')
  const isMissingRequiredProps = !id || !type
  const hasValidationError = isMissingRequiredProps

  const getValidationError = (): string | null => {
    if (isMissingRequiredProps) {
      return t('error.missing_required')
    }
    return null
  }

  const displayError = hasValidationError ? getValidationError() : null

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
      className={clsx(styles.form, className)}
      aria-label={t('aria.form_label')}
    >
      <form.Field name="id">
        {(field) => (
          <input type="hidden" name={field.name} value={field.state.value} />
        )}
      </form.Field>

      <form.Field name="type">
        {(field) => (
          <input type="hidden" name={field.name} value={field.state.value} />
        )}
      </form.Field>

      <form.Field name="quantity">
        {(field) => (
          <>
            <input type="hidden" name={field.name} value={field.state.value} />
            {showQuantitySelector && (
              <QuantitySelector
                value={field.state.value}
                onChange={(value) => {
                  field.handleChange(value)
                }}
                min={0}
                max={MAX_QUANTITY}
                name={field.name}
              />
            )}
          </>
        )}
      </form.Field>

      <CoreCta
        text={isPending ? buttonLoadingLabel : buttonLabel}
        href={null}
        type="submit"
        layoutType={layoutType}
        styleType={styleType}
        sizeType={sizeType}
        disabled={isPending || hasValidationError}
        className={styles.form__button}
      />

      {displayError && (
        <span className={styles.form__error} role="alert">
          {displayError}
        </span>
      )}
    </form>
  )
}
