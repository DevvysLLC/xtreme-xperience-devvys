'use client'

import { useEffect } from 'react'
import { toSnakeCase as remedaToSnakeCase } from 'remeda'
import { ANALYTICS_EVENT_PREFIX, TRACK_UI_EVENTS } from '../../config/analytics'
import { logger } from '../../core/logger/logger'
import { IdleScriptLoader } from '../idle-script-loader'

type ScriptsGoogleAnalyticsProps = {
  /** When false, no listeners are attached. */
  enabled?: boolean
}

type CustomWindow = Window & {
  dataLayer?:
    | {
        push?: (...args: unknown[]) => void
      }
    | unknown[]
}

declare let window: CustomWindow

export const sendGtagEvent = (
  eventName: string,
  eventParams: Record<string, unknown>
): void => {
  if (!window.dataLayer) {
    return
  }

  if (typeof window.dataLayer.push === 'undefined') {
    console.warn('window.dataLayer has no push method')
    return
  }

  window.dataLayer.push({
    event: eventName,
    ...eventParams
  })
}

const context = 'GoogleAnalyticsEvents'

type BaseEvent = 'click' | 'submit'
type ValidEventName = `${string}_${string}` | string

type EventData = {
  event: string
  type: BaseEvent
  event_category: string
  event_action: string
  event_type: string
  event_target: string
  event_label: string
  page_path: string
  section_id?: string
  section_name?: string
  compound_event?: string
  timestamp?: number
  link_href?: string
  form_data?: Record<string, string>
  element?: HTMLElement
}

type TrackingData = {
  'event-target'?: string
  'event-label'?: string
  'page-path'?: string
  [key: string]: string | undefined
}

const SECTION_NAME_ATTR = 'data-ga-section-name'

const TRACKED_EVENTS: BaseEvent[] = ['click', 'submit']

const INTERACTIVE_ELEMENTS = new Set<string>([
  'a',
  'button',
  'input',
  'select',
  'textarea',
  'label',
  'checkbox',
  'radio'
])

const EVENT_CATEGORY = {
  DEFAULT: 'user_interaction'
} as const

const EVENT_ACTION = {
  DEFAULT: 'global',
  SECTION: 'section'
} as const

const RATE_LIMIT_WINDOW = 1000

const TRACKING_CONTROL = {
  DISABLE: 'data-ga-track-disable',
  DISABLE_SECTION: 'data-ga-track-disable-section'
} as const

const RATE_LIMIT = new Map<string, number>()

const eventKeys = [
  'target',
  'label',
  'path',
  'category',
  'action',
  'type',
  'value'
]

const toSnakeCase = (str: string): string => remedaToSnakeCase(str)

const isRateLimited = (eventName: string): boolean => {
  const now = Date.now()
  const lastEventTime = RATE_LIMIT.get(eventName)

  if (lastEventTime && now - lastEventTime < RATE_LIMIT_WINDOW) {
    return true
  }

  RATE_LIMIT.set(eventName, now)
  return false
}

const validateEventName = (name: string): ValidEventName => {
  if (!name || typeof name !== 'string') {
    return 'unknown_event'
  }
  return name.includes('_') ? name : name
}

const findParentSection = (element: HTMLElement): HTMLElement | null => {
  let parent: HTMLElement | null = element

  while (parent) {
    if (parent.hasAttribute(SECTION_NAME_ATTR)) {
      return parent
    }
    parent = parent.parentElement
  }

  return null
}

const getSectionName = (element: HTMLElement): string | undefined => {
  const parentSection = findParentSection(element)
  if (!parentSection) {
    return undefined
  }

  const rawSectionName = parentSection.getAttribute(SECTION_NAME_ATTR)

  return rawSectionName ? toSnakeCase(rawSectionName) : undefined
}

const getSectionId = (element: HTMLElement): string | undefined => {
  const parentSection = findParentSection(element)
  return (
    parentSection?.getAttribute('data-section-id') ||
    parentSection?.getAttribute('id') ||
    undefined
  )
}

