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

  const defaultMessage = 'We have reserved your cart for [time]'
  const effectiveMessage =
    message && message.includes(TIME_PLACEHOLDER)
      ? message
      : message
        ? `${message} [time]`
        : defaultMessage

  const [before, after] = effectiveMessage.split(TIME_PLACEHOLDER)

  return (
    <div className={styles.expiry}>
      {before && <span className={styles.expiry__label}>{before}</span>}
      <span className={styles.expiry__timer} role="timer">
        <CoreCountdown data={{ end: expiryTime }} />
      </span>
      {after && <span className={styles.expiry__label}>{after}</span>}
    </div>
  )
}
