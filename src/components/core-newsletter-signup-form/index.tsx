'use client'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { type FC, type FormEvent, useState } from 'react'
import type { FooterConfigFragment } from '../../core/dato/fragments/footer-config.typegen'
import { useNewsletter } from '../../features/newsletter'
import styles from './style.module.scss'

export type Props = {
  config: FooterConfigFragment
  className?: string
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const CoreNewsletterSignupForm: FC<Props> = ({ config, className }) => {
  const t = useTranslations('core_newsletter_signup_form')
  const {
    newsletterTitle: datoNewsletterTitle,
    newsletterDescription: datoNewsletterDescription,
    newsletterFieldPlaceholder: datoNewsletterFieldPlaceholder,
    newsletterSubmitButton: datoNewsletterSubmitButton,
    newsletterNote: datoNewsletterNote,
    newsletterSuccessMessage: datoNewsletterSuccessMessage
  } = config ?? {}
  const [email, setEmail] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { subscribe, isLoading } = useNewsletter()

  const title = datoNewsletterTitle || t('title')
  const description = datoNewsletterDescription || t('description')
  const fieldPlaceholder =
    datoNewsletterFieldPlaceholder || t('placeholder.email')
  const submitButton = datoNewsletterSubmitButton || t('button.submit')
  const note = datoNewsletterNote || t('info')
  const successMessageText =
    datoNewsletterSuccessMessage || t('message.success')

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setEmail(value)
    setValidationError(null)
    setSubmitError(null)
    setSuccessMessage(null)
  }

  const handleBlur = () => {
    if (email && !isValidEmail(email)) {
      setValidationError(t('validation.invalid'))
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setValidationError(null)
    setSubmitError(null)
    setSuccessMessage(null)

    if (!email) {
      setValidationError(t('validation.required'))
      return
    }

    if (!isValidEmail(email)) {
      setValidationError(t('validation.invalid'))
      return
    }

    const result = await subscribe(email)

    if (result.status === 'success') {
      setSuccessMessage(successMessageText)
      setEmail('')
    } else {
      setSubmitError(result.message)
    }
  }

  const displayError = validationError || submitError

  return (
    <div className={clsx(styles.newsletterSignupForm, className)}>
      <div className={styles.content}>
        <h2 className={styles.content__title}>{title}</h2>
        <p className={styles.content__description}>{description}</p>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.form__group}>
          <label className={styles.form__label}>
            <span>{t('label.email')}</span>
            <input
              className={styles.form__input}
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleBlur}
              placeholder={fieldPlaceholder}
              aria-invalid={displayError ? 'true' : 'false'}
              aria-describedby={
                displayError || successMessage
                  ? 'newsletter-message'
                  : undefined
              }
            />
          </label>
          <button
            type="submit"
            className={styles.form__button}
            disabled={isLoading || !!validationError}
          >
            {isLoading ? t('button.submitting') : submitButton}
          </button>
        </div>
        {(displayError || successMessage) && (
          <span
            id="newsletter-message"
            className={displayError ? styles.form__error : styles.form__success}
          >
            {displayError || successMessage}
          </span>
        )}
      </form>
      <p className={styles.info}>{note}</p>
    </div>
  )
}
