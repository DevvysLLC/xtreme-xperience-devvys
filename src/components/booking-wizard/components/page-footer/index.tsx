'use client'

import { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ROUTES } from '../../../../config/routes'
import { useCart } from '../../../../features/cart'
import { CoreCta } from '../../../core-cta'
import styles from './style.module.scss'

type FormState = {
  canSubmit: boolean
  isSubmitting: boolean
}

type FormWithSubscribe = {
  Subscribe: React.FC<{
    selector: (state: FormState) => [boolean, boolean]
    children: (values: [boolean, boolean]) => React.ReactNode
  }>
}

type Props = {
  title?: string
  subtitle?: string
  form?: FormWithSubscribe
  isPending?: boolean
  disabled?: boolean
  backText: string
  submitText: string
  savingText: string
  onBack?: () => void
  onSubmit?: () => void
}

export const PageFooter: React.FC<Props> = ({
  title,
  subtitle,
  form,
  isPending = false,
  disabled = false,
  backText,
  submitText,
  savingText,
  onBack,
  onSubmit
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const { data: cartData } = useCart()
  const discountTotal = cartData?.cartData?.discountTotal ?? 0

  const subtotal = useMemo(() => {
    const items = cartData?.cartData?.lineItems ?? []
    return items.reduce((acc, item) => acc + item.price * (item.quantity ?? 1), 0)
  }, [cartData?.cartData?.lineItems])

  const totalSavings = useMemo(() => {
    let metadataSavings = 0
    const metadata = cartData?.metadata ?? []
    for (const item of metadata) {
      const props = item.properties
      const itemSavings =
        props &&
        typeof props === 'object' &&
        'savings' in props &&
        typeof props.savings === 'number'
          ? props.savings
          : 0
      if (itemSavings > 0) {
        metadataSavings += itemSavings
      }
    }
    return Math.round(Math.max(discountTotal, metadataSavings))
  }, [cartData?.metadata, discountTotal])

  const handleBack =
    onBack ??
    (() => {
      router.push(ROUTES.BOOKING.HOME)
    })

  const renderActions = (canSubmit: boolean, isSubmitting: boolean) => (
    <div className={styles.footer__actions}>
      <CoreCta
        type={onSubmit ? 'button' : 'submit'}
        onClick={onSubmit}
        disabled={!canSubmit || isSubmitting || isPending || disabled}
        className={styles.footer__submit}
        href={null}
        layoutType="button"
        styleType="orange"
        sizeType="small"
        text={isPending ? savingText : submitText}
      />
    </div>
  )

  return (
    <div className={styles.footer}>
      <div className={styles.footer__left}>
        <div className={styles.footer__back}>
          <button
            type="button"
            onClick={handleBack}
            className={styles.footer__back_button}
          >
            <span className={styles.footer__back_arrow}>&larr;</span>
            <span className={styles.footer__back_text}>{backText}</span>
          </button>
        </div>

        <div className={styles.footer__pricing}>
          <span className={styles.footer__pricing_label}>
            {pathname.includes('/review')
              ? 'Estimated total before tax'
              : subtotal > 0
                ? 'Subtotal'
                : 'Your booking'}
          </span>
          <strong className={styles.footer__pricing_value}>
            ${subtotal.toLocaleString()}
          </strong>
          {totalSavings > 0 && (
            <span className={styles.footer__savings}>
              You save ${totalSavings.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {(title || subtitle) && (
        <div className={styles.footer__content}>
          {title && <p className={styles.footer__title}>{title}</p>}
          {subtitle && <p className={styles.footer__subtitle}>{subtitle}</p>}
        </div>
      )}

      {form ? (
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) =>
            renderActions(canSubmit, isSubmitting)
          }
        </form.Subscribe>
      ) : (
        renderActions(true, false)
      )}
    </div>
  )
}