const getLabel = (element: HTMLElement): string | undefined => {
  const explicitLabel = element.getAttribute('data-ga-label')
  if (explicitLabel) {
    return explicitLabel
  }

  const ariaLabel = element.getAttribute('aria-label')
  if (ariaLabel) {
    return ariaLabel
  }

  const title = element.getAttribute('title')
  if (title) {
    return title
  }

  const textContent = element.textContent
  if (textContent) {
    return textContent.trim()
  }

  return undefined
}

const isTrackingDisabled = (element: HTMLElement): boolean => {
  if (element.hasAttribute(TRACKING_CONTROL.DISABLE)) {
    return true
  }

  let current: HTMLElement | null = element
  while (current) {
    if (current.hasAttribute(TRACKING_CONTROL.DISABLE_SECTION)) {
      return true
    }
    current = current.parentElement
  }

  return false
}

const getTrackingData = (element: HTMLElement): TrackingData => {
  const data: TrackingData = {}
  const prefix = 'data-ga-'
  const attributes = element.getAttributeNames()
  for (const attrName of attributes) {
    if (attrName.startsWith(prefix)) {
      const key = attrName.replace(prefix, '')
      const value = element.getAttribute(attrName)
      if (value !== null) {
        data[key] = value
      }
    }
  }

  return data
}

const getFormData = (
  element: HTMLElement
): Record<string, string> | undefined => {
  if (!(element instanceof HTMLFormElement)) {
    return undefined
  }

  const formData = new FormData(element)
  const data: Record<string, string> = {}

  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      data[key] = value
    }
  }

  return data
}

const isInteractiveElement = (tagName: string): boolean => {
  return INTERACTIVE_ELEMENTS.has(tagName)
}

const shouldTrackElement = (
  element: HTMLElement,
  eventType: BaseEvent
): boolean => {
  if (isTrackingDisabled(element)) {
    return false
  }

  const explicitTrack = element.getAttribute('data-ga-event')

  if (explicitTrack === eventType || explicitTrack === 'all') {
    return true
  }

  if (eventType === 'click') {
    let current: HTMLElement | null = element
    while (current) {
      if (isInteractiveElement(current.tagName.toLowerCase())) {
        return true
      }
      current = current.parentElement
    }
  }

  if (eventType === 'submit' && element instanceof HTMLFormElement) {
    return true
  }

  return false
}

