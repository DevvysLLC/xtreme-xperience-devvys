'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import type { InsuranceFragment } from '../../../../core/dato/fragments/insurance.typegen'
import { useCart } from '../../../../features/cart'
import { useToast } from '../../../../features/toast'
import { useBookingWizardState } from '../../context'
import { InsuranceOptionsCard } from '../insurance-options-card'
import styles from './style.module.scss'

export type InsuranceOptionsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  error?: string
  onSelect?: (item: InsuranceFragment) => void
}

export const InsuranceOptions: React.FC<InsuranceOptionsProps> = ({
  form,
  error,
  onSelect
}) => {
  const t = useTranslations('booking_wizard.pages.coverage_options.legend')
  const { showToast } = useToast()
  const { state } = useBookingWizardState()
  const { data } = useCart()
  const { contents } = data ?? {}
  const { insuranceSessions } = contents
  const options = state.configData?.insurance ?? []

  useEffect(() => {
    if (error) {
      showToast({
        message: error,
        type: 'error'
      })
    }
  }, [error, showToast])

  return (
    <div>
      <div className={styles.header}>
        <div className={clsx(styles.title, styles.desktop)}>
          {t('insurance')}
        </div>
        <div className={styles.title}>{t('coverage')}</div>
        <div className={clsx(styles.title, styles.desktop)}>
          {t('cost_per_car')}
        </div>
        <div className={styles.title}>{t('total')}</div>
        <div className={clsx(styles.title, styles.desktop)}></div>
      </div>

      <div className={styles.cards}>
        {options.map((option) => (
          <InsuranceOptionsCard
            key={option.id}
            insurance={option}
            form={form}
            quantity={insuranceSessions ?? 0}
            onSelect={
              onSelect
                ? () => {
                    onSelect(option)
                  }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}
