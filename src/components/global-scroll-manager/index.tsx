'use client'

import { useCallback, useEffect, useRef } from 'react'
import { TRANSITIONS } from '../../config/transitions'
import type { ScrollToSection } from '../../core/messaging/main/messages/scrollto-section'
import { useMainBus } from '../../core/messaging/main/react'
import { easeOutExpo } from './easing'

const DEFAULT_DURATION = TRANSITIONS.DEFAULT_SCROLL_DURATION

export const GlobalScrollManager = () => {
  const animationFrameRef = useRef<number | null>(null)

  const handleScrollToSection = useCallback((sectionId: string) => {
    if (!sectionId) {
      return
    }

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    const element = document.getElementById(sectionId)
    if (!element) {
      return
    }

    const startPosition = window.scrollY || window.pageYOffset
    const startTime = performance.now()

    const animateScroll = (currentTime: number) => {
      const currentElement = document.getElementById(sectionId)
      if (!currentElement) {
        animationFrameRef.current = null
        return
      }

      const rect = currentElement.getBoundingClientRect()
      const targetPosition = rect.top + (window.scrollY || window.pageYOffset)
      const distance = targetPosition - startPosition
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / DEFAULT_DURATION, 1)
      const easedProgress = easeOutExpo(progress)

      window.scrollTo(0, startPosition + distance * easedProgress)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateScroll)
      } else {
        animationFrameRef.current = null
      }
    }

    animationFrameRef.current = requestAnimationFrame(animateScroll)
  }, [])

  useMainBus('scrollto:section', (message: ScrollToSection) => {
    handleScrollToSection(message.details.id)
  })

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) {
      return
    }

    const sectionId = hash.slice(1)
    if (!sectionId) {
      return
    }

    let timeoutId: NodeJS.Timeout | null = null
    const frameId = requestAnimationFrame(() => {
      timeoutId = setTimeout(() => {
        if (document.getElementById(sectionId)) {
          handleScrollToSection(sectionId)
        }
      }, 100)
    })

    return () => {
      cancelAnimationFrame(frameId)
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }
  }, [handleScrollToSection])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return null
}
