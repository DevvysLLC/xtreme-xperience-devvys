'use client'

import { useForm } from '@tanstack/react-form'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { type FC, useState } from 'react'
import { logger } from '../../core/logger/logger'
import { useToast } from '../../features/toast'
import type { FormField, FormProviderConfig } from '../../server/forms/types'
import { CoreCta } from '../core-cta'
import { CoreFormField } from '../core-form-field'
import { CoreTextMarkdown } from '../core-text-markdown'
import type { SectionContactFragment } from '../section-contact/section-contact.typegen'
import styles from './style.module.scss'

type FormData = NonNullable<SectionContactFragment['form']>

export type Props = {
  data: FormData
  className?: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

type FormSubmissionPayload = {
  provider: string
  fields: FormField[]
  config?: FormProviderConfig
}

type FormSubmissionResponse = {
  status: 'success' | 'error'
  message: string
}

/**
 * Type guard to check if a value is a valid FormSubmissionResponse
 */
const isFormSubmissionResponse = (
  value: unknown
): value is FormSubmissionResponse => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  // Use 'in' operator to check property existence without type assertions
  if (!('status' in value) || !('message' in value)) {
    return false
  }
  const { status, message } = value
  return (
    (status === 'success' || status === 'error') && typeof message === 'string'
  )
}

export const CoreForm: FC<Props> = ({ data, className }) => {
  const t = useTranslations('core_form')
  const { showToast } = useToast()
  const [status, setStatus] = useState<FormStatus>('idle')
  const { model } = data

  // Build initial form values from field definitions
  const buildDefaultValues = () => {
    const values: Record<string, string> = {}
    values.provider = model?.formProvider ?? ''
    model?.formFields.forEach((field) => {
      values[field.fieldName] = ''
    })
    return values
  }

  const form = useForm({
    defaultValues: buildDefaultValues(),
    onSubmit: async ({ value }) => {
      setStatus('submitting')

      try {
        // Extract provider from form values
        const provider = value.provider

        if (!provider) {
          logger.error('CoreForm: No provider specified')
          setStatus('error')
          return
        }

        // Build fields array from form values (excluding provider)
        const fields: FormField[] = Object.entries(value)
          .filter(([key]) => key !== 'provider')
          .map(([name, fieldValue]) => ({
            name,
            value: fieldValue
          }))

        // Build the submission payload
        const payload: FormSubmissionPayload = {
          provider,
          fields,
          config: {
            pageUri:
              typeof window !== 'undefined' ? window.location.href : undefined,
            pageName:
              typeof document !== 'undefined' ? document.title : undefined
          }
        }

        const response = await fetch('/api/v1/frontend/form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        const result: unknown = await response.json()

        if (!isFormSubmissionResponse(result)) {
          logger.error({ result }, 'CoreForm: invalid response format')
          showToast({
            message: t('error.submission_failed'),
            type: 'error'
          })
          setStatus('error')
          return
        }

        if (result.status === 'success') {
          setStatus('success')
        } else {
          logger.error(
            { message: result.message },
            'CoreForm: submission failed'
          )
          showToast({
            message: result.message,
            type: 'error'
          })
          setStatus('error')
        }
      } catch (error) {
        logger.error({ error }, 'CoreForm: submission error')
        showToast({
          message: t('error.submission_failed'),
          type: 'error'
        })
        setStatus('error')
      }
    }
  })

  if (!model) {
    return null
  }

  const {
    formFields,
    formProvider,
    formSubmitButton,
    successTitle,
    successDescription,
    successButton
  } = model

  return (
    <>
      {status === 'success' ? (
        <div className={clsx(styles.form, className)}>
          {successTitle && (
            <h3 className={styles.form__title}>{successTitle}</h3>
          )}

          {successDescription && (
            <div className={styles.form__description}>
              <CoreTextMarkdown type="rte">
                {successDescription}
              </CoreTextMarkdown>
            </div>
          )}

          {successButton && (
            <div className={styles.form__actions}>
              <CoreCta data={successButton} />
            </div>
          )}
        </div>
      ) : (
        <form
          className={clsx(styles.form, className)}
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          noValidate
        >
          <form.Field name="provider">
            {() => (
              <input type="hidden" name="provider" value={formProvider ?? ''} />
            )}
          </form.Field>

          <div className={styles.form__fields}>
            {formFields.map((fieldData) => (
              <form.Field
                key={fieldData.id}
                name={fieldData.fieldName}
                validators={{
                  onChange: ({ value }: { value: string }) => {
                    if (fieldData.fieldRequired && !value) {
                      return fieldData.fieldError ?? t('validation.required')
                    }
                    return undefined
                  },
                  onSubmit: ({ value }: { value: string }) => {
                    if (fieldData.fieldRequired && !value) {
                      return fieldData.fieldError ?? t('validation.required')
                    }
                    return undefined
                  }
                }}
              >
                {(field) => (
                  <CoreFormField
                    data={fieldData}
                    value={field.state.value}
                    errors={field.state.meta.errors.map((e) =>
                      typeof e === 'string' ? e : undefined
                    )}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                  />
                )}
              </form.Field>
            ))}
          </div>

          {formSubmitButton && (
            <div className={styles.form__actions}>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <CoreCta
                    className={styles.form__submit}
                    href={null}
                    text={formSubmitButton}
                    type="submit"
                    disabled={
                      !canSubmit || isSubmitting || status === 'submitting'
                    }
                  />
                )}
              </form.Subscribe>
            </div>
          )}
        </form>
      )}
    </>
  )
}
