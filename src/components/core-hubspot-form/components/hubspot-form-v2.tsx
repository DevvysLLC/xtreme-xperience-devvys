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
import {
  getHubspotV2Api,
  loadHubspotV2Script,
  parseHubspotV2EmbedForm
} from '../../../utils/hubspot-v2'
import styles from '../style.module.scss'

type Props = {
  embedForm: string
  className?: string
}

/**
 * HubspotFormV2 renders a HubSpot form via the v2 Forms API.
 * Parses embed HTML for config, loads the v2 script, then uses
 * hbspt.forms.create() for broad form compatibility.
 */
export const HubspotFormV2: FC<Props> = ({ embedForm, className }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const formCreatedRef = useRef(false)
  const reactId = useId()
  const sanitizedReactId = reactId.replace(/[^a-zA-Z0-9_-]/g, '')

  const { region, formId, portalId } = useMemo(
    () => parseHubspotV2EmbedForm(embedForm),
    [embedForm]
  )

  useEffect(() => {
    setIsClient(true)
  }, [])

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
          target: `#${containerRef.current.id}`
        })
      } catch {
        formCreatedRef.current = false
      }
    },
    [region, formId, portalId]
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
