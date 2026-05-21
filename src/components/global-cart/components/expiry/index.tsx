'use client'

import { type FC, useMemo } from 'react'
import { CoreCountdown } from '../../../../components/core-countdown'
import { useBookingConfig } from '../../../../features/booking'
import { useCartState } from '../../../../features/cart'
import styles from './style.module.scss'

const TIME_PLACEHOLDER = '[time]'
const TIMER_DURATION_MINUTES = 15

export const CartExpiry: FC = () => {
  const { data: configData } = useBookingConfig()
  const message = configData?.reservedCart ?? null
  const hasTimePlaceholder = message?.includes(TIME_PLACEHOLDER)

  const { data: cartState } = useCartState()
  const timerStartedAt = cartState.timerStartedAt ?? null

  const expiryTime = useMemo(() => {
    if (!timerStartedAt) {
      return null
    }

    const startDate = new Date(timerStartedAt)
    if (Number.isNaN(startDate.getTime())) {
      return null
    }

    const expiryDate = new Date(
      startDate.getTime() + TIMER_DURATION_MINUTES * 60 * 1000
    )
    return expiryDate.toISOString()
  }, [timerStartedAt])

  if (!expiryTime || !message) {
    return null
  }

  if (hasTimePlaceholder) {
    const [before, after] = message.split(TIME_PLACEHOLDER)
    return (
      <div className={styles.expiry}>
        {before && <span>{before}</span>}
        <span className={styles.expiry__timer}>
          <CoreCountdown data={{ end: expiryTime }} />
        </span>
        {after && <span>{after}</span>}
      </div>
    )
  }

  return (
    <div className={styles.expiry}>
      <span>{message}</span>
    </div>
  )
}
