'use client'
import clsx from 'clsx'
import type { FC, ReactNode } from 'react'
import { useCallback, useRef, useState } from 'react'
import { CoreCta } from '../../core-cta'
import type {
  LayoutType as LayoutTypeType,
  PackageType as PackageTypeType
} from '../io'
import styles from '../style.module.scss'

type Tab = {
  id: PackageTypeType
  label: string
}

export type Props = {
  tabs: Tab[]
  showFilters: boolean
  layout: LayoutTypeType
  headerClassName?: string
  headerContent?: ReactNode
  singleCarGrid?: ReactNode
  multiCarGrid?: ReactNode
  allCarsGrid?: ReactNode
  emptyState?: ReactNode
}

export const FleetGridTabsWrapper: FC<Props> = ({
  tabs,
  showFilters,
  layout,
  headerClassName,
  headerContent,
  singleCarGrid,
  multiCarGrid,
  allCarsGrid,
  emptyState
}) => {
  const isStacked = layout === 'stacked'

  const [activeTab, setActiveTab] = useState<PackageTypeType | null>(
    () => tabs[0]?.id ?? null
  )

  const tabRefs = useRef<Map<PackageTypeType, HTMLElement>>(new Map())
  const gridRefs = useRef<Map<PackageTypeType, HTMLElement>>(new Map())

  const setTabRef = useCallback(
    (tabId: PackageTypeType, element: HTMLElement | null) => {
      if (element) {
        tabRefs.current.set(tabId, element)
      } else {
        tabRefs.current.delete(tabId)
      }
    },
    []
  )

  const setGridRef = useCallback(
    (tabId: PackageTypeType, element: HTMLElement | null) => {
      if (element) {
        gridRefs.current.set(tabId, element)
      } else {
        gridRefs.current.delete(tabId)
      }
    },
    []
  )

  const handleTabClick = useCallback(
    (tabId: PackageTypeType) => {
      if (isStacked) {
        // In stacked layout, scroll to the corresponding grid
        const gridElement = gridRefs.current.get(tabId)
        if (gridElement instanceof HTMLElement) {
          gridElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
        return
      }

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
    },
    [isStacked]
  )

  // Determine which grid to show based on tabs and active tab
  const hasFilters = showFilters && tabs.length > 0

  return (
    <>
      <header className={headerClassName}>
        {headerContent}

        {hasFilters && (
          <ul className={styles.tabs}>
            {tabs.map((tab) => {
              const { id: tabId, label } = tab

              return (
                <li
                  key={tabId}
                  ref={(element) => {
                    setTabRef(tabId, element)
                  }}
                >
                  <CoreCta
                    layoutType="pill"
                    styleType="black-transparent"
                    sizeType="small"
                    text={label}
                    className={clsx(
                      styles.tab,
                      !isStacked && activeTab === tabId && styles.active
                    )}
                    onClick={() => {
                      handleTabClick(tabId)
                    }}
                  />
                </li>
              )
            })}
          </ul>
        )}
      </header>

      {hasFilters ? (
        isStacked ? (
          <>
            {/* Stacked layout: all grids visible, no tab switching */}
            {singleCarGrid && (
              <div
                className={styles.stackedPanel}
                ref={(element) => {
                  setGridRef('single', element)
                }}
              >
                {singleCarGrid}
              </div>
            )}
            {multiCarGrid && (
              <div
                className={styles.stackedPanel}
                ref={(element) => {
                  setGridRef('multi', element)
                }}
              >
                {multiCarGrid}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Server-rendered grids with CSS visibility toggle */}
            <div
              className={clsx(
                styles.tabPanel,
                activeTab === 'single' && styles['tabPanel--active']
              )}
              aria-hidden={activeTab !== 'single'}
            >
              {singleCarGrid}
            </div>
            <div
              className={clsx(
                styles.tabPanel,
                activeTab === 'multi' && styles['tabPanel--active']
              )}
              aria-hidden={activeTab !== 'multi'}
            >
              {multiCarGrid}
            </div>
          </>
        )
      ) : allCarsGrid ? (
        allCarsGrid
      ) : (
        emptyState
      )}
    </>
  )
}
