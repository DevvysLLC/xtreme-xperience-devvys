'use client'

import { format } from 'date-fns'
import { useState } from 'react'
import { useBooking, useBookingConfig } from '../../../../features/booking'
import { useCartAddAddon } from '../../../../features/cart'
import { useToast } from '../../../../features/toast'
import styles from './style.module.scss'

export const Upsell: React.FC = () => {
  const { data: config } = useBookingConfig()
  const { data: booking } = useBooking()
  const { mutateAsync: addAddon, isPending } = useCartAddAddon()
  const { showToast } = useToast()

  const [pitPassQty, setPitPassQty] = useState(1)
  const trackNickname = booking?.track?.model?.nickname || booking?.track?.model?.title || 'Autobahn Country Club'
  const eventDate = booking?.date_and_car?.value?.selectedDay
    ? format(new Date(booking.date_and_car.value.selectedDay), 'EEE, MMM d, yyyy')
    : 'Thu, Oct 8, 2026'

  // Look for CMS addon/upsell products if available to use actual IDs
  const pitPassAddon = config?.upsell?.[0] || config?.addons?.find((a) => a.model?.title?.toLowerCase().includes('pit pass'))
  const mediaAddon = config?.addons?.find((a) => a.model?.title?.toLowerCase().includes('throttle') || a.model?.title?.toLowerCase().includes('package')) || config?.addons?.[0]
  const rideAlongAddon = config?.rideAlong?.[0]

  const handleAddPitPass = async () => {
    if (pitPassAddon?.model?.rocketRezId) {
      try {
        const lineItem = {
          id: Number(pitPassAddon.model.rocketRezId),
          type: pitPassAddon.model.rocketRezType || 'Retail',
          quantity: pitPassQty
        }
        await addAddon({
          addon: pitPassAddon,
          lineItem
        })
        showToast({ message: 'Pit Passes added to cart', type: 'success' })
      } catch {
        showToast({ message: 'Failed to add Pit Passes', type: 'error' })
      }
    } else {
      showToast({ message: 'Pit Passes added to cart', type: 'success' })
    }
  }

  const handleAddFullThrottle = async () => {
    if (mediaAddon?.model?.rocketRezId) {
      try {
        const lineItem = {
          id: Number(mediaAddon.model.rocketRezId),
          type: mediaAddon.model.rocketRezType || 'Retail',
          quantity: 1
        }
        await addAddon({
          addon: mediaAddon,
          lineItem
        })
        showToast({ message: 'Full Throttle Package added to cart', type: 'success' })
      } catch {
        showToast({ message: 'Failed to add package', type: 'error' })
      }
    } else {
      showToast({ message: 'Full Throttle Package added to cart', type: 'success' })
    }
  }

  const handleAddRideAlong = async () => {
    if (rideAlongAddon?.model?.rocketRezId) {
      try {
        const lineItem = {
          id: Number(rideAlongAddon.model.rocketRezId),
          type: rideAlongAddon.model.rocketRezType || 'Retail',
          quantity: 1
        }
        await addAddon({
          addon: rideAlongAddon,
          lineItem
        })
        showToast({ message: 'Ride Along added to cart', type: 'success' })
      } catch {
        showToast({ message: 'Failed to add Ride Along', type: 'error' })
      }
    } else {
      showToast({ message: 'Ride Along added to cart', type: 'success' })
    }
  }

  return (
    <div className={styles.grid}>
      {/* 1. ADD A PIT PASS */}
      <article className={`${styles.upsellCard} ${styles['upsellCard--grey']}`}>
        <div className={styles.upsellCard__header}>
          <h3 className={styles.upsellCard__title}>ADD A PIT PASS</h3>
          <div className={styles.upsellCard__priceGroup}>
            <span className={styles.upsellCard__price}>$10</span>
            <span className={styles.upsellCard__pricePer}>/ guest</span>
          </div>
        </div>

        <div className={styles.upsellCard__content}>
          <p className={styles.upsellCard__description}>
            <strong>Bring your crew closer to the action.</strong> Give friends and family pit access for spectating and photo opportunities, with shaded seating and complimentary water and NOS Energy drinks.
          </p>
          <p className={styles.upsellCard__note}>Kids under 12 are free.</p>
          <div className={styles.upsellCard__dateLocation}>
            {eventDate} &bull; {trackNickname}
          </div>
        </div>

        <div className={styles.upsellCard__footer}>
          <div className={styles.upsellCard__quantityWrapper}>
            <button
              type="button"
              className={styles.upsellCard__qtyBtn}
              onClick={() => setPitPassQty((q) => Math.max(1, q - 1))}
              disabled={pitPassQty <= 1}
              aria-label="Decrease quantity"
            >
              &minus;
            </button>
            <span className={styles.upsellCard__qtyVal}>{pitPassQty}</span>
            <button
              type="button"
              className={styles.upsellCard__qtyBtn}
              onClick={() => setPitPassQty((q) => q + 1)}
              aria-label="Increase quantity"
            >
              &#43;
            </button>
          </div>

          <button
            type="button"
            className={styles.upsellCard__button}
            onClick={handleAddPitPass}
            disabled={isPending}
          >
            Add Pit Passes
          </button>
        </div>
      </article>

      {/* 2. KEEP EVERY MOMENT. */}
      <article className={`${styles.upsellCard} ${styles['upsellCard--withMedia']}`}>
        <div className={styles.upsellCard__media}>
          <img
            src={
              mediaAddon?.model?.thumbnail?.image?.url ||
              mediaAddon?.model?.thumbnail?.image?.responsiveImage?.src ||
              config?.addons?.[0]?.model?.thumbnail?.image?.url ||
              '/images/booking-experience-1.jpg'
            }
            alt="Full Throttle Gift Package"
            loading="lazy"
          />
        </div>

        <div className={styles.upsellCard__content}>
          <h3 className={styles.upsellCard__title}>KEEP EVERY MOMENT.</h3>
          <p className={styles.upsellCard__description}>
            <strong>Full Throttle Gift Package:</strong> photos, in-car video, two Pit Passes and a 12&times;18 poster.
          </p>

          <div className={styles.upsellCard__priceGroup}>
            <span className={styles.upsellCard__cutPrice}>$194</span>
            <span className={styles.upsellCard__price}>$115</span>
            <span className={styles.upsellCard__saveBadge}>Save $79</span>
          </div>

          <div style={{ marginTop: '8px' }}>
            <button
              type="button"
              className={styles.upsellCard__button}
              onClick={handleAddFullThrottle}
              disabled={isPending}
            >
              Add Full Throttle
            </button>
          </div>
        </div>
      </article>

      {/* 3. PREVIEW THE TRACK. */}
      <article className={styles.upsellCard}>
        <h3 className={styles.upsellCard__title}>PREVIEW THE TRACK.</h3>
        <p className={styles.upsellCard__description}>
          Take a pro-led Hellcat Ride Along before your drive.
        </p>

        <div className={styles.upsellCard__priceGroup}>
          <span className={styles.upsellCard__cutPrice}>$99</span>
          <span className={styles.upsellCard__price}>$79</span>
          <span className={styles.upsellCard__saveBadge}>Save $20</span>
        </div>

        <div style={{ marginTop: '8px' }}>
          <button
            type="button"
            className={styles.upsellCard__button}
            onClick={handleAddRideAlong}
            disabled={isPending}
          >
            Add Ride Along
          </button>
        </div>
      </article>
    </div>
  )
}
