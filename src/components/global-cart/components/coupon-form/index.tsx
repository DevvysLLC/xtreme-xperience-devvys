'use client'

import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { useCartCouponAdd } from '../../../../features/cart'
import { useToast } from '../../../../features/toast'
import { RocketRezAddCouponRequestSchema } from '../../../../io/schemas'
import styles from './style.module.scss'

export const CouponForm: FC = () => {
  const t = useTranslations('global_cart.coupon')
  const { showToast } = useToast()
  const { mutateAsync, isPending } = useCartCouponAdd()

  const form = useForm({
    defaultValues: {
      coupon: ''
    },
    onSubmit: async ({ value }) => {
      try {
        if (!value.coupon.trim()) {
          showToast({
            message: t('error.code_required'),
            type: 'error'
          })
          form.reset()
          return
        }

        // Validate the form value
        const validated = RocketRezAddCouponRequestSchema.parse({
          coupon: value.coupon.trim()
        })

        await mutateAsync({ coupon: validated.coupon })
        showToast({
          message: t('success.applied'),
          type: 'success'
        })
        form.reset()
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : t('error.generic')
        showToast({
          message: errorMessage,
          type: 'error'
        })
        form.reset()
      }
    }
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
      className={styles.form}
    >
      <form.Field
        name="coupon"
        validators={{
          onChange: ({ value }) => {
            if (!value.trim()) {
              return t('validation.code_required')
            }
            return undefined
          }
        }}
      >
        {(field) => (
          <div className={styles.form__field}>
            <div className={styles.form__row}>
              <input
                type="text"
                name={field.name}
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(e.target.value)
                }}
                onBlur={field.handleBlur}
                placeholder={t('placeholder.enter_code')}
                className={styles.form__input}
                disabled={isPending}
                aria-label={t('label.code')}
              />
              <button
                type="submit"
                disabled={isPending || !field.state.value.trim()}
                className={styles.form__button}
              >
                {isPending ? t('button.applying') : t('button.apply')}
              </button>
            </div>
            {field.state.meta.errors.length > 0 && (
              <span className={styles.form__error} role="alert">
                {field.state.meta.errors[0]}
              </span>
            )}
          </div>
        )}
      </form.Field>
    </form>
  )
}
