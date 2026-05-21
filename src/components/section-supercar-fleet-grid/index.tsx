import clsx from 'clsx'
import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreCta } from '../core-cta'
import {
  CardBackgroundColor,
  type CardBackgroundColor as CardBackgroundColorType,
  CardType,
  type CardType as CardTypeType
} from '../core-supercar-card/io'
import { CoreTextMarkdown } from '../core-text-markdown'
import { FleetGrid } from './components/fleet-grid'
import { FleetGridTabsWrapper } from './components/fleet-grid-tabs-wrapper'
import {
  HeaderHorizontalAlignment,
  LayoutType,
  type LayoutType as LayoutTypeType,
  PackageType
} from './io'
import type { SectionSupercarFleetGridFragment } from './section-supercar-fleet-grid.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionSupercarFleetGridFragment
  isFirstSection?: boolean
}

export const SectionSupercarFleetGrid: FC<Props> = async ({
  data,
  isFirstSection
}) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const t = await getTranslations('section_supercar_fleet_grid')
  const {
    config,
    id,
    supercars,
    title,
    supercarGridConfig,
    description,
    ctas
  } = data
  const {
    showFilters = false,
    addCardLinks = true,
    layout: rawLayout,
    cardType: rawCardType = 'simple',
    headerBorder,
    headerHorizontalAlignment: rawHeaderHorizontalAlignment,
    cardBackgroundColor: rawCardBackgroundColor
  } = supercarGridConfig ?? {}

  // Parse config values
  const cardType: CardTypeType = (() => {
    if (rawCardType === null || rawCardType === undefined) {
      return 'simple'
    }
    const result = CardType.safeParse(rawCardType)
    return result.success ? result.data : 'simple'
  })()

  const headerHorizontalAlignment = (() => {
    if (
      rawHeaderHorizontalAlignment === null ||
      rawHeaderHorizontalAlignment === undefined
    ) {
      return undefined
    }
    const result = HeaderHorizontalAlignment.safeParse(
      rawHeaderHorizontalAlignment
    )
    return result.success ? result.data : undefined
  })()

  const cardBackgroundColor: CardBackgroundColorType | undefined = (() => {
    if (
      rawCardBackgroundColor === null ||
      rawCardBackgroundColor === undefined
    ) {
      return undefined
    }
    const result = CardBackgroundColor.safeParse(rawCardBackgroundColor)
    return result.success ? result.data : undefined
  })()

  const layout: LayoutTypeType = (() => {
    if (rawLayout === null || rawLayout === undefined) {
      return 'tabs'
    }
    const result = LayoutType.safeParse(rawLayout)
    return result.success ? result.data : 'tabs'
  })()

  // Split supercars by model.packageType
  const singleCarSupercars = supercars.filter((supercar) => {
    const packageType = supercar.model?.packageType
    if (!packageType) {
      return false
    }
    const result = PackageType.safeParse(packageType)
    return result.success && result.data === 'single'
  })

  const multiCarSupercars = supercars.filter((supercar) => {
    const packageType = supercar.model?.packageType
    if (!packageType) {
      return false
    }
    const result = PackageType.safeParse(packageType)
    return result.success && result.data === 'multi'
  })

  // Create tabs for packageTypes that have cars (without cars data - wrapper doesn't need it)
  const tabs: {
    id: 'single' | 'multi'
    label: string
  }[] = []

  if (singleCarSupercars.length > 0) {
    tabs.push({
      id: 'single',
      label: t('package_type.single_car')
    })
  }
  if (multiCarSupercars.length > 0) {
    tabs.push({
      id: 'multi',
      label: t('package_type.multi_car')
    })
  }

  const headerClassName = clsx(
    styles.header,
    headerBorder && styles['header--border'],
    headerHorizontalAlignment &&
      styles[`header--horizontal-alignment-${headerHorizontalAlignment}`]
  )

  // Pre-render header content on the server
  const headerContent = (
    <>
      {title && <HeadingTag className={styles.title}>{title}</HeadingTag>}
      {description && (
        <div className={styles.description}>
          <CoreTextMarkdown type="rte">{description}</CoreTextMarkdown>
        </div>
      )}
    </>
  )

  // Pre-render grids on the server for better performance
  // These are passed as children to the client wrapper which only handles tab visibility
  const singleCarGrid =
    singleCarSupercars.length > 0 ? (
      <FleetGrid
        supercars={singleCarSupercars}
        cardType={cardType}
        cardBackgroundColor={cardBackgroundColor}
        addLinks={addCardLinks}
        tabId="single"
      />
    ) : undefined

  const multiCarGrid =
    multiCarSupercars.length > 0 ? (
      <FleetGrid
        supercars={multiCarSupercars}
        cardType={cardType}
        cardBackgroundColor={cardBackgroundColor}
        addLinks={addCardLinks}
        tabId="multi"
      />
    ) : undefined

  const allCarsGrid =
    supercars.length > 0 ? (
      <FleetGrid
        supercars={supercars}
        cardType={cardType}
        cardBackgroundColor={cardBackgroundColor}
        addLinks={addCardLinks}
      />
    ) : undefined

  const emptyState = (
    <div className={styles.emptyState}>
      <p>{t('empty_state.no_cars')}</p>
    </div>
  )

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-supercar-fleet-grid"
    >
      <FleetGridTabsWrapper
        tabs={tabs}
        showFilters={showFilters}
        layout={layout}
        headerClassName={headerClassName}
        headerContent={headerContent}
        singleCarGrid={singleCarGrid}
        multiCarGrid={multiCarGrid}
        allCarsGrid={allCarsGrid}
        emptyState={emptyState}
      />

      {ctas && ctas.length > 0 && (
        <ul className={styles.ctas}>
          {ctas.map((cta) => (
            <li key={cta.id}>
              <CoreCta data={cta} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
