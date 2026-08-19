'use client'

import { useEffect, type FC } from 'react'
import { stickyBarStore, type StickyBarOverride } from '../../core/sticky-bar/store'

type Props = {
  config: StickyBarOverride | null
}

export const CampaignStickyBarInitializer: FC<Props> = ({ config }) => {
  useEffect(() => {
    if (config?.enableCampaignStickyBar) {
      stickyBarStore.getState().setOverride(config)
    }
    return () => {
      stickyBarStore.getState().setOverride(null)
    }
  }, [config])

  return null
}
