'use client'

import type { FC, ReactNode } from 'react'
import { useThirdPartyScriptGate } from '../../utils/use-third-party-script-gate'

type Props = {
  children: ReactNode
  enabled?: boolean
  timeoutMs?: number
  openOnInteraction?: boolean
}

export const IdleScriptLoader: FC<Props> = ({
  children,
  enabled = true,
  timeoutMs = 2000,
  openOnInteraction = true
}) => {
  const isReady = useThirdPartyScriptGate({
    enabled,
    timeoutMs,
    openOnInteraction
  })

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
