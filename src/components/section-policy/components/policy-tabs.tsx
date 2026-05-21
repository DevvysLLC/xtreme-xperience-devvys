'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import type { FC } from 'react'
import { memo, useCallback, useEffect, useRef } from 'react'
import { CoreCta } from '../../core-cta'
import styles from '../style.module.scss'

type TabData = {
  id: string
  title: string | null
}

type TabButtonProps = {
  tabId: string
  tabTitle: string | null
  isActive: boolean
  href: string
  setRef: (tabId: string, element: HTMLElement | null) => void
}

// Memoized tab button to prevent re-renders when other tabs change
const TabButton = memo<TabButtonProps>(function TabButton({
  tabId,
  tabTitle,
  isActive,
  href,
  setRef
}) {
  const handleRef = useCallback(
    (element: HTMLElement | null) => {
      setRef(tabId, element)
    },
    [setRef, tabId]
  )

  if (!tabTitle) {
    return null
  }

  return (
    <li ref={handleRef}>
      <CoreCta
        layoutType="pill"
        styleType={isActive ? 'black' : 'white'}
        sizeType="small"
        text={tabTitle}
        href={href}
        className={styles.tab}
      />
    </li>
  )
})

type Props = {
  tabs: TabData[]
  defaultTabId: string | null
}

const SEARCH_PARAM_KEY = 'policy'

export const PolicyTabs: FC<Props> = ({ tabs, defaultTabId }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get active tab from URL, fallback to default
  const activeTabId = searchParams.get(SEARCH_PARAM_KEY) ?? defaultTabId

  const tabRefs = useRef<Map<string, HTMLElement>>(new Map())

  const setTabRef = useCallback(
    (tabId: string, element: HTMLElement | null) => {
      if (element) {
        tabRefs.current.set(tabId, element)
      } else {
        tabRefs.current.delete(tabId)
      }
    },
    []
  )

  // Build URL with policy search param while preserving other params
  const buildTabHref = useCallback(
    (tabId: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(SEARCH_PARAM_KEY, tabId)
      return `${pathname}?${params.toString()}`
    },
    [pathname, searchParams]
  )

  // Update visibility of policy content panels based on active tab
  useEffect(() => {
    // Find the parent section element using any available tab ref
    const anyTabRef = tabRefs.current.values().next().value
    const section = anyTabRef?.closest('section')
    if (!section) {
      return
    }

    // Check if activeTabId is a valid tab
    const isValidTab = activeTabId && tabRefs.current.has(activeTabId)

    // Update data attribute on all policy content divs
    // If activeTabId is invalid, clear all data-active to trigger CSS fallback
    const policyContents = section.querySelectorAll('[data-policy-id]')
    for (const content of policyContents) {
      const policyId = content.getAttribute('data-policy-id')
      if (isValidTab && policyId === activeTabId) {
        content.setAttribute('data-active', 'true')
      } else {
        content.removeAttribute('data-active')
      }
    }

    // Scroll the active tab button into view on mobile (only if valid)
    if (isValidTab) {
      const buttonElement = tabRefs.current.get(activeTabId)
      if (buttonElement instanceof HTMLElement) {
        buttonElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        })
      }
    }
  }, [activeTabId])

  return (
    <ul className={styles.tabs}>
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          tabId={tab.id}
          tabTitle={tab.title}
          isActive={activeTabId === tab.id}
          href={buildTabHref(tab.id)}
          setRef={setTabRef}
        />
      ))}
    </ul>
  )
}
