'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useBookingGiftCards } from '../../../../features/booking'
import { useCartAddAddon } from '../../../../features/cart'
import { useToast } from '../../../../features/toast'
import { DRAWER_REQUEST_OPEN_MESSAGE_NAME } from '../../../../core/messaging/main/messages/open-drawer'
import { useMainBus } from '../../../../core/messaging/main/react'
import { CART_DRAWER_ID } from '../../../global-cart/layouts/drawer'
import type { AddonFragment } from '../../../../core/dato/fragments/addon.typegen'
import { RocketRezProductType } from '../../../../io/schemas'
import styles from './style.module.scss'

export const FALLBACK_GIFT_OPTIONS: [number, string][] = [
  [100, 'Charger Hellcat Ride-Along, at-event merchandise, or photo/video add-ons.'],
  [300, 'Nissan GT-R Track Xperience + Driver Protection.'],
  [400, 'Corvette Z06 or Porsche GT4 RS Track Xperience.'],
  [500, 'Lamborghini, Ferrari, or Porsche Track Xperience + Driver Protection.'],
  [600, 'Ferrari 296 GTB Track Xperience + Driver Protection.'],
  [800, 'Up to 2 Track Xperiences + Driver Protection.'],
  [1000, 'Up to 3 Track Xperiences + Driver Protection and add-ons.'],
  [1500, 'Up to 4 Track Xperiences + Driver Protection and add-ons.'],
  [2000, 'Up to 5 Track Xperiences + Driver Protection.'],
  [3000, 'Up to 7 Track Xperiences + Driver Protection.']
]

type Props = {
  className?: string
}

type ResolvedGiftItem = {
  amount: number
  description: string
  addon?: AddonFragment
  rocketRezId?: string
}

export const GiftCardShop: React.FC<Props> = ({ className }) => {
  const { data: cmsGiftCards } = useBookingGiftCards()
  const { mutateAsync, isPending } = useCartAddAddon()
  const { showToast } = useToast()
  const bus = useMainBus(DRAWER_REQUEST_OPEN_MESSAGE_NAME, () => {})
  const addButtonRef = useRef<HTMLButtonElement>(null)

  // Combine DatoCMS addon records with prototype fallback descriptions
  const giftItems = useMemo<ResolvedGiftItem[]>(() => {
    if (cmsGiftCards && cmsGiftCards.length > 0) {
      return cmsGiftCards
        .map((addon) => {
          const rawPrice = addon.model?.price?.price ?? 0
          // In DatoCMS / RocketRez, prices are typically stored in cents (e.g. 10000 = $100).
          // If rawPrice >= 10000, convert from cents to dollars.
          const price = rawPrice >= 10000 ? Math.round(rawPrice / 100) : rawPrice
          const fallbackDesc =
            FALLBACK_GIFT_OPTIONS.find(([val]) => val === price)?.[1] ?? ''
          return {
            amount: price,
            description: addon.model?.description || fallbackDesc,
            addon,
            rocketRezId: addon.model?.rocketRezId ?? price.toString()
          }
        })
        .filter((item) => item.amount > 0)
        .sort((a, b) => a.amount - b.amount)
    }

    return FALLBACK_GIFT_OPTIONS.map(([val, desc]) => ({
      amount: val,
      description: desc,
      rocketRezId: val.toString()
    }))
  }, [cmsGiftCards])

  const [selectedAmount, setSelectedAmount] = useState<number>(() => {
    return giftItems[0]?.amount ?? 100
  })

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount)
    setTimeout(() => {
      addButtonRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }, 50)
  }

  // Keep selected amount valid if gift items change
  useEffect(() => {
    const firstItem = giftItems[0]
    if (firstItem && !giftItems.some((g) => g.amount === selectedAmount)) {
      setSelectedAmount(firstItem.amount)
    }
  }, [giftItems, selectedAmount])

  const defaultItem: ResolvedGiftItem = {
    amount: 100,
    description: FALLBACK_GIFT_OPTIONS[0]?.[1] ?? '',
    rocketRezId: '100'
  }
  const activeItem =
    giftItems.find((item) => item.amount === selectedAmount) ?? giftItems[0] ?? defaultItem
  const benefitCopy = activeItem.description

  const handleAddToCart = async () => {
    // If we have a full DatoCMS Addon record, use it directly!
    const addonToSubmit: AddonFragment = activeItem.addon ?? {
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
        rocketRezId: activeItem.rocketRezId ?? selectedAmount.toString(),
        rocketRezType: RocketRezProductType.GIFTCARD
      }
    }

    const lineItemId = activeItem.addon?.model?.rocketRezId
      ? parseInt(activeItem.addon.model.rocketRezId, 10) || selectedAmount
      : selectedAmount

    try {
      await mutateAsync({
        addon: addonToSubmit,
        lineItem: {
          id: lineItemId,
          type: RocketRezProductType.GIFTCARD,
          quantity: 1
        }
      })
      showToast({
        message: `$${selectedAmount.toLocaleString()} Gift Card added to your cart.`,
        type: 'success'
      })
      bus.send({
        name: DRAWER_REQUEST_OPEN_MESSAGE_NAME,
        details: { id: CART_DRAWER_ID }
      })
    } catch {
      showToast({
        message: 'Could not add gift card to cart.',
        type: 'error'
      })
    }
  }

  return (
    <section className={clsx(styles.giftshop, className)}>
      <div className={styles.giftcard_image}>
        <Image
          src="/images/gift-card-template.webp"
          alt="Xtreme Xperience gift card — A special gift for you, featuring cars on a racetrack"
          width={1200}
          height={720}
          priority
          className={styles.giftcard_image__img}
        />
        <span className={styles.giftcard_value} aria-label="Gift card value">
          ${selectedAmount.toLocaleString()}
        </span>
      </div>

      <div className={styles.giftcopy}>
        <h2>BIG DREAMS. THEIR CHOICE.</h2>
        <p>
          Give them the freedom to choose their experience. No date or session
          needed.
        </p>

        <div className={styles.eyebrow} id="giftamountlabel">
          CHOOSE A GIFT AMOUNT
        </div>

        <div
          className={styles.giftamounts}
          role="group"
          aria-labelledby="giftamountlabel"
        >
          {giftItems.map((item) => (
            <button
              key={item.amount}
              type="button"
              className={clsx(
                styles.amount_button,
                selectedAmount === item.amount && styles.amount_button__active
              )}
              aria-pressed={selectedAmount === item.amount}
              onClick={() => handleSelectAmount(item.amount)}
            >
              ${item.amount.toLocaleString()}
            </button>
          ))}
        </div>

        <div className={styles.gift_benefit} aria-live="polite" aria-atomic="true">
          <h3 className={styles.gift_benefit__title}>
            WHAT ${selectedAmount.toLocaleString()} COVERS
          </h3>
          <p className={styles.gift_benefit__copy}>{benefitCopy}</p>
        </div>

        <p className={styles.gift_guidance}>
          Experience ideas are based on our gift card guide. Pricing varies by
          car, date, location and selected extras.
        </p>

        <button
          ref={addButtonRef}
          type="button"
          className={styles.add_button}
          onClick={handleAddToCart}
          disabled={isPending}
        >
          {isPending
            ? 'ADDING...'
            : `ADD $${selectedAmount.toLocaleString()} GIFT CARD →`}
        </button>

        <p className={styles.note}>
          Stays in your cart alongside any drives or packages.
        </p>
      </div>
    </section>
  )
}
