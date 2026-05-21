'use client'

import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { CoreIcon } from '../../../core-icon'
import styles from './style.module.scss'

type Props = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  name?: string
}

export const QuantitySelector: FC<Props> = ({
  value,
  onChange,
  min = 1,
  max,
  name = 'quantity'
}) => {
  const t = useTranslations('booking_wizard.quantity')

  const handleDecrement = () => {
    onChange(Math.max(min, value - 1))
  }

  const handleIncrement = () => {
    const newValue = value + 1
    onChange(max !== undefined ? Math.min(max, newValue) : newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = Number(e.target.value)
    if (min !== undefined) {
      newValue = Math.max(min, newValue)
    }
    if (max !== undefined) {
      newValue = Math.min(max, newValue)
    }
    onChange(newValue)
  }

  return (
    <div className={styles.quantity}>
      <button
        type="button"
        className={styles.quantity__button}
        onClick={handleDecrement}
        aria-label={t('decrease')}
        disabled={value <= min}
      >
        <CoreIcon icon="minus" />
      </button>
      <input
        className={styles.quantity__input}
        name={name}
        value={value}
        onChange={handleInputChange}
        type="number"
        min={min}
        max={max}
      />
      <button
        type="button"
        className={styles.quantity__button}
        onClick={handleIncrement}
        aria-label={t('increase')}
        disabled={max !== undefined && value >= max}
      >
        <CoreIcon icon="plus" />
      </button>
    </div>
  )
}
