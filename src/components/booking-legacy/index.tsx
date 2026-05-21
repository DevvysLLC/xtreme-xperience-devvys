'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC, useEffect, useRef, useState } from 'react'
import { logger } from '../../core/logger/logger'
import styles from './style.module.scss'

const WEB_ENGINE_ID =
  process.env.ROCKET_REZ_WEB_ENGINE_ID ?? 'FlatlandWebEngine'
const WEB_ENGINE_EID =
  process.env.ROCKET_REZ_WEB_ENGINE_EID ?? '1fd1993318dfd00b'
const ROCKET_REZ_SCRIPT_URL =
  process.env.ROCKET_REZ_SCRIPT_URL ??
  'https://secure.rocket-rez.com/RocketWeb2/assets/scripts/webengine_load.js'
const WEB_ENGINE_INIT_DELAY_MS = 100

type Props = {
  id?: string | null
  root?: string | null
  startDate?: string | null
  endDate?: string | null
  eid?: string | null
}

const ROCKET_REZ_ORIGIN = 'https://secure.rocket-rez.com'

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    rrOrigin?: string
    loadWebEngine?: (element: HTMLElement) => void
  }
}

const isScriptLoaded = (): boolean => {
  return (
    typeof window !== 'undefined' && typeof window.loadWebEngine === 'function'
  )
}

const loadRocketRezScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Set the origin so the script knows where to connect
    window.rrOrigin = ROCKET_REZ_ORIGIN

    if (isScriptLoaded()) {
      resolve()
      return
    }

    const existingScript = document.querySelector(
      `script[src="${ROCKET_REZ_SCRIPT_URL}"]`
    )

    if (existingScript) {
      if (isScriptLoaded()) {
        resolve()
        return
      }
      existingScript.addEventListener('load', () => {
        resolve()
      })
      existingScript.addEventListener('error', reject)
      return
    }

    const script = document.createElement('script')
    script.src = ROCKET_REZ_SCRIPT_URL
    script.async = true
    script.onload = () => {
      resolve()
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const cleanupWebEngine = (element: HTMLElement | null): void => {
  if (!element) {
    return
  }
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
  element.removeAttribute('style')
}

export const BookingLegacy: FC<Props> = (props) => {
  const t = useTranslations('booking_legacy')
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement>(null)
  const isEngineLoadedRef = useRef(false)
  const [isScriptReady, setIsScriptReady] = useState(false)
  const [hasError, setHasError] = useState(false)

  const [root, setRoot] = useState<string | null>(
    () => props.root ?? searchParams.get('root')
  )
  const [id, setId] = useState<string>(
    () => props.id ?? searchParams.get('id') ?? WEB_ENGINE_ID
  )
  const [startDate, setStartDate] = useState<string | null>(
    () => props.startDate ?? searchParams.get('startDate')
  )
  const [endDate, setEndDate] = useState<string | null>(
    () => props.endDate ?? searchParams.get('endDate')
  )
  const [eid, setEid] = useState<string>(
    () => props.eid ?? searchParams.get('eid') ?? WEB_ENGINE_EID
  )

  useEffect(() => {
    setRoot(props.root ?? searchParams.get('root'))
    setId(props.id ?? searchParams.get('id') ?? WEB_ENGINE_ID)
    setStartDate(props.startDate ?? searchParams.get('startDate'))
    setEndDate(props.endDate ?? searchParams.get('endDate'))
    setEid(props.eid ?? searchParams.get('eid') ?? WEB_ENGINE_EID)
  }, [
    props.root,
    props.id,
    props.startDate,
    props.endDate,
    props.eid,
    searchParams
  ])

  const hasRequiredParams = Boolean(root && startDate && endDate)

  useEffect(() => {
    if (!hasRequiredParams) {
      return
    }

    loadRocketRezScript()
      .then(() => {
        setIsScriptReady(true)
      })
      .catch((error) => {
        logger.error(
          { error },
          'BookingLegacy: Failed to load RocketRez script'
        )
        setHasError(true)
      })
  }, [hasRequiredParams, root, startDate, endDate])

  // Set attributes that the webengine_load.js script expects
  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    const element = containerRef.current
    element.setAttribute('id', id)
    element.setAttribute('eid', eid)
    if (root) {
      element.setAttribute('root', root)
    }
    if (startDate) {
      element.setAttribute('startDate', startDate)
    }
    if (endDate) {
      element.setAttribute('endDate', endDate)
    }
  }, [id, root, startDate, endDate, eid])

  useEffect(() => {
    if (!isScriptReady || !hasRequiredParams || !containerRef.current) {
      return
    }

    if (isEngineLoadedRef.current) {
      return
    }

    const element = containerRef.current

    // Clean up any existing content before loading
    cleanupWebEngine(element)

    const timeoutId = setTimeout(() => {
      if (window.loadWebEngine && element && !isEngineLoadedRef.current) {
        try {
          window.loadWebEngine(element)
          isEngineLoadedRef.current = true
        } catch (error) {
          logger.error(
            { error },
            'BookingLegacy: Failed to initialize WebEngine'
          )
          setHasError(true)
        }
      }
    }, WEB_ENGINE_INIT_DELAY_MS)

    return () => {
      clearTimeout(timeoutId)
      cleanupWebEngine(element)
      isEngineLoadedRef.current = false
    }
  }, [isScriptReady, hasRequiredParams, eid])

  if (!hasRequiredParams) {
    return (
      <div className={styles.error}>
        <p>{t('error.missing_params')}</p>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={styles.error}>
        <p>{t('error.load_failed')}</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {!isScriptReady && (
        <div className={styles.loading}>
          <p>{t('loading')}</p>
        </div>
      )}
      <div ref={containerRef} id={id} className={styles.engine} />
    </div>
  )
}
