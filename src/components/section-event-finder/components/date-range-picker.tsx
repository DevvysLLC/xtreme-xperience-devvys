'use client'

import { useTranslations } from 'next-intl'
import { type FC, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { CoreIcon } from '../../core-icon'
import styles from '../style.module.scss'

type Props = {
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void
}

export const DateRangePicker: FC<Props> = ({ onDateRangeChange }) => {
  const t = useTranslations('section_event_finder')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date)
    onDateRangeChange?.(date, endDate)
  }

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date)
    onDateRangeChange?.(startDate, date)
  }

  const handleClearStartDate = () => {
    setStartDate(null)
    onDateRangeChange?.(null, endDate)
  }

  const handleClearEndDate = () => {
    setEndDate(null)
    onDateRangeChange?.(startDate, null)
  }

  return (
    <div className={styles.dateRange}>
      <div className={styles.dateRange__field}>
        <label htmlFor="start-date" className={styles.dateRange__label}>
          {t('date_range.start_date.label')}
        </label>
        <div className={styles.dateRange__container}>
          <DatePicker
            id="start-date"
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText={t('date_range.start_date.placeholder')}
            className={styles.dateRange__input}
            dateFormat="MM/dd/yyyy"
            wrapperClassName={styles.dateRange__wrapper}
          />
          {startDate && (
            <button
              type="button"
              className={styles.dateRange__clear}
              onClick={handleClearStartDate}
              aria-label={t('date_range.clear')}
            >
              <span className={styles.dateRange__clear__text}>
                {t('date_range.clear')}
              </span>
              <CoreIcon icon="close" />
            </button>
          )}
        </div>
      </div>

      <div className={styles.dateRange__divider}>{t('date_range.divider')}</div>

      <div className={styles.dateRange__field}>
        <label htmlFor="end-date" className={styles.dateRange__label}>
          {t('date_range.end_date.label')}
        </label>
        <div className={styles.dateRange__container}>
          <DatePicker
            id="end-date"
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText={t('date_range.end_date.placeholder')}
            className={styles.dateRange__input}
            dateFormat="MM/dd/yyyy"
            wrapperClassName={styles.dateRange__wrapper}
          />
          {endDate && (
            <button
              type="button"
              className={styles.dateRange__clear}
              onClick={handleClearEndDate}
              aria-label={t('date_range.clear')}
            >
              <span className={styles.dateRange__clear__text}>
                {t('date_range.clear')}
              </span>
              <CoreIcon icon="close" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
