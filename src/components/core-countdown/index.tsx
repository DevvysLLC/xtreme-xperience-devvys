'use client'

import clsx from 'clsx'
import { type FC, useEffect, useState } from 'react'
import styles from './style.module.scss'

export type Props = {
  data: {
    end: string
    showDays?: boolean
  }
  className?: string | null
}

export const CoreCountdown: FC<Props> = ({ data, className = null }) => {
  const { end, showDays = false } = data
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    if (!end) {
      setTimeRemaining(null)
      return
    }

    const endDate = new Date(end)
    if (Number.isNaN(endDate.getTime())) {
      setTimeRemaining(null)
      return
    }

    let interval: NodeJS.Timeout | null = null

    const updateCountdown = () => {
      const now = new Date()
      const difference = endDate.getTime() - now.getTime()

      if (difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        if (interval) {
          clearInterval(interval)
          interval = null
        }
        return
      }

      const daysRemaining = showDays
        ? Math.floor(difference / (1000 * 60 * 60 * 24))
        : 0
      const hoursRemaining = showDays
        ? Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        : Math.floor(difference / (1000 * 60 * 60))
      const minutesRemaining = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      )
      const secondsRemaining = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeRemaining({
        days: daysRemaining,
        hours: hoursRemaining,
        minutes: minutesRemaining,
        seconds: secondsRemaining
      })
    }

    updateCountdown()
    interval = setInterval(updateCountdown, 1000)

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [end, showDays])

  if (!timeRemaining) {
    return null
  }

  return (
    <div className={clsx(styles.root, className)}>
      {showDays && (
        <>
          <span data-days>
            {timeRemaining.days.toString().padStart(2, '0')}
          </span>
          :
        </>
      )}
      <span data-hours>{timeRemaining.hours.toString().padStart(2, '0')}</span>:
      <span data-minutes>
        {timeRemaining.minutes.toString().padStart(2, '0')}
      </span>
      :
      <span data-seconds>
        {timeRemaining.seconds.toString().padStart(2, '0')}
      </span>
    </div>
  )
}