const trackEvent = (
  event: string,
  type: BaseEvent,
  data: Partial<EventData> = {}
): void => {
  if (!data.element) {
    logger.error(
      {
        context,
        action: 'trackEvent',
        data: { message: 'Missing element in event data' }
      },
      'ScriptsGoogleAnalytics.trackEvent: Missing element in event data'
    )
    return
  }

  logger.info(
    { context, action: 'trackEvent', data: { event, type, data } },
    'ScriptsGoogleAnalytics.trackEvent'
  )

  try {
    if (isRateLimited(data.compound_event || event)) {
      logger.info(
        {
          context,
          action: 'trackEvent',
          data: { event: data.compound_event || event, message: 'rate limited' }
        },
        `ScriptsGoogleAnalytics.trackEvent: Event ${data.compound_event || event} rate limited`
      )
      return
    }

    const trackingData = getTrackingData(data.element)
    const formData =
      type === 'submit' && data.event_target === 'form'
        ? getFormData(data.element)
        : undefined

    const additionalTrackingData = Object.fromEntries(
      Object.entries(trackingData).filter(([key]) => !eventKeys.includes(key))
    )

    const eventName = data.compound_event || event
    const payload = {
      event: `${ANALYTICS_EVENT_PREFIX}_${eventName}`,
      event_category: data.event_category || EVENT_CATEGORY.DEFAULT,
      event_action: data.event_action || EVENT_ACTION.DEFAULT,
      event_type: type,
      event_target: data.event_target || '',
      event_label: data.event_label || '',
      page_path: window.location.pathname,
      timestamp: Date.now(),
      ...(data.section_id && { section_id: data.section_id }),
      ...(data.section_name && { section_name: data.section_name }),
      ...(data.compound_event && { compound_event: data.compound_event }),
      ...(data.link_href && { link_href: data.link_href }),
      ...(formData && { form_data: formData }),
      ...additionalTrackingData
    }

    sendGtagEvent('event', {
      ...payload
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred'
    logger.error(
      { context, action: 'trackEvent', error },
      `ScriptsGoogleAnalytics.trackEvent: ${message}`
    )
  }
}

const getEvent = (element: HTMLElement, type: BaseEvent): string => {
  const explicitEvent = element.getAttribute('data-ga-event')
  if (explicitEvent) {
    return explicitEvent
  }
  return type
}

const findInteractiveTarget = (element: HTMLElement): HTMLElement => {
  let current: HTMLElement | null = element
  while (current) {
    if (isInteractiveElement(current.tagName.toLowerCase())) {
      return current
    }
    current = current.parentElement
  }
  return element
}

const getCompoundEvent = (
  element: HTMLElement,
  sectionName: string | undefined,
  type: BaseEvent
): string => {
  const parts = [sectionName || 'global', element.tagName.toLowerCase(), type]

  const event = parts.join('_')
  return validateEventName(event)
}

const getHref = (element: HTMLElement): string | undefined => {
  if (element.tagName.toLowerCase() === 'a') {
    return element.getAttribute('href') || undefined
  }
  return undefined
}

const getAction = (
  sectionName: string | undefined,
  type: BaseEvent
): string => {
  const parts = [sectionName || 'global', type]

  return parts.join('_')
}

const createEventHandler =
  (type: BaseEvent) =>
  (evt: Event): void => {
    if (!(evt.target instanceof HTMLElement)) {
      return
    }

    const element =
      type === 'click' ? findInteractiveTarget(evt.target) : evt.target

    if (!shouldTrackElement(element, type)) {
      return
    }

    const sectionName = getSectionName(element)
    const event = getEvent(element, type)
    const isForm = element instanceof HTMLFormElement
    const compoundEvent = getCompoundEvent(element, sectionName, type)
    const linkHref = type === 'click' ? getHref(element) : undefined
    const action = getAction(sectionName, type)

    const data: Partial<EventData> = {
      event: compoundEvent,
      event_target: isForm ? 'form' : element.tagName.toLowerCase(),
      event_category: EVENT_CATEGORY.DEFAULT,
      event_action: action,
      event_type: type,
      compound_event: compoundEvent,
      section_name: sectionName,
      section_id: getSectionId(element),
      link_href: linkHref,
      event_label: type === 'click' ? getLabel(element) : undefined,
      element
    }

    trackEvent(event, type, data)
  }

const ScriptsGoogleAnalyticsListeners = (): null => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    // Initialize dataLayer if GTM hasn't created it yet
    window.dataLayer = window.dataLayer ?? []

    const listeners = TRACKED_EVENTS.map((eventType) => ({
      type: eventType,
      handler: createEventHandler(eventType)
    }))

    listeners.forEach(({ type, handler }) => {
      document.addEventListener(type, handler, true)
    })

    return () => {
      listeners.forEach(({ type, handler }) => {
        document.removeEventListener(type, handler, true)
      })
    }
  }, [])

  return null
}

export const ScriptsGoogleAnalytics = ({
  enabled = true
}: ScriptsGoogleAnalyticsProps) => {
  const isEnabled = enabled && TRACK_UI_EVENTS

  return (
    <IdleScriptLoader enabled={isEnabled}>
      {isEnabled ? <ScriptsGoogleAnalyticsListeners /> : null}
    </IdleScriptLoader>
  )
}
