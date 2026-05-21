'use client'

import { useEffect, useState } from 'react'

export const useScrollToBottom = (): boolean => {
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const windowHeight = window.innerHeight
          const documentHeight = document.documentElement.scrollHeight
          const scrollTop = window.scrollY || document.documentElement.scrollTop
          const scrollBottom = scrollTop + windowHeight
          const atBottom = scrollBottom >= documentHeight - 5
          setIsAtBottom((prev) => (prev !== atBottom ? atBottom : prev))

          ticking = false
        })

        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return isAtBottom
}
