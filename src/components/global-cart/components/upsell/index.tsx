'use client'

import { useBookingConfig } from '../../../../features/booking'
import { CoreAddonsCard } from '../../../core-addons-card'
import styles from './style.module.scss'

export const Upsell: React.FC = () => {
  const { data } = useBookingConfig()
  const upsell =
    data?.upsell && data.upsell.length > 0
      ? data.upsell
      : data?.addons?.filter((item) =>
          item.model?.title?.toLowerCase().includes('pit pass')
        ) ?? []

  if (!upsell || upsell.length === 0) {
    return null
  }

  return (
    <div className={styles.grid}>
      {upsell.map((item) => (
        <CoreAddonsCard
          key={item.id}
          layout="upsell"
          addon={item}
          showQuantitySelector={true}
        />
      ))}
    </div>
  )
}
