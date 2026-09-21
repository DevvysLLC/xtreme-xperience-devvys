import { useSyncExternalStore } from 'react'
import { createStore } from 'zustand/vanilla'

export type StickyBarOverride = {
  enableCampaignStickyBar: boolean
  campaignStickyBarHeading?: string | null
  campaignStickyBarTimerEnd?: string | null
  campaignStickyBarCtaTitle?: string | null
  campaignStickyBarCtaLink?: string | null
  campaignStickyBarBackgroundColor?: string | null
  campaignStickyBarTextColor?: string | null
  campaignStickyBarTimerColor?: string | null
  campaignStickyBarButtonBackgroundColor?: string | null
  campaignStickyBarButtonTextColor?: string | null
}

type StickyBarStoreState = {
  override: StickyBarOverride | null
  setOverride: (override: StickyBarOverride | null) => void
}

export const stickyBarStore = createStore<StickyBarStoreState>((set) => ({
  override: null,
  setOverride: (override) => set({ override })
}))

export const useStickyBarStore = <T>(
  selector: (s: StickyBarStoreState) => T
) => {
  return useSyncExternalStore(
    stickyBarStore.subscribe,
    () => selector(stickyBarStore.getState()),
    () => selector(stickyBarStore.getState())
  )
}
