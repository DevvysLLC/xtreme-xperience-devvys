'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DRAWER_REQUEST_CLOSE_MESSAGE_NAME } from '../../core/messaging/main/messages/close-drawer'
import type { DrawerRequestOpen } from '../../core/messaging/main/messages/open-drawer'
import { DRAWER_REQUEST_OPEN_MESSAGE_NAME } from '../../core/messaging/main/messages/open-drawer'
import { DRAWER_OPEN_MESSAGE_NAME } from '../../core/messaging/main/messages/set-active-drawer'
import { useMainBus } from '../../core/messaging/main/react'

export const DrawerManager = () => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const busRef = useRef<ReturnType<typeof useMainBus> | null>(null)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)
  const focusTrapRef = useRef<{
    firstFocusable: HTMLElement | null
    lastFocusable: HTMLElement | null
  } | null>(null)

  const bus = useMainBus(
    DRAWER_REQUEST_OPEN_MESSAGE_NAME,
    useCallback(
      (event: DrawerRequestOpen) => {
        const nextId = event.details.id

        if (activeId === nextId) {
          return
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        const currentBus = busRef.current
        if (!currentBus) {
          return
        }

        if (activeId) {
          currentBus.send({
            name: DRAWER_OPEN_MESSAGE_NAME,
            details: { id: null }
          })

          timeoutRef.current = setTimeout(() => {
            if (busRef.current) {
              busRef.current.send({
                name: DRAWER_OPEN_MESSAGE_NAME,
                details: { id: nextId }
              })
            }
            setActiveId(nextId)
            timeoutRef.current = null
          }, 300)
        } else {
          currentBus.send({
            name: DRAWER_OPEN_MESSAGE_NAME,
            details: { id: nextId }
          })
          setActiveId(nextId)
        }
      },
      [activeId]
    )
  )

  busRef.current = bus

  useMainBus(
    DRAWER_REQUEST_CLOSE_MESSAGE_NAME,
    useCallback(() => {
      if (activeId && busRef.current) {
        busRef.current.send({
          name: DRAWER_OPEN_MESSAGE_NAME,
          details: { id: null }
        })
        setActiveId(null)
      }
    }, [activeId])
  )

  const getFocusableElements = useCallback(
    (container: HTMLElement): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ].join(', ')

      return Array.from(container.querySelectorAll(focusableSelectors)).filter(
        (el): el is HTMLElement => {
          if (!(el instanceof HTMLElement)) {
            return false
          }
          const style = window.getComputedStyle(el)
          return style.display !== 'none' && style.visibility !== 'hidden'
        }
      )
    },
    []
  )

  const focusFirstElement = useCallback(
    (drawerPanel: HTMLElement) => {
      const focusableElements = getFocusableElements(drawerPanel)
      if (focusableElements.length === 0) {
        return
      }

      const firstInput = focusableElements.find(
        (el) => el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
      )

      const elementToFocus = firstInput || focusableElements[0]
      if (elementToFocus) {
        elementToFocus.focus()
      }
    },
    [getFocusableElements]
  )

  const setupFocusTrap = useCallback(
    (drawerPanel: HTMLElement) => {
      const focusableElements = getFocusableElements(drawerPanel)
      if (focusableElements.length === 0) {
        return
      }

      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]

      if (!firstFocusable || !lastFocusable) {
        return
      }

      focusTrapRef.current = { firstFocusable, lastFocusable }

      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') {
          return
        }

        if (event.shiftKey) {
          if (document.activeElement === firstFocusable) {
            event.preventDefault()
            lastFocusable.focus()
          }
        } else {
          if (document.activeElement === lastFocusable) {
            event.preventDefault()
            firstFocusable.focus()
          }
        }
      }

      drawerPanel.addEventListener('keydown', handleTabKey)
      return () => {
        drawerPanel.removeEventListener('keydown', handleTabKey)
      }
    },
    [getFocusableElements]
  )

  useEffect(() => {
    if (!activeId) {
      focusTrapRef.current = null
      return
    }

    const activeElement = document.activeElement
    if (activeElement instanceof HTMLElement) {
      previouslyFocusedElementRef.current = activeElement
    }

    let cleanupFocusTrap: (() => void) | undefined
    let rafId: number | null = null

    const timeoutId = setTimeout(() => {
      rafId = requestAnimationFrame(() => {
        rafId = null
        const drawerPanel = document.querySelector(
          `[data-drawer-id="${activeId}"]`
        )
        if (!(drawerPanel instanceof HTMLElement)) {
          return
        }

        cleanupFocusTrap = setupFocusTrap(drawerPanel)
        focusFirstElement(drawerPanel)
      })
    }, 50)

    return () => {
      clearTimeout(timeoutId)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      cleanupFocusTrap?.()
    }
  }, [activeId, setupFocusTrap, focusFirstElement])

  useEffect(() => {
    if (activeId !== null) {
      return
    }

    if (previouslyFocusedElementRef.current) {
      const timeoutId = setTimeout(() => {
        if (previouslyFocusedElementRef.current) {
          previouslyFocusedElementRef.current.focus()
          previouslyFocusedElementRef.current = null
        }
      }, 100)

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [activeId])

  return null
}
