import { ENABLE_SEARCH } from '../../config/settings'
import { initDatoSdk } from '../../core/dato/sdk'
import { SectionRenderer } from '../section-renderer'
import { HeaderWithContext } from './components/header-with-context'
import { NavbarDesktop } from './components/navbar-desktop'
import { NavbarMobile } from './components/navbar-mobile'
import { QuickLinks } from './components/quick-links'
import styles from './style.module.scss'

type Props = {
  isTransparent?: boolean | null
}

export const GlobalHeader = async ({ isTransparent }: Props = {}) => {
  const sdk = initDatoSdk()
  const { globalConfig } = await sdk.getGlobalConfig()
  const { contactPhoneNumber, workingHours } = globalConfig ?? {}
  const { header } = await sdk.getHeader()
  const { config, content } = header ?? {}
  const { sections } = content ?? { sections: [] }

  const {
    navigation,
    showCart,
    showSearch,
    showTrackFinder,
    quickLinks,
    relativePaths,
    featuredMobileNavigation
  } = config ?? {}

  return (
    <HeaderWithContext
      relativePaths={relativePaths}
      isTransparent={isTransparent}
    >
      <div className={styles.header__sections}>
        {sections.length > 0 && <SectionRenderer sections={sections} />}
      </div>

      <div className={styles.header__desktop}>
        <NavbarDesktop
          navigation={navigation}
          showCart={showCart}
          showSearch={(ENABLE_SEARCH && showSearch) ?? false}
          showTrackFinder={showTrackFinder}
        />
      </div>

      <div className={styles.header__mobile}>
        <NavbarMobile
          navigation={navigation}
          showCart={showCart}
          showSearch={(ENABLE_SEARCH && showSearch) ?? false}
          showTrackFinder={showTrackFinder}
          featuredMobileNavigation={featuredMobileNavigation}
          contactPhoneNumber={contactPhoneNumber}
          workingHours={workingHours}
        />

        {quickLinks?.children && quickLinks.children.length > 0 && (
          <QuickLinks items={quickLinks.children} />
        )}
      </div>
    </HeaderWithContext>
  )
}
