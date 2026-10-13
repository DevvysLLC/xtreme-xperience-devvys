'use client'

import { type FC, useMemo } from 'react'
import { CoreCountdown } from '../../../../components/core-countdown'
import { useCartState } from '../../../../features/cart'
import styles from './style.module.scss'

const TIMER_DURATION_MINUTES = 15

export const CartExpiry: FC = () => {
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

  if (!expiryTime) {
    return null
  }

  return (
    <div className={styles.reservationBox}>
      <span className={styles.reservationBox__label}>
        We have reserved your cart for
      </span>
      <strong className={styles.reservationBox__timer} role="timer">
        <CoreCountdown data={{ end: expiryTime }} />
      </strong>
    </div>
  )
}
