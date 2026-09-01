'use client'

import { type FC, useEffect } from 'react'

type Props = {
  formId: string
  className?: string
}


/**
 * CoreKlaviyoForm renders a Klaviyo embedded signup form.
 * Pushes a refresh command to the Klaviyo onsite SDK to ensure the form
 * is rendered correctly even after client-side transitions.
 */
export const CoreKlaviyoForm: FC<Props> = ({ formId, className }) => {
  useEffect(() => {
    // Attempt to refresh the Klaviyo form multiple times to account for
    // the Drawer/Dialog animation delay (which can take 300-500ms).
    const refreshKlaviyo = () => {
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
    }

    const timer1 = setTimeout(refreshKlaviyo, 100)
    const timer2 = setTimeout(refreshKlaviyo, 400)
    const timer3 = setTimeout(refreshKlaviyo, 800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [formId])

  return <div className={`klaviyo-form-${formId} ${className ?? ''}`} />
}
