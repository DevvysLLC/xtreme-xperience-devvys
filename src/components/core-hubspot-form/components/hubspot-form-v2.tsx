'use client'

import clsx from 'clsx'
import { type FC, useEffect, useRef } from 'react'
import styles from '../style.module.scss'

type Props = {
  embedForm: string
  className?: string
}

export const HubspotFormV2: FC<Props> = ({ embedForm, className }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !embedForm) return

    const container = containerRef.current
    container.innerHTML = ''

    // Parse incoming HTML
    const range = document.createRange()
    const documentFragment = range.createContextualFragment(embedForm)

    // Browsers don't run <script> tags inserted via innerHTML; recreate them explicitly
    const scripts = Array.from(documentFragment.querySelectorAll('script'))
    
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      newScript.textContent = oldScript.textContent
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })

    container.appendChild(documentFragment)

    // Also inject a global message listener to debug form submissions for RevenueHero
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'hsFormCallback') {
        console.warn(`[DEBUG-HUBSPOT-UNIVERSAL] Intercepted hsFormCallback: ${event.data.eventName}`, event.data)
        if (event.data.eventName === 'onFormSubmit' || event.data.eventName === 'onFormSubmitted') {
          if (typeof window !== 'undefined' && (window as any).hero) {
            const heroKeys = Object.keys((window as any).hero).join(', ')
            let protoKeys = ''
            if (Object.getPrototypeOf((window as any).hero)) {
              protoKeys = Object.getOwnPropertyNames(Object.getPrototypeOf((window as any).hero)).join(', ')
            }
            console.warn(`[DEBUG-REVENUEHERO-UNIVERSAL] Keys: ${heroKeys} | Proto: ${protoKeys}`)
          } else {
            console.warn(`[DEBUG-REVENUEHERO-UNIVERSAL] window.hero is UNDEFINED!`)
          }
        }
      }
    }
    window.addEventListener('message', handleMessage)

    return () => {
      container.innerHTML = ''
      window.removeEventListener('message', handleMessage)
    }
  }, [embedForm])

  return (
    <div
      ref={containerRef}
      className={clsx(styles.hubspotFormV2, className)}
    />
  )
}
