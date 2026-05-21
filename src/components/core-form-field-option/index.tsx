'use client'

import type { FC } from 'react'
import type { CoreFormFieldOptionFragment } from './core-form-field-option.typegen'
import styles from './style.module.scss'

type BaseProps = {
  data: CoreFormFieldOptionFragment
}

type SelectProps = BaseProps & {
  type: 'select'
}

type CheckboxProps = BaseProps & {
  type: 'checkbox'
  fieldName: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  fieldRequired?: boolean
}

type RadioProps = BaseProps & {
  type: 'radio'
  fieldName: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  fieldRequired?: boolean
}

export type Props = SelectProps | CheckboxProps | RadioProps

export const CoreFormFieldOption: FC<Props> = (props) => {
  const { data, type } = props

  if (type === 'select') {
    return (
      <option key={data.id} value={data.optionValue}>
        {data.optionLabel}
      </option>
    )
  }

  if (type === 'checkbox') {
    const { fieldName, value, onChange, onBlur, fieldRequired } = props
    const currentValues = value ? value.split(',').filter(Boolean) : []
    const isChecked = currentValues.includes(data.optionValue)

    return (
      <label className={styles.option}>
        <input
          type="checkbox"
          name={fieldName}
          value={data.optionValue}
          checked={isChecked}
          onChange={(e) => {
            if (e.target.checked) {
              onChange([...currentValues, data.optionValue].join(','))
            } else {
              onChange(
                currentValues.filter((v) => v !== data.optionValue).join(',')
              )
            }
            // Mark field as touched to trigger immediate validation display
            onBlur()
          }}
          onBlur={onBlur}
          className={styles.option__checkbox}
          required={fieldRequired}
        />
        <span>{data.optionLabel}</span>
      </label>
    )
  }

  // type === 'radio'
  const { fieldName, value, onChange, onBlur, fieldRequired } = props

  return (
    <label className={styles.option}>
      <input
        type="radio"
        name={fieldName}
        value={data.optionValue}
        checked={value === data.optionValue}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        onBlur={onBlur}
        className={styles.option__radio}
        required={fieldRequired}
      />
      <span>{data.optionLabel}</span>
    </label>
  )
}
