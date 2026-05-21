'use client'

import { CoreAddonsCard } from '../../../core-addons-card'
import { useBookingWizardState } from '../../context'
import styles from './style.module.scss'

export const MediaOptions: React.FC = () => {
  const { state } = useBookingWizardState()
  const cards = state.configData?.addons ?? []
  return (
    <div className={styles.grid}>
      {cards.map((card, index) => {
        return <CoreAddonsCard key={index} addon={card} />
      })}
    </div>
  )
}
