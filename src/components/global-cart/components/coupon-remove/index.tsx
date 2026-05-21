'use client'

import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { CoreIcon } from '../../../../components/core-icon'
import { useCartCouponRemove } from '../../../../features/cart'
import { useToast } from '../../../../features/toast'
import type { RocketRezCoupon } from '../../../../io/types'
import styles from './style.module.scss'

type Props = {
  coupon: RocketRezCoupon
}

export const CouponRemove: FC<Props> = ({ coupon }) => {
  const t = useTranslations('global_cart.coupon')
  const { showToast } = useToast()
  const { mutateAsync, isPending } = useCartCouponRemove()

  const form = useForm({
    defaultValues: {
      id: coupon.id
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({ id: value.id })
        showToast({
          message: t('success.removed'),
          type: 'success'
        })
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : t('error.generic')
        showToast({
          message: errorMessage,
          type: 'error'
        })
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
      <form.Field name="id">
        {(field) => (
          <>
            <input type="hidden" name={field.name} value={field.state.value} />
            <div className={styles.form__content}>
              <label className={styles.form__label}>
                {coupon.code ?? coupon.serial ?? ''}
              </label>
              <button
                type="submit"
                disabled={isPending}
                className={styles.form__button}
                aria-label={t('button.remove')}
              >
                <CoreIcon icon="close" />
              </button>
            </div>
          </>
        )}
      </form.Field>
    </form>
  )
}
