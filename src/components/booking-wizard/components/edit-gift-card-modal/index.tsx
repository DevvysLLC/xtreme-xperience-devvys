'use client'

import Image from 'next/image'
import { type FC, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useBookingGiftCards } from '../../../../features/booking'
import { useCartAddAddon, useCartRemoveLineItem } from '../../../../features/cart'
import { useToast } from '../../../../features/toast'
import type { AddonFragment } from '../../../../core/dato/fragments/addon.typegen'
import type { RocketRezLineItem } from '../../../../io/types'
import { RocketRezProductType } from '../../../../io/schemas'
import { FALLBACK_GIFT_OPTIONS } from '../gift-card-shop'
import styles from './style.module.scss'

type Props = {
  isOpen: boolean
  lineItem?: RocketRezLineItem | null
  onClose: () => void
}

export const EditGiftCardModal: FC<Props> = ({ isOpen, lineItem, onClose }) => {
  const initialAmount = lineItem?.price ?? 100
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount)
  const { data: cmsGiftCards } = useBookingGiftCards()
  const { mutateAsync: removeLineItem } = useCartRemoveLineItem()
  const { mutateAsync: addAddon, isPending } = useCartAddAddon()
  const { showToast } = useToast()

  useEffect(() => {
    if (lineItem?.price) {
      setSelectedAmount(lineItem.price)
    }
  }, [lineItem?.price])

  useEffect(() => {
    if (!isOpen) {
      return
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  const activeOption = FALLBACK_GIFT_OPTIONS.find(([val]) => val === selectedAmount)
  const benefitCopy =
    activeOption?.[1] ??
    FALLBACK_GIFT_OPTIONS[0]?.[1] ??
    'Charger Hellcat Ride-Along, at-event merchandise, or photo/video add-ons.'

  const handleSave = async () => {
    if (!lineItem) {
      onClose()
      return
    }

    // If amount didn't change, just close
    if (selectedAmount === lineItem.price) {
      onClose()
      return
    }

    // Match real CMS gift card product by dollar amount
    const matchedCmsCard = cmsGiftCards?.find((addon) => {
      const rawPrice = addon.model?.price?.price ?? 0
      const price = rawPrice >= 10000 ? Math.round(rawPrice / 100) : rawPrice
      return price === selectedAmount
    })

    const rocketRezId = matchedCmsCard?.model?.rocketRezId ?? selectedAmount.toString()
    const lineItemId = matchedCmsCard?.model?.rocketRezId
      ? parseInt(matchedCmsCard.model.rocketRezId, 10) || selectedAmount
      : selectedAmount

    const addonToSubmit: AddonFragment = matchedCmsCard ?? {
      __typename: 'AddonRecord',
      id: `gift-card-${selectedAmount}`,
      model: {
        __typename: 'AddonModelRecord',
        id: `gift-card-${selectedAmount}`,
        title: `$${selectedAmount.toLocaleString()} Gift Card`,
        price: {
          __typename: 'CorePriceRecord',
          id: `price-${selectedAmount}`,
          price: selectedAmount,
          compareAtPrice: null
        },
        badge: null,
        description: benefitCopy,
        thumbnail: {
          __typename: 'CoreImageRecord',
          id: 'gift-card-thumbnail',
          image: {
            __typename: 'FileField',
            id: 'gift-card-image',
            url: '/images/gift-card-template.webp',
            width: 1200,
            height: 720,
            alt: `Xtreme Xperience $${selectedAmount} Gift Card`,
            format: 'webp',
            title: null,
            focalPoint: null,
            responsiveImage: null
          },
          desktopImage: null
        },
        rocketRezId,
        rocketRezType: RocketRezProductType.GIFTCARD
      }
    }

    try {
      // 1. Add new gift card first so the user never loses their card on failure
      await addAddon({
        addon: addonToSubmit,
        lineItem: {
          id: lineItemId,
          type: RocketRezProductType.GIFTCARD,
          quantity: 1
        }
      })

      // 2. Remove the previous gift card line item now that the new one succeeded
      await removeLineItem({ lineItem })

      showToast({
        message: `Updated to $${selectedAmount.toLocaleString()} Gift Card.`,
        type: 'success'
      })
      onClose()
    } catch {
      showToast({
        message: 'Could not update gift card amount.',
        type: 'error'
      })
    }
  }

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-gift-card-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__header}>
          <h2 id="edit-gift-card-title" className={styles.modal__title}>
            EDIT GIFT CARD
          </h2>
          <button
            type="button"
            className={styles.modal__close}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className={styles.modal__body}>
          <div className={styles.cardPreview}>
            <Image
              src="/images/gift-card-template.webp"
              alt={`Xtreme Xperience $${selectedAmount} Gift Card`}
              width={600}
              height={360}
              className={styles.cardPreview__img}
              priority
            />
            <span className={styles.cardPreview__amount}>
              ${selectedAmount.toLocaleString()}
            </span>
          </div>

          <div className={styles.field}>
            <label htmlFor="gift-amount-select" className={styles.field__label}>
              Gift amount
            </label>
            <select
              id="gift-amount-select"
              className={styles.field__select}
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(Number(e.target.value))}
            >
              {FALLBACK_GIFT_OPTIONS.map(([val]) => (
                <option key={val} value={val}>
                  ${val.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.covers}>
            <strong className={styles.covers__title}>
              WHAT ${selectedAmount.toLocaleString()} COVERS
            </strong>
            <p className={styles.covers__desc}>{benefitCopy}</p>
          </div>

          <button
            type="button"
            className={styles.modal__save}
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? 'SAVING...' : 'SAVE GIFT AMOUNT'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
