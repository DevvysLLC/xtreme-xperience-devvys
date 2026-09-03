'use client'

import clsx from 'clsx'
import {
  type FC,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'
import { logger } from '../../../core/logger/logger'
import {
  getHubspotV2Api,
  loadHubspotV2Script,
  parseHubspotV2EmbedForm
} from '../../../utils/hubspot-v2'
import { loadScriptOnce } from '../../../utils/load-script-once'
import styles from '../style.module.scss'

type Props = {
  embedForm: string
  className?: string
}

type ParsedScripts = {
  src?: string
  inlineCode?: string
}[]

/**
 * Extracts additional scripts (like RevenueHero) from the embed code
 * so they can be executed after the Hubspot V2 form is created.
 */
const extractAdditionalScripts = (embedHtml: string): ParsedScripts => {
  const scripts: ParsedScripts = []
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
  
  let match
  while ((match = scriptRegex.exec(embedHtml)) !== null) {
    const attributes = match[1]
    const inlineCode = match[2]
    const srcMatch = /src=["']([^"']+)["']/.exec(attributes)
    const src = srcMatch?.[1]

    // Ignore the standard HubSpot V4 embed script if present, 
    // because V2 handles HubSpot initialization itself.
    if (src && src.includes('js.hsforms.net/forms/embed')) {
      continue
    }

    scripts.push({
      src,
      inlineCode: inlineCode.trim() || undefined
    })
  }

  return scripts
}

/**
 * HubspotFormV2 renders a HubSpot form via the v2 Forms API.
 * Parses embed HTML for config, loads the v2 script, then uses
 * hbspt.forms.create() for broad form compatibility, and finally
 * executes any additional custom scripts attached (like RevenueHero).
 */
export const HubspotFormV2: FC<Props> = ({ embedForm, className }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const formCreatedRef = useRef(false)
  const scriptsExecutedRef = useRef(false)
  const reactId = useId()
  const sanitizedReactId = reactId.replace(/[^a-zA-Z0-9_-]/g, '')

  const { region, formId, portalId } = useMemo(
    () => parseHubspotV2EmbedForm(embedForm),
    [embedForm]
  )
  
  const additionalScripts = useMemo(
    () => extractAdditionalScripts(embedForm),
    [embedForm]
  )

  useEffect(() => {
    setIsClient(true)
  }, [])

  const executeAdditionalScripts = useCallback(async (signal: AbortSignal) => {
    if (scriptsExecutedRef.current || additionalScripts.length === 0) return
    scriptsExecutedRef.current = true

    for (const script of additionalScripts) {
      if (signal.aborted) break
      
      if (script.src) {
        try {
          await loadScriptOnce(script.src)
        } catch (err) {
          logger.error({ err, src: script.src }, 'Failed to load external script in HubspotFormV2')
        }
      } else if (script.inlineCode) {
        try {
          const scriptEl = document.createElement('script')
          scriptEl.type = 'text/javascript'
          scriptEl.textContent = script.inlineCode
          document.body.appendChild(scriptEl)
        } catch (err) {
          logger.error({ err }, 'Failed to execute inline script in HubspotFormV2')
        }
      }
    }
  }, [additionalScripts])

  const createForm = useCallback(
    async (signal: AbortSignal) => {
      if (
        !formId ||
        !portalId ||
        !containerRef.current ||
        formCreatedRef.current
      ) {
        return
      }

      formCreatedRef.current = true

      try {
        await loadHubspotV2Script({ signal })
        const hubspotApi = getHubspotV2Api()

        if (signal.aborted || !hubspotApi || !containerRef.current) {
          formCreatedRef.current = false
          return
        }

        hubspotApi.forms.create({
          ...(region ? { region } : {}),
          portalId,
          formId,
          target: `#${containerRef.current.id}`,
          onFormReady: () => {
            if (!signal.aborted) {
              void executeAdditionalScripts(signal)
            }
          }
        })
      } catch {
        formCreatedRef.current = false
      }
    },
    [region, formId, portalId, executeAdditionalScripts]
  )

  useEffect(() => {
    if (!isClient) {
      return
    }
    const abortController = new AbortController()
    void createForm(abortController.signal)
    return () => {
      abortController.abort()
      formCreatedRef.current = false
      scriptsExecutedRef.current = false
    }
  }, [isClient, createForm])

  if (!isClient) {
    return null
  }

  if (!formId || !portalId) {
    return null
  }

  const containerId = `hs-form-${formId}-${sanitizedReactId}`

  return (
    <div
      id={containerId}
      ref={containerRef}
      className={clsx(styles.hubspotFormV2, className)}
    />
  )
}
