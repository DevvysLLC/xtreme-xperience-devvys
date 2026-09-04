'use client'

import React, { useSyncExternalStore } from 'react'
import { createStore } from 'zustand/vanilla'

export type VideoId = string

type VideoState = {
  // state
  status: 'unmounted' | 'paused' | 'playing'
  /** True once the video element has fired the native 'playing' event (playback started). */
  hasStartedPlaying: boolean
  muted: boolean
  userInteracted: boolean
  /** Reference to the underlying <video> element for direct control within user gestures. */
  videoElement: HTMLVideoElement | null
  // commands
  play(): void
  pause(): void
  setStatus(s: 'unmounted' | 'paused' | 'playing'): void
  setHasStartedPlaying(value: boolean): void
  setMuted(m: boolean): void
  setUserInteracted(interacted: boolean): void
  setVideoElement(el: HTMLVideoElement | null): void
}

const registry = new Map<VideoId, ReturnType<typeof makeStore>>()
const refCounts = new Map<VideoId, number>()

const makeStore = (id: VideoId) => {
  const store = createStore<VideoState>((set) => ({
    status: 'unmounted',
    hasStartedPlaying: false,
    muted: false,
    userInteracted: false,
    videoElement: null,
    play: () => {
      registry.forEach((otherStore, otherId) => {
        if (otherId !== id && otherStore.getState().status === 'playing') {
          otherStore.getState().pause()
        }
      })
      set({ status: 'playing' })
    },
    pause: () => {
      set({ status: 'paused', hasStartedPlaying: false })
    },
    setStatus: (s) => {
      set({
        status: s,
        ...(s === 'unmounted' ? { hasStartedPlaying: false } : {})
      })
    },
    setHasStartedPlaying: (value) => {
      set({ hasStartedPlaying: value })
    },
    setMuted: (m) => {
      set({ muted: m })
    },
    setUserInteracted: (interacted) => {
      set({ userInteracted: interacted })
    },
    setVideoElement: (el) => {
      set({ videoElement: el })
    }
  }))

  return store
}

export const getVideoStore = (id: VideoId) => {
  const s = registry.get(id)
  if (s) {
    return s
  }
  const next = makeStore(id)
  registry.set(id, next)
  refCounts.set(id, 0)
  return next
}

export const useVideo = <T>(id: VideoId, selector: (s: VideoState) => T) => {
  const store = getVideoStore(id)
  const getServerSnapshot = () => selector(store.getState())

  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    getServerSnapshot
  )
}

export const useVideoActions = (id: VideoId) => {
  const store = getVideoStore(id)

  // Memoize actions to prevent creating new objects on every render
  // Actions are stable functions that don't need reactivity
  const actions = React.useMemo(() => {
    const state = store.getState()
    return {
      play: state.play,
      pause: state.pause,
      setMuted: state.setMuted,
      setStatus: state.setStatus,
      setHasStartedPlaying: state.setHasStartedPlaying,
      setUserInteracted: state.setUserInteracted,
      setVideoElement: state.setVideoElement
    }
  }, [store])

  return actions
}
