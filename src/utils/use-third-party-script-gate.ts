'use client'

import { useEffect, useState } from 'react'
import { scheduleOnIdle } from './schedule-on-idle'

const DEFAULT_TIMEOUT_MS = 2000
const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'touchstart'] as const

type UseThirdPartyScriptGateOptions = {
  timeoutMs?: number
  enabled?: boolean
  openOnInteraction?: boolean
}

export const useThirdPartyScriptGate = (
  options: UseThirdPartyScriptGateOptions = {}
): boolean => {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    enabled = true,
    openOnInteraction = true
  } = options
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setIsReady(false)
      return
    }

    if (isReady || typeof window === 'undefined') {
      return
    }

    const openGate = (): void => {
      setIsReady(true)
    }

    let cleanupInteractionListeners: (() => void) | null = null

    if (openOnInteraction) {
      const onInteraction = (): void => {
        openGate()
      }

      INTERACTION_EVENTS.forEach((eventName) => {
        window.addEventListener(eventName, onInteraction, {
          once: true,
          passive: true
        })
      })

      cleanupInteractionListeners = () => {
        INTERACTION_EVENTS.forEach((eventName) => {
          window.removeEventListener(eventName, onInteraction)
        })
      }
    }

    const cancelScheduledOpen = scheduleOnIdle(openGate, { timeoutMs })

    return () => {
      if (cleanupInteractionListeners != null) {
        cleanupInteractionListeners()
      }
      cancelScheduledOpen()
    }
  }, [enabled, isReady, openOnInteraction, timeoutMs])

  return isReady
}
