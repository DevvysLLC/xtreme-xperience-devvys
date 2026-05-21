'use client'

import { CoreAddonsCard } from '../../../core-addons-card'
import { useBookingWizardState } from '../../context'
import styles from './style.module.scss'

type Props = {
  onAddToCart: (rocketRezId: number) => void
}

export const RideAlongOptions: React.FC<Props> = ({ onAddToCart }) => {
  const { state } = useBookingWizardState()
  const options = state.configData?.rideAlong ?? []

  return (
    <div className={styles.grid}>
      {options.map((option) => {
        const rocketRezId = option.model?.rocketRezId
          ? Number(option.model.rocketRezId)
          : null

        return (
          <CoreAddonsCard
            key={option.id}
            addon={option}
            layout="featured"
            onAddToCart={
              rocketRezId
                ? () => {
                    onAddToCart(rocketRezId)
                  }
                : undefined
            }
          />
        )
      })}
    </div>
  )
}
