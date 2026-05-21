import { useEffect, useRef, useState } from 'react'

const OFFSCREEN_THRESHOLD = 300

export const useHeaderScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOffscreen, setIsOffscreen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      const y = window.scrollY

      if (!ticking) {
        requestAnimationFrame(() => {
          const prevY = lastY.current
          const isScrollingDown = y > prevY
          const isScrollingUp = y < prevY

          lastY.current = y

          const newIsScrolled = y > 0
          setIsScrolled((prev) =>
            prev !== newIsScrolled ? newIsScrolled : prev
          )

          if (y === 0) {
            setIsOffscreen((prev) => (prev ? false : prev))
          } else {
            if (isScrollingUp) {
              setIsOffscreen((prev) => (prev ? false : prev))
            } else if (isScrollingDown && y > OFFSCREEN_THRESHOLD) {
              setIsOffscreen((prev) => (prev ? prev : true))
            }
          }

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

  return { isScrolled, isOffscreen }
}
