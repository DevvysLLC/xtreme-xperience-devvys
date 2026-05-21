'use client'

import { useRouter } from 'next/navigation'
import { ROUTES } from '../../../../config/routes'
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
  const handleBack =
    onBack ??
    (() => {
      router.push(ROUTES.BOOKING.HOME)
    })

  const renderActions = (canSubmit: boolean, isSubmitting: boolean) => (
    <div className={styles.footer__actions}>
      <CoreCta
        type="button"
        onClick={handleBack}
        layoutType="underline"
        styleType="black"
        sizeType="large"
        text={backText}
      />

      <CoreCta
        type={onSubmit ? 'button' : 'submit'}
        onClick={onSubmit}
        disabled={!canSubmit || isSubmitting || isPending || disabled}
        className={styles.footer__submit}
        href={null}
        layoutType="button"
        styleType="black"
        sizeType="small"
        text={isPending ? savingText : submitText}
      />
    </div>
  )

  return (
    <div className={styles.footer}>
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
