import { initDatoSdk } from '../../../core/dato/sdk'
import { StickyBarContent } from './sticky-bar-content'

export const GlobalTrackFinderStickyBar = async () => {
  const sdk = initDatoSdk()
  const { globalConfig } = await sdk.getGlobalConfig()

  const {
    enableBookingBar,
    hideBookingBarOnPaths,
    stickyTrackFinderHeading,
    stickyTrackFinderLinks
  } = globalConfig ?? {}

  return (
    <StickyBarContent
      enableBookingBar={Boolean(enableBookingBar)}
      hideBookingBarOnPaths={hideBookingBarOnPaths}
      stickyTrackFinderHeading={stickyTrackFinderHeading}
      stickyTrackFinderLinks={stickyTrackFinderLinks}
    />
  )
}
