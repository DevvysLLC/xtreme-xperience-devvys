'use client'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { type FC, useEffect, useState } from 'react'
import {
  SHOW_TOAST_MESSAGE_NAME,
  type ShowToast,
  type ToastType
} from '../../core/messaging/main/messages/show-toast'
import { useMainBus } from '../../core/messaging/main/react'
import { CoreIcon } from '../core-icon'
import styles from './style.module.scss'

const DEFAULT_DURATION = 5000

type ToastState = {
  message: string
  type: ToastType
  duration: number
}

export const GlobalToast: FC = () => {
  const t = useTranslations('global_toast')
  const [toast, setToast] = useState<ToastState | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useMainBus(SHOW_TOAST_MESSAGE_NAME, (event: ShowToast) => {
    const duration = event.details.duration ?? DEFAULT_DURATION
    const type = event.details.type ?? 'info'

    setToast({
      message: event.details.message,
      type,
      duration
    })
    setIsVisible(true)
  })

  useEffect(() => {
    if (!toast?.duration) {
      return
    }

    const timer = setTimeout(() => {
      setIsVisible(false)
    }, toast.duration)

    return () => {
      clearTimeout(timer)
    }
  }, [toast])

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible || !toast) {
    return null
  }

  return (
    <div className={styles.toast__container}>
      <div
        className={clsx(styles.toast, styles[`toast--${toast.type}`])}
        role="alert"
        aria-live="polite"
      >
        <div className={styles.content}>
          <span className={styles.message}>{toast.message}</span>
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label={t('close')}
          >
            <CoreIcon icon="close" />
          </button>
        </div>
      </div>
    </div>
  )
}
