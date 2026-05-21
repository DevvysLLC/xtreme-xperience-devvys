import { initDatoSdk } from '../../../core/dato/sdk'
import { StickyBarContent } from './sticky-bar-content'

export const GlobalTrackFinderStickyBar = async () => {
  const sdk = initDatoSdk()
  const { globalConfig } = await sdk.getGlobalConfig()

  if (!globalConfig?.enableBookingBar) {
    return null
  }

  const {
    hideBookingBarOnPaths,
    stickyTrackFinderHeading,
    stickyTrackFinderLinks
  } = globalConfig

  return (
    <StickyBarContent
      hideBookingBarOnPaths={hideBookingBarOnPaths}
      stickyTrackFinderHeading={stickyTrackFinderHeading}
      stickyTrackFinderLinks={stickyTrackFinderLinks}
    />
  )
}
