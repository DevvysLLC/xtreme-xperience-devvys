'use client'

import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { CoreCountdown } from '../../../../components/core-countdown'
import {
  CART_HOLD_DURATION_MS,
  isCartHoldExpired,
  releaseCartHoldInRocketRez,
  useCartState
} from '../../../../features/cart'
import styles from './style.module.scss'

type Props = {
  variant?: 'default' | 'inline'
  className?: string
}

export const CartExpiry: FC<Props> = ({ variant = 'default', className }) => {
  const qc = useQueryClient()
  const { data: cartState } = useCartState()
  const hasItems = (cartState.cartData?.lineItems?.length ?? 0) > 0
  const timerStartedAt = cartState.timerStartedAt ?? null
  const [localExpired, setLocalExpired] = useState(false)

  const isExpired =
    localExpired ||
    Boolean(cartState.holdExpired) ||
    isCartHoldExpired(cartState)

  useEffect(() => {
    if (!cartState.holdExpired && !isCartHoldExpired(cartState)) {
      setLocalExpired(false)
    }
  }, [cartState, cartState.holdExpired, cartState.timerStartedAt])

  const handleExpire = useCallback(() => {
    setLocalExpired(true)
    void releaseCartHoldInRocketRez(qc)
  }, [qc])

  useEffect(() => {
    if (
      hasItems &&
      isExpired &&
      (!cartState.holdExpired || cartState.cartKey !== null)
    ) {
      void releaseCartHoldInRocketRez(qc)
    }
  }, [hasItems, isExpired, cartState.holdExpired, cartState.cartKey, qc])

  const expiryTime = useMemo(() => {
    if (!timerStartedAt) {
      return null
    }

    const startDate = new Date(timerStartedAt)
    if (Number.isNaN(startDate.getTime())) {
      return null
    }

    const expiryDate = new Date(startDate.getTime() + CART_HOLD_DURATION_MS)
    return expiryDate.toISOString()
  }, [timerStartedAt])

  if (!hasItems || (!expiryTime && !isExpired)) {
    return null
  }

  if (isExpired) {
    return (
      <div
        className={clsx(
          styles.expiry,
          styles['expiry--expired'],
          variant === 'inline' && styles['expiry--inline'],
          className
        )}
        role="status"
      >
        <span className={styles.expiry__expiredText}>
          Your hold ended, but your drive is still in your cart. Check out now
          before someone else books it.
        </span>
      </div>
    )
  }

  if (!expiryTime) {
    return null
  }

  return (
    <div
      className={clsx(
        styles.expiry,
        variant === 'inline' && styles['expiry--inline'],
        className
      )}
    >
      <span className={styles.expiry__label}>Your spot is held for</span>
      <span className={styles.expiry__timer} role="timer">
        <CoreCountdown
          data={{ end: expiryTime, showHours: false }}
          onExpire={handleExpire}
        />
      </span>
    </div>
  )
}
