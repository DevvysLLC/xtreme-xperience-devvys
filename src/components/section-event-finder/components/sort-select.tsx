'use client'

import { useTranslations } from 'next-intl'
import { type ChangeEvent, type FC, useEffect, useRef } from 'react'
import { logger } from '../../../core/logger/logger'
import { useLocation, useLocationSetBrowser } from '../../../features/location'
import styles from '../style.module.scss'

const SORT_OPTIONS = [{ value: 'distance-asc' }, { value: 'date-asc' }] as const

const SORT_NEAREST = 'distance-asc'

type Props = {
  value: string
  onSortChange: (value: string) => void
  id?: string
  label?: string
}

export const SortSelect: FC<Props> = ({
  value,
  onSortChange,
  id = 'event-sort',
  label
}) => {
  const t = useTranslations('section_event_finder')
  const { data: location } = useLocation()
  const browserLocation = useLocationSetBrowser()
  const hasLocation = Boolean(location?.latitude && location?.longitude)
  const shouldRequestLocationForNearest = value === SORT_NEAREST && !hasLocation
  const requestedNearestWithoutLocationRef = useRef(false)

  useEffect(() => {
    if (
      shouldRequestLocationForNearest &&
      !requestedNearestWithoutLocationRef.current &&
      !browserLocation.isPending
    ) {
      requestedNearestWithoutLocationRef.current = true
      browserLocation.mutateAsync().catch((error) => {
        logger.error(
          { error },
          'SortSelect: failed to request browser location for nearest sort'
        )
      })
      return
    }

    if (!shouldRequestLocationForNearest) {
      requestedNearestWithoutLocationRef.current = false
    }
  }, [
    browserLocation,
    browserLocation.isPending,
    shouldRequestLocationForNearest
  ])

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextValue = event.target.value
    onSortChange(nextValue)
  }

  return (
    <div className={styles.sortSelect}>
      {label !== undefined && (
        <label htmlFor={id} className={styles.sortSelect__label}>
          {label}
        </label>
      )}
      <select
        id={id}
        className={styles.sortSelect__input}
        value={value}
        onChange={handleChange}
        aria-label={label ?? t('sort.label')}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {t(`sort.${option.value.replace(/-/g, '_')}`)}
          </option>
        ))}
      </select>
    </div>
  )
}
