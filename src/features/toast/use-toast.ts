'use client'

import { useCallback } from 'react'
import { logger } from '../../core/logger/logger'
import {
  SHOW_TOAST_MESSAGE_NAME,
  type ToastType
} from '../../core/messaging/main/messages/show-toast'
import { useMainBus } from '../../core/messaging/main/react'

type ShowToastOptions = {
  message: string
  type?: ToastType
  duration?: number
}

export const useToast = () => {
  const bus = useMainBus(SHOW_TOAST_MESSAGE_NAME, () => {})

  const showToast = useCallback(
    (options: ShowToastOptions) => {
      const payload = {
        name: SHOW_TOAST_MESSAGE_NAME,
        details: {
          message: options.message,
          type: options.type ?? 'info',
          duration: options.duration
        }
      } as const

      logger.info(
        {
          toastName: payload.name,
          toastType: payload.details.type,
          hasMessage: Boolean(payload.details.message),
          duration: payload.details.duration
        },
        'useToast.showToast.send'
      )

      try {
        bus.send(payload)
        logger.info(
          { toastName: payload.name },
          'useToast.showToast.send.success'
        )
      } catch (error) {
        logger.error(
          { error, toastName: payload.name },
          'useToast.showToast.send.error'
        )
      }
    },
    [bus]
  )

  return { showToast }
}
