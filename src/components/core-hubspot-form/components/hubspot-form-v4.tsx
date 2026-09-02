'use client'

import clsx from 'clsx'
import { type FC, useEffect, useMemo, useState, useRef } from 'react'
import { loadScriptOnce } from '../../../utils/load-script-once'
import { logger } from '../../../core/logger/logger'
import styles from '../style.module.scss'

type Props = {
  embedForm: string
  className?: string
}

type ParsedEmbedForm = {
  htmlWithoutScripts: string
  scripts: { src?: string; inlineCode?: string }[]
}

/**
 * Parses complex embed HTML (like HubSpot v4 + RevenueHero + Styles) to extract 
 * script src/inline code and separate them from the rest of the HTML.
 */
const parseEmbedForm = (embedHtml: string): ParsedEmbedForm => {
  // Remove all <script> tags from the HTML for safely using dangerouslySetInnerHTML
  const htmlWithoutScripts = embedHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Extract all scripts sequentially
  const scripts: { src?: string; inlineCode?: string }[] = []
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
  
  let match
  while ((match = scriptRegex.exec(embedHtml)) !== null) {
    const attributes = match[1]
    const inlineCode = match[2]
    const srcMatch = /src=["']([^"']+)["']/.exec(attributes)
    
    scripts.push({
      src: srcMatch?.[1],
      inlineCode: inlineCode.trim() || undefined
    })
  }

  return { htmlWithoutScripts, scripts }
}

export const HubspotFormV4: FC<Props> = ({ embedForm, className }) => {
  const [isClient, setIsClient] = useState(false)
  const scriptsExecutedRef = useRef(false)

  const { htmlWithoutScripts, scripts } = useMemo(
    () => parseEmbedForm(embedForm),
    [embedForm]
  )

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || scriptsExecutedRef.current || scripts.length === 0) {
      return
    }

    let isCancelled = false

    const executeScripts = async () => {
      scriptsExecutedRef.current = true
      for (const script of scripts) {
        if (isCancelled) break
        
        if (script.src) {
          try {
            await loadScriptOnce(script.src)
          } catch (err) {
            logger.error({ err, src: script.src }, 'Failed to load external script in HubspotFormV4')
          }
        } else if (script.inlineCode) {
          try {
            const scriptEl = document.createElement('script')
            scriptEl.type = 'text/javascript'
            scriptEl.textContent = script.inlineCode
            document.body.appendChild(scriptEl)
          } catch (err) {
            logger.error({ err }, 'Failed to execute inline script in HubspotFormV4')
          }
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    executeScripts()

    return () => {
      isCancelled = true
    }
  }, [isClient, scripts])

  if (!isClient) {
    return null
  }

  return (
    <div
      className={clsx(styles.hubspotFormV4, className)}
      dangerouslySetInnerHTML={{ __html: htmlWithoutScripts }}
    />
  )
}
