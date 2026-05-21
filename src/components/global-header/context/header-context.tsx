'use client'
import { usePathname } from 'next/navigation'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import type { DrawerClose } from '../../../core/messaging/main/messages/drawer-close'
import { DRAWER_CLOSE_MESSAGE_NAME } from '../../../core/messaging/main/messages/drawer-close'
import type { DrawerOpen } from '../../../core/messaging/main/messages/set-active-drawer'
import { DRAWER_OPEN_MESSAGE_NAME } from '../../../core/messaging/main/messages/set-active-drawer'
import { useMainBus } from '../../../core/messaging/main/react'
import { useRouteChange } from '../../../features/route'
import { useHeaderScroll } from '../hooks/use-header-scroll'
import { useHeaderTransparency } from '../hooks/use-header-transparency'

type AnnouncementBarContextType = {
  isAnnouncementBarOpen: boolean
  setIsAnnouncementBarOpen: (isOpen: boolean) => void
}

type HeaderContextType = {
  headerRef: React.RefObject<HTMLDivElement | null>
  isScrolled: boolean
  isOffscreen: boolean
  isHeaderTransparent: boolean
  isSearchDrawerOpen: boolean
  isMegaMenuOpen: boolean
  openMegaMenuId: string | null
  setOpenMegaMenuId: (id: string | null) => void
}

const AnnouncementBarContext = createContext<
  AnnouncementBarContextType | undefined
>(undefined)

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

type HeaderProviderProps = {
  children: ReactNode
  relativePaths?: string | null
  isTransparent?: boolean | null
}

export const HeaderProvider = ({
  children,
  relativePaths,
  isTransparent
}: HeaderProviderProps) => {
  const pathname = usePathname()
  const [isAnnouncementBarOpen, setIsAnnouncementBarOpen] = useState(true)
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false)
  const [openMegaMenuId, setOpenMegaMenuId] = useState<string | null>(null)
  const isMegaMenuOpen = openMegaMenuId !== null
  const headerRef = useRef<HTMLDivElement>(null)
  const { isScrolled, isOffscreen } = useHeaderScroll()
  const isHeaderTransparent = useHeaderTransparency(
    pathname,
    relativePaths,
    isTransparent
  )

  const handleDrawerOpen = useCallback((event: DrawerOpen) => {
    if (event.details.id === 'search-drawer') {
      setIsSearchDrawerOpen(true)
    } else {
      setIsSearchDrawerOpen(false)
    }
  }, [])

  const handleDrawerClose = useCallback((event: DrawerClose) => {
    if (event.details.id === 'search-drawer') {
      setIsSearchDrawerOpen(false)
    }
  }, [])

  useMainBus(DRAWER_OPEN_MESSAGE_NAME, handleDrawerOpen)
  useMainBus(DRAWER_CLOSE_MESSAGE_NAME, handleDrawerClose)

  // Reset mega menu on route change
  useRouteChange(() => {
    setOpenMegaMenuId(null)
  })

  const announcementBarValue = useMemo(
    () => ({
      isAnnouncementBarOpen,
      setIsAnnouncementBarOpen
    }),
    [isAnnouncementBarOpen, setIsAnnouncementBarOpen]
  )

  const headerValue = useMemo(
    () => ({
      headerRef,
      isScrolled,
      isOffscreen,
      isHeaderTransparent,
      isSearchDrawerOpen,
      isMegaMenuOpen,
      openMegaMenuId,
      setOpenMegaMenuId
    }),
    [
      headerRef,
      isScrolled,
      isOffscreen,
      isHeaderTransparent,
      isSearchDrawerOpen,
      isMegaMenuOpen,
      openMegaMenuId
    ]
  )

  return (
    <AnnouncementBarContext.Provider value={announcementBarValue}>
      <HeaderContext.Provider value={headerValue}>
        {children}
      </HeaderContext.Provider>
    </AnnouncementBarContext.Provider>
  )
}

export const useHeader = () => {
  const announcementBarContext = useContext(AnnouncementBarContext)
  const headerContext = useContext(HeaderContext)

  if (!announcementBarContext || !headerContext) {
    throw new Error('useHeader must be used within a HeaderProvider')
  }

  return {
    ...announcementBarContext,
    ...headerContext
  }
}

export const useAnnouncementBar = () => {
  const context = useContext(AnnouncementBarContext)
  if (!context) {
    throw new Error('useAnnouncementBar must be used within a HeaderProvider')
  }
  return context
}
