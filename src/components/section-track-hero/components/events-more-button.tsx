'use client'

import type { FC, ReactNode } from 'react'
import { useCallback } from 'react'

type Props = {
  children: ReactNode
  className?: string
  sectionId: string | undefined
}

export const EventsMoreButton: FC<Props> = ({
  children,
  className,
  sectionId
}) => {
  const handleClick = useCallback(() => {
    if (!sectionId) {
      return
    }

    // Find the current element by ID
    const currentElement = document.getElementById(sectionId)
    if (!currentElement || !(currentElement instanceof HTMLElement)) {
      return
    }

    // Find the next sibling element
    let nextElement: HTMLElement | null = null
    let nextSibling = currentElement.nextElementSibling

    // Look for the next sibling element
    while (nextSibling) {
      if (nextSibling instanceof HTMLElement) {
        nextElement = nextSibling
        break
      }
      nextSibling = nextSibling.nextElementSibling
    }

    // If no direct sibling, find all elements with IDs and get the next one
    if (!nextElement) {
      const allElements = Array.from(document.querySelectorAll('[id]')).filter(
        (element): element is HTMLElement => element instanceof HTMLElement
      )
      const currentIndex = allElements.findIndex(
        (element) => element.id === sectionId
      )
      if (currentIndex >= 0 && currentIndex < allElements.length - 1) {
        const foundElement = allElements[currentIndex + 1]
        if (foundElement) {
          nextElement = foundElement
        }
      }
    }

    if (nextElement) {
      nextElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [sectionId])

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  )
}
