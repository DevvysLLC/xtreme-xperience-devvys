'use client'

import { type FC, useEffect } from 'react'

type Props = {
  formId: string
  className?: string
}

declare global {
  interface Window {
    _klOnsite?: any[]
    klaviyo?: any[]
    Klaviyo?: any[]
  }
}

/**
 * CoreKlaviyoForm renders a Klaviyo embedded signup form.
 * Pushes a refresh command to the Klaviyo onsite SDK to ensure the form
 * is rendered correctly even after client-side transitions.
 */
export const CoreKlaviyoForm: FC<Props> = ({ formId, className }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          if (typeof window._klOnsite?.push === 'function') {
            window._klOnsite.push(['refresh'])
          }

          if (typeof window.klaviyo?.push === 'function') {
            window.klaviyo.push(['refresh'])
          }

          if (typeof window.Klaviyo?.push === 'function') {
            window.Klaviyo.push(['refresh'])
          }
        }
      } catch (err) {
        console.error('Error refreshing Klaviyo form:', err)
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [formId])

  return <div className={`klaviyo-form-${formId} ${className ?? ''}`} />
}
