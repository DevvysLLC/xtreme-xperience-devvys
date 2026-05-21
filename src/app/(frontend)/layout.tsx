import { CartDrawer } from '../../components/global-cart'
import { DrawerManager } from '../../components/global-drawer/drawer-manager'
import { GlobalFooter } from '../../components/global-footer'
import { GlobalHeader } from '../../components/global-header'
import { GlobalScrollManager } from '../../components/global-scroll-manager'
import { SearchDrawer } from '../../components/global-search'
import { GlobalSpeculationRules } from '../../components/global-speculation-rules'
import { GlobalToast } from '../../components/global-toast'
import { TrackFinderDrawer } from '../../components/global-track-finder/components/drawer'
import { GlobalTrackFinderStickyBar } from '../../components/global-track-finder/components/sticky-bar'
import { ENABLE_SEARCH } from '../../config/settings'

// Revalidate so document can be cached (helps back/forward cache)
export const revalidate = 60

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <GlobalHeader />
      <main className="main-content-container">{children}</main>
      <GlobalFooter />
      {ENABLE_SEARCH && <SearchDrawer />}
      <CartDrawer />
      <TrackFinderDrawer />
      <GlobalTrackFinderStickyBar />
      <GlobalScrollManager />
      <GlobalToast />
      <DrawerManager />
      <GlobalSpeculationRules />
    </>
  )
}
