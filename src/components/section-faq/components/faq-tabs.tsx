'use client'
import clsx from 'clsx'
import {
  type FC,
  memo,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react'
import { AccordionGroupProvider, CoreAccordion } from '../../core-accordion'
import { CoreCta } from '../../core-cta'
import type { SectionFaqFragment } from '../section-faq.typegen'
import styles from '../style.module.scss'

type FaqModel = NonNullable<SectionFaqFragment['faqs'][number]['model']>

export type Props = {
  tabs: FaqModel[]
  children?: ReactNode
}

type TabButtonProps = {
  tabId: string
  tabTitle: string | null
  isActive: boolean
  onClick: (tabId: string) => void
  setRef: (tabId: string, element: HTMLElement | null) => void
}

// Memoized tab button to prevent re-renders when other tabs change
const TabButton = memo<TabButtonProps>(function TabButton({
  tabId,
  tabTitle,
  isActive,
  onClick,
  setRef
}) {
  const handleClick = useCallback(() => {
    onClick(tabId)
  }, [onClick, tabId])

  const handleRef = useCallback(
    (element: HTMLElement | null) => {
      setRef(tabId, element)
    },
    [setRef, tabId]
  )

  // Skip rendering if no title
  if (!tabTitle) {
    return null
  }

  return (
    <li ref={handleRef}>
      <CoreCta
        layoutType="pill"
        styleType={'black-transparent'}
        sizeType="small"
        text={tabTitle}
        className={clsx(styles.tab, isActive && styles.active)}
        onClick={handleClick}
      />
    </li>
  )
})

// Memoized accordion list to prevent re-renders when tabs change
type AccordionListProps = {
  faqs: FaqModel['faqs']
  groupName: string
}

const AccordionList = memo<AccordionListProps>(function AccordionList({
  faqs,
  groupName
}) {
  return (
    <div className={styles.faqs}>
      {faqs.map((faq) => (
        <CoreAccordion key={faq.id} data={faq} name={groupName} />
      ))}
    </div>
  )
})

export const FaqTabs: FC<Props> = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = useState<string | null>(
    () => tabs[0]?.id ?? null
  )

  // Persist open accordion state per tab using Record for better performance than Map
  const [openAccordionsByTab, setOpenAccordionsByTab] = useState<
    Record<string, string | null>
  >({})

  const activeTabData = useMemo(
    () => tabs.find((tab) => tab.id === activeTab),
    [tabs, activeTab]
  )

  // Get the persisted open accordion ID for the current tab
  // If no persisted state exists, default to the first accordion item to prevent animation
  const persistedOpenId = useMemo(() => {
    if (!activeTab) {
      return null
    }
    // Check if we have a persisted state for this tab (including null if user closed all)
    if (activeTab in openAccordionsByTab) {
      return openAccordionsByTab[activeTab]
    }
    // If no persisted state exists, return first accordion ID
    return activeTabData?.faqs[0]?.id ?? null
  }, [activeTab, openAccordionsByTab, activeTabData])

  // Callback to update persisted state when accordion opens/closes
  const handleAccordionStateChange = useCallback(
    (accordionId: string | null) => {
      if (activeTab) {
        setOpenAccordionsByTab((prev) => ({
          ...prev,
          [activeTab]: accordionId
        }))
      }
    },
    [activeTab]
  )

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

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId)

    // Scroll the clicked button into view horizontally on mobile
    const buttonElement = tabRefs.current.get(tabId)
    if (buttonElement instanceof HTMLElement) {
      buttonElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [])

  return (
    <>
      <div className={styles.content}>
        {children}

        <ul className={styles.tabs}>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tabId={tab.id}
              tabTitle={tab.title}
              isActive={activeTab === tab.id}
              onClick={handleTabClick}
              setRef={setTabRef}
            />
          ))}
        </ul>
      </div>

      {activeTabData && (
        <AccordionGroupProvider
          key={activeTabData.id}
          name={activeTabData.id}
          defaultOpenId={persistedOpenId}
          onStateChange={handleAccordionStateChange}
        >
          <AccordionList
            faqs={activeTabData.faqs}
            groupName={activeTabData.id}
          />
        </AccordionGroupProvider>
      )}
    </>
  )
}
