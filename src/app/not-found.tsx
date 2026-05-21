import { ErrorNotFound } from '../components/error-not-found'
import { DrawerManager } from '../components/global-drawer/drawer-manager'
import { GlobalFooter } from '../components/global-footer'
import { GlobalHeader } from '../components/global-header'
import { GlobalScrollManager } from '../components/global-scroll-manager'
import { TrackFinderDrawer } from '../components/global-track-finder'

export default async function NotFound() {
  return (
    <>
      <GlobalHeader isTransparent={false} />
      <main className="main-content-container">
        <ErrorNotFound />
      </main>
      <GlobalFooter />
      <TrackFinderDrawer />
      <GlobalScrollManager />
      <DrawerManager />
    </>
  )
}
