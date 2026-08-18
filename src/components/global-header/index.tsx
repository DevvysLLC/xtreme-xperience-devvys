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
  const [{ globalConfig }, { header }, { allSupercars }] = await Promise.all([
    sdk.getGlobalConfig(),
    sdk.getHeader(),
    sdk.getSupercars()
  ])
  const { contactPhoneNumber, workingHours } = globalConfig ?? {}
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

  // Automatically enrich supercars dropdown menu with all supercars from DatoCMS
  // so no cars are omitted if only 8 were manually linked in DatoCMS navigation settings.
  const enrichedNavigation = navigation?.map((navItem) => {
    const hasSupercarChildren = navItem.children?.some(
      (child) => child.link?.__typename === 'SupercarRecord'
    )
    if (!hasSupercarChildren) {
      return navItem
    }

    const existingSupercarIds = new Set(
      navItem.children
        ?.map((child) =>
          child.link?.__typename === 'SupercarRecord'
            ? child.link.id
            : undefined
        )
        .filter((id): id is string => Boolean(id))
    )

    const additionalSupercars = (allSupercars ?? []).filter(
      (sc) =>
        !existingSupercarIds.has(sc.id) &&
        sc.content?.sections &&
        sc.content.sections.length > 0
    )

    const additionalChildren = additionalSupercars.map((sc) => ({
      __typename: 'NavigationItemRecord' as const,
      id: sc.id,
      label: sc.model?.title ?? null,
      path: sc.config?.handle ? `/supercars/${sc.config.handle}` : null,
      target: null,
      link: sc,
      media: null,
      children: []
    }))

    return {
      ...navItem,
      children: [...(navItem.children ?? []), ...additionalChildren]
    }
  })

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
          navigation={enrichedNavigation}
          showCart={showCart}
          showSearch={(ENABLE_SEARCH && showSearch) ?? false}
          showTrackFinder={showTrackFinder}
        />
      </div>

      <div className={styles.header__mobile}>
        <NavbarMobile
          navigation={enrichedNavigation}
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
