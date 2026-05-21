'use client'

import clsx from 'clsx'
import type { FC } from 'react'
import { CoreFormFieldOption } from '../core-form-field-option'
import type { CoreFormFieldFragment } from './core-form-field.typegen'
import styles from './style.module.scss'

export type Props = {
  data: CoreFormFieldFragment
  value: string
  errors: (string | undefined)[]
  onChange: (value: string) => void
  onBlur: () => void
}

export const CoreFormField: FC<Props> = ({
  data,
  value,
  errors,
  onChange,
  onBlur
}) => {
  const {
    id,
    fieldType,
    fieldName,
    fieldRequired,
    fieldLabel,
    fieldPlaceholder,
    fieldSize,
    fieldOptions
  } = data

  const fieldId = `field-${id}`
  const errorMessages = errors.filter((e): e is string => Boolean(e))
  const hasError = errorMessages.length > 0

  const renderInput = () => {
    switch (fieldType) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            name={fieldName}
            className={clsx(
              styles.field__input,
              hasError && styles['field__input--error']
            )}
            placeholder={fieldPlaceholder ?? undefined}
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
            }}
            onBlur={onBlur}
            rows={4}
            required={fieldRequired}
          />
        )

      case 'select':
        return (
          <select
            id={fieldId}
            name={fieldName}
            className={clsx(
              styles.field__input,
              hasError && styles['field__input--error']
            )}
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
            }}
            onBlur={onBlur}
            required={fieldRequired}
          >
            <option value="" disabled>
              {fieldPlaceholder ?? ''}
            </option>
            {fieldOptions.map((option) => (
              <CoreFormFieldOption
                key={option.id}
                type="select"
                data={option}
              />
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <div className={styles.field__options}>
            {fieldOptions.map((option) => (
              <CoreFormFieldOption
                key={option.id}
                type="checkbox"
                data={option}
                fieldName={fieldName}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                fieldRequired={fieldRequired}
              />
            ))}
          </div>
        )

      case 'radio':
        return (
          <div className={styles.field__options}>
            {fieldOptions.map((option) => (
              <CoreFormFieldOption
                key={option.id}
                type="radio"
                data={option}
                fieldName={fieldName}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                fieldRequired={fieldRequired}
              />
            ))}
          </div>
        )

      default:
        return (
          <input
            id={fieldId}
            name={fieldName}
            type={fieldType}
            className={clsx(
              styles.field__input,
              hasError && styles['field__input--error']
            )}
            placeholder={fieldPlaceholder ?? undefined}
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
            }}
            onBlur={onBlur}
            required={fieldRequired}
          />
        )
    }
  }

  const isGroupField = fieldType === 'checkbox' || fieldType === 'radio'

  if (isGroupField) {
    return (
      <fieldset
        className={clsx(styles.field, styles[`field--${fieldSize}`])}
        data-width={fieldSize}
      >
        <legend className={styles.field__legend}>{fieldLabel}</legend>

        {renderInput()}

        {hasError && (
          <span className={styles.field__error}>
            {errorMessages.join(', ')}
          </span>
        )}
      </fieldset>
    )
  }

  return (
    <div
      className={clsx(styles.field, styles[`field--${fieldSize}`])}
      data-width={fieldSize}
    >
      <label htmlFor={fieldId} className={styles.field__label}>
        {fieldLabel}
      </label>

      {renderInput()}

      {hasError && (
        <span className={styles.field__error}>{errorMessages.join(', ')}</span>
      )}
    </div>
  )
}
