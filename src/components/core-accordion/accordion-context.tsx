'use client'
import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState
} from 'react'

type AccordionGroupState = {
  openId: string | null
  setOpenId: (id: string | null) => void
}

const AccordionGroupContext = createContext<AccordionGroupState | null>(null)

export const useAccordionGroup = () => {
  return useContext(AccordionGroupContext)
}

type AccordionGroupProviderProps = {
  children: React.ReactNode
  name?: string
  defaultOpenId?: string | null
  onStateChange?: (openId: string | null) => void
}

export const AccordionGroupProvider: React.FC<AccordionGroupProviderProps> = ({
  children,
  name,
  defaultOpenId = null,
  onStateChange
}) => {
  // Initialize state with defaultOpenId
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null)
  const previousName = useRef<string | undefined>(name)

  // Track if this is the initial mount to avoid calling onStateChange during initialization
  const isInitialMount = useRef(true)
  // Track the previous openId to detect if change was from user interaction or restoration
  const previousOpenId = useRef<string | null>(defaultOpenId ?? null)
  // Track the source of the last state change to prevent loops
  const lastChangeSource = useRef<'user' | 'restore' | 'initial'>('initial')

  // Reset state when name changes (e.g., when tab changes)
  // Use useLayoutEffect to reset synchronously before accordions mount
  // Only sync defaultOpenId when name changes, not when defaultOpenId changes for the same name
  // This prevents infinite loops when onStateChange updates the parent state
  useLayoutEffect(() => {
    if (previousName.current !== name) {
      previousName.current = name
      isInitialMount.current = true // Reset for new tab
      lastChangeSource.current = 'restore' // Mark that we're restoring state
      const newOpenId = defaultOpenId ?? null
      previousOpenId.current = newOpenId
      // Set to defaultOpenId when name changes (for tab switching with persistence)
      setOpenId(newOpenId)
    }
  }, [name, defaultOpenId])

  // Notify parent when state changes (but not on initial mount or when restoring)
  // This hook must be called before any early returns
  useLayoutEffect(() => {
    if (!name) {
      return
    }
    if (isInitialMount.current) {
      isInitialMount.current = false
      previousOpenId.current = openId
      lastChangeSource.current = 'initial'
      return
    }
    // Only call onStateChange if the change came from user interaction
    if (
      previousOpenId.current !== openId &&
      lastChangeSource.current === 'user' &&
      onStateChange
    ) {
      previousOpenId.current = openId
      onStateChange(openId)
      // Reset source after notifying
      lastChangeSource.current = 'initial'
    } else if (previousOpenId.current !== openId) {
      // Update previousOpenId even if we don't call onStateChange
      previousOpenId.current = openId
      // Reset source if it was a restore
      if (lastChangeSource.current === 'restore') {
        lastChangeSource.current = 'initial'
      }
    }
  }, [openId, onStateChange, name])

  // Only provide context if name is provided
  if (!name) {
    return <>{children}</>
  }

  const handleSetOpenId = (id: string | null) => {
    lastChangeSource.current = 'user' // Mark as user interaction
    setOpenId(id)
  }

  return (
    <AccordionGroupContext.Provider
      value={{
        openId,
        setOpenId: handleSetOpenId
      }}
    >
      {children}
    </AccordionGroupContext.Provider>
  )
}
