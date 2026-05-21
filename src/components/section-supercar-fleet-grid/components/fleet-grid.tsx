import clsx from 'clsx'
import type { FC } from 'react'
import { CoreSupercarCard } from '../../core-supercar-card'
import type {
  CardBackgroundColor as CardBackgroundColorType,
  CardType as CardTypeType
} from '../../core-supercar-card/io'
import type { PackageType as PackageTypeType } from '../io'
import type { SectionSupercarFleetGridFragment } from '../section-supercar-fleet-grid.typegen'
import styles from '../style.module.scss'

type Supercar = SectionSupercarFleetGridFragment['supercars'][number]

export type Props = {
  supercars: Supercar[]
  cardType: CardTypeType
  cardBackgroundColor?: CardBackgroundColorType
  addLinks?: boolean
  tabId?: PackageTypeType
  className?: string
}

export const FleetGrid: FC<Props> = ({
  supercars,
  cardType,
  cardBackgroundColor,
  addLinks = true,
  tabId,
  className
}) => {
  const effectiveCardType = tabId === 'multi' ? 'package' : cardType

  return (
    <div
      className={clsx(
        styles.grid,
        tabId === 'multi' && styles['grid--layout-multi'],
        tabId === 'single' && styles[`grid--card-type-${cardType}`],
        !tabId && styles[`grid--card-type-${cardType}`],
        className
      )}
    >
      {supercars.map((supercar) => (
        <CoreSupercarCard
          key={supercar.id}
          data={supercar}
          type={effectiveCardType}
          backgroundColor={cardBackgroundColor}
          addLinks={addLinks}
        />
      ))}
    </div>
  )
}
