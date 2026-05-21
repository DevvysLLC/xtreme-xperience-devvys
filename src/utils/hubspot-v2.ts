import { loadScriptOnce } from './load-script-once'

const HUBSPOT_V2_SCRIPT_SRC = '//js.hsforms.net/forms/embed/v2.js'
const HUBSPOT_POLL_INTERVAL_MS = 100
const HUBSPOT_POLL_TIMEOUT_MS = 10000

export type ParsedHubspotV2EmbedForm = {
  region: string | null
  formId: string | null
  portalId: string | null
}

export type HubspotV2CreateFormConfig = {
  region?: string
  portalId: string
  formId: string
  target: string
}

export type HubspotV2Api = {
  forms: {
    create: (config: HubspotV2CreateFormConfig) => void
  }
}

type LoadHubspotV2ScriptOptions = {
  signal?: AbortSignal
  timeoutMs?: number
}

const createAbortError = (): Error => {
  return new Error('HubSpot v2 script loading aborted')
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const isHubspotV2Api = (value: unknown): value is HubspotV2Api => {
  if (!isRecord(value)) {
    return false
  }

  const forms = value.forms
  if (!isRecord(forms)) {
    return false
  }

  return typeof forms.create === 'function'
}

export const getHubspotV2Api = (): HubspotV2Api | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }

  const maybeHubspot = Reflect.get(window, 'hbspt')
  if (!isHubspotV2Api(maybeHubspot)) {
    return undefined
  }

  return maybeHubspot
}

const waitForHubspotV2 = ({
  signal,
  timeoutMs = HUBSPOT_POLL_TIMEOUT_MS
}: LoadHubspotV2ScriptOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError())
      return
    }

    if (getHubspotV2Api()) {
      resolve()
      return
    }

    let intervalId: ReturnType<typeof setInterval> | null = null
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const cleanup = (abortListener?: () => void): void => {
      if (intervalId) {
        clearInterval(intervalId)
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (abortListener) {
        signal?.removeEventListener('abort', abortListener)
      }
    }

    const onAbort = (): void => {
      cleanup(onAbort)
      reject(createAbortError())
    }

    signal?.addEventListener('abort', onAbort, { once: true })

    timeoutId = setTimeout(() => {
      cleanup(onAbort)
      reject(new Error('Timed out waiting for HubSpot v2 to initialize'))
    }, timeoutMs)

    intervalId = setInterval(() => {
      if (getHubspotV2Api()) {
        cleanup(onAbort)
        resolve()
      }
    }, HUBSPOT_POLL_INTERVAL_MS)
  })
}

export const parseHubspotV2EmbedForm = (
  embedHtml: string
): ParsedHubspotV2EmbedForm => {
  const regionMatch = /data-region=["']([^"']+)["']/.exec(embedHtml)
  const formIdMatch = /data-form-id=["']([^"']+)["']/.exec(embedHtml)
  const portalIdMatch = /data-portal-id=["']([^"']+)["']/.exec(embedHtml)

  return {
    region: regionMatch?.[1] ?? null,
    formId: formIdMatch?.[1] ?? null,
    portalId: portalIdMatch?.[1] ?? null
  }
}

export const loadHubspotV2Script = async ({
  signal,
  timeoutMs
}: LoadHubspotV2ScriptOptions = {}): Promise<void> => {
  if (signal?.aborted) {
    throw createAbortError()
  }

  if (getHubspotV2Api()) {
    return
  }

  await loadScriptOnce(HUBSPOT_V2_SCRIPT_SRC)
  await waitForHubspotV2({ signal, timeoutMs })
}
