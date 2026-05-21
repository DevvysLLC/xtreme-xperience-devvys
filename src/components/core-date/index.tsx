'use client'

import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { useMemo } from 'react'

export type CoreDateProps = {
  start: string
  end?: string
  monthVariant?: 'long' | 'short'
}

const formatDateRange = (
  startDateParam: string,
  endDateParam: string | undefined,
  monthNames: { long: string[]; short: string[] },
  variant: 'long' | 'short'
): string | null => {
  if (!startDateParam) {
    return null
  }

  // Parse ISO date string (YYYY-MM-DD) as UTC to avoid timezone hydration issues
  const start = new Date(startDateParam)
  if (Number.isNaN(start.getTime())) {
    return null
  }

  const monthNamesList = monthNames[variant]
  const startMonth = monthNamesList[start.getUTCMonth()]
  const startDay = start.getUTCDate()
  const startYear = start.getUTCFullYear()

  if (!endDateParam) {
    return `${startMonth} ${startDay}, ${startYear}`
  }

  const end = new Date(endDateParam)
  if (Number.isNaN(end.getTime())) {
    return `${startMonth} ${startDay}, ${startYear}`
  }

  const endMonth = monthNamesList[end.getUTCMonth()]
  const endDay = end.getUTCDate()
  const endYear = end.getUTCFullYear()

  // Same month and year: "Nov. 5–7, 2025" or "November 5–7, 2025"
  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startDay}–${endDay}, ${startYear}`
  }

  // Different months, same year: "Aug. 14 - Sept. 2, 2025" or "August 14 - September 2, 2025"
  if (startYear === endYear) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`
  }

  // Different years: "Dec. 30, 2024 - Jan. 2, 2025" or "December 30, 2024 - January 2, 2025"
  return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`
}

export const CoreDate: FC<CoreDateProps> = ({
  start,
  end,
  monthVariant = 'short'
}) => {
  const t = useTranslations('core_date')

  const monthNames = useMemo(
    () => ({
      long: [
        t('months.long.jan'),
        t('months.long.feb'),
        t('months.long.mar'),
        t('months.long.apr'),
        t('months.long.may'),
        t('months.long.jun'),
        t('months.long.jul'),
        t('months.long.aug'),
        t('months.long.sep'),
        t('months.long.oct'),
        t('months.long.nov'),
        t('months.long.dec')
      ],
      short: [
        t('months.short.jan'),
        t('months.short.feb'),
        t('months.short.mar'),
        t('months.short.apr'),
        t('months.short.may'),
        t('months.short.jun'),
        t('months.short.jul'),
        t('months.short.aug'),
        t('months.short.sep'),
        t('months.short.oct'),
        t('months.short.nov'),
        t('months.short.dec')
      ]
    }),
    [t]
  )

  const formattedDate = formatDateRange(start, end, monthNames, monthVariant)

  if (!formattedDate) {
    return null
  }

  return <>{formattedDate}</>
}
