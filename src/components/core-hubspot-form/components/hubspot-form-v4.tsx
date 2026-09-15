'use client'

import clsx from 'clsx'
import { type FC, useEffect, useMemo, useState } from 'react'
import { loadScriptOnce } from '../../../utils/load-script-once'
import styles from '../style.module.scss'

type Props = {
  embedForm: string
  className?: string
}

type ParsedEmbedForm = {
  scriptSrc: string | null
  region: string | null
  formId: string | null
  portalId: string | null
}

/**
 * Parses HubSpot v4 embed HTML to extract script src and data attributes.
 * Expected format:
 * <script src="https://js.hsforms.net/forms/embed/developer/43829367.js" defer></script>
 * <div class="hs-form-html" data-region="na1" data-form-id="..." data-portal-id="..."></div>
 */
const parseEmbedForm = (embedHtml: string): ParsedEmbedForm => {
  const scriptSrcMatch = /<script[^>]+src=["']([^"']+)["']/.exec(embedHtml)
  const scriptSrc = scriptSrcMatch?.[1] ?? null

  const regionMatch = /data-region=["']([^"']+)["']/.exec(embedHtml)
  const formIdMatch = /data-form-id=["']([^"']+)["']/.exec(embedHtml)
  const portalIdMatch = /data-portal-id=["']([^"']+)["']/.exec(embedHtml)

  return {
    scriptSrc,
    region: regionMatch?.[1] ?? null,
    formId: formIdMatch?.[1] ?? null,
    portalId: portalIdMatch?.[1] ?? null
  }
}

export const HubspotFormV4: FC<Props> = ({ embedForm, className }) => {
  const [isClient, setIsClient] = useState(false)

  const { scriptSrc, region, formId, portalId } = useMemo(
    () => parseEmbedForm(embedForm),
    [embedForm]
  )

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && scriptSrc) {
      void loadScriptOnce(scriptSrc).catch(() => {})
    }
  }, [isClient, scriptSrc])

  if (!isClient) {
    return null
  }

  if (!scriptSrc || !formId || !portalId) {
    return null
  }

  return (
    <div
      className={clsx('hs-form-html', styles.hubspotFormV4, className)}
      data-region={region}
      data-form-id={formId}
      data-portal-id={portalId}
    />
  )
}
