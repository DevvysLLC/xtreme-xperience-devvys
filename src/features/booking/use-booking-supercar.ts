'use client'

import { useCallback } from 'react'
import type { RocketRezEventScheduleItem } from '../../io/types'
import { useBookingSupercarSchedule } from './use-booking-supercar-schedule'

/**
 * Supercar utility hook
 *
 * - Find first available schedule for a supercar
 * - Filters out sold-out schedules
 */
export const useBookingSupercar = () => {
  const { isSoldOut } = useBookingSupercarSchedule()

  const getFirstAvailableSchedule = useCallback(
    (schedules: RocketRezEventScheduleItem[] | undefined) => {
      if (!schedules || schedules.length === 0) {
        return null
      }

      return schedules.find((schedule) => !isSoldOut(schedule)) ?? null
    },
    [isSoldOut]
  )

  return {
    getFirstAvailableSchedule
  }
}

export type UseBookingSupercarReturn = ReturnType<typeof useBookingSupercar>
