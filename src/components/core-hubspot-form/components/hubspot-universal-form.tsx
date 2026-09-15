'use client'

import clsx from 'clsx'
import { type FC, useEffect, useRef } from 'react'
import styles from '../style.module.scss'

type Props = {
  embedForm: string
  className?: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    hero?: {
      submit?: (data: unknown) => void
      [key: string]: unknown
    }
  }
}

export const HubspotUniversalForm: FC<Props> = ({ embedForm, className }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !embedForm) {
      return
    }

    const container = containerRef.current
    container.innerHTML = ''

    // Parse incoming HTML
    const range = document.createRange()
    const documentFragment = range.createContextualFragment(embedForm)

    // Browsers don't run <script> tags inserted via innerHTML; recreate them explicitly.
    // We must execute them sequentially to prevent ReferenceErrors (e.g. inline scripts calling hbspt before v2.js loads)
    const scripts = Array.from(documentFragment.querySelectorAll('script'))

    // Remove the scripts from the fragment so they don't execute out of order if we append the fragment
    scripts.forEach((script) => script.parentNode?.removeChild(script))

    container.appendChild(documentFragment)

    let isCancelled = false

    const executeScriptsSequentially = async () => {
      for (const oldScript of scripts) {
        if (isCancelled) {
          break
        }

        await new Promise<void>((resolve) => {
          const newScript = document.createElement('script')
          Array.from(oldScript.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value)
          })
          newScript.textContent = oldScript.textContent

          if (newScript.src) {
            newScript.onload = () => resolve()
            newScript.onerror = () => resolve() // Continue even on error
          }

          container.appendChild(newScript)

          // If it's an inline script, it executes immediately upon append
          if (!newScript.src) {
            resolve()
          }
        })
      }
    }

    void executeScriptsSequentially()

    // Also inject a global message listener to debug and manually trigger RevenueHero
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'hsFormCallback') {
        console.warn(
          `[DEBUG-HUBSPOT-UNIVERSAL] Intercepted hsFormCallback: ${event.data.eventName}`,
          event.data
        )
        if (
          event.data.eventName === 'onFormSubmit' ||
          event.data.eventName === 'onFormSubmitted'
        ) {
          // Debugging keys
          if (typeof window !== 'undefined' && window.hero) {
            const heroKeys = Object.keys(window.hero).join(', ')
            console.warn(`[DEBUG-REVENUEHERO-UNIVERSAL] Keys: ${heroKeys}`)

            // Manual Bridge Execution: Ensure RevenueHero modal pops up
            if (typeof window.hero.submit === 'function') {
              console.warn(
                '[DEBUG-REVENUEHERO-UNIVERSAL] Manually triggering hero.submit()'
              )
              window.hero.submit(event.data.data)
            }
          } else {
            console.warn(
              `[DEBUG-REVENUEHERO-UNIVERSAL] window.hero is UNDEFINED!`
            )
          }
        }
      }
    }
    window.addEventListener('message', handleMessage)

    return () => {
      isCancelled = true

      // Fix Accessibility Warning: "Blocked aria-hidden on an element because its descendant retained focus"
      // Shift focus out of the form container (iframe) before destroying it
      if (typeof document !== 'undefined' && document.activeElement) {
        if (
          container.contains(document.activeElement) ||
          document.activeElement.tagName === 'IFRAME'
        ) {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
          }
        }
      }

      container.innerHTML = ''
      window.removeEventListener('message', handleMessage)
    }
  }, [embedForm])

  return (
    <div ref={containerRef} className={clsx(styles.hubspotFormV2, className)} />
  )
}
