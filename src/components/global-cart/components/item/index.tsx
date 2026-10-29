'use client'

import clsx from 'clsx'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl'
import { type FC, useState } from 'react'
import { EditGiftCardModal } from '../../../booking-wizard/components/edit-gift-card-modal'
import { logger } from '../../../../core/logger/logger'
import { sentenceCase } from '../../../../core/string/sentence-case'
import {
  useCartLineItemMetadata,
  useCartRemoveLineItem
} from '../../../../features/cart'
import { useBookingSetIntendedPage } from '../../../../features/booking'
import type {
  CartLineItemMetadata,
  RocketRezLineItem
} from '../../../../io/types'
import { CoreBadge } from '../../../core-badge'
import { CoreCta } from '../../../core-cta'
import { CoreLoadingSpinner } from '../../../core-loading-spinner'
import { CoreRocketRezPrice } from '../../../core-rocketrez-price'
import { CoreTextMarkdown } from '../../../core-text-markdown'
import styles from './style.module.scss'

import { usePathname, useRouter } from 'next/navigation'
import { ROUTES } from '../../../../config/routes'
import { DRAWER_REQUEST_CLOSE_MESSAGE_NAME } from '../../../../core/messaging/main/messages/close-drawer'
import { useMainBus } from '../../../../core/messaging/main/react'
import { CART_DRAWER_ID } from '../../layouts/drawer'

type Props = {
  lineItem: RocketRezLineItem
  compact?: boolean
  readOnly?: boolean
  metadata?: CartLineItemMetadata | null
}

export const CartLineItem: FC<Props> = ({
  lineItem,
  compact = false,
  readOnly = false,
  metadata: externalMetadata
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const isReviewPage = pathname?.includes('/review')
  const drawerBus = useMainBus(DRAWER_REQUEST_CLOSE_MESSAGE_NAME, () => {})
  const t = useTranslations('global_cart')
  const { mutateAsync } = useCartRemoveLineItem()
  const { mutateAsync: setIntendedPage } = useBookingSetIntendedPage()
  const cartMetadata = useCartLineItemMetadata({ lineItem })
  const metadata =
    externalMetadata !== undefined ? externalMetadata : cartMetadata.metadata
  const isLoading =
    externalMetadata !== undefined ? false : cartMetadata.isLoading

  const { id, price } = lineItem
  const { title, image, subtitle, label, properties, type } = metadata ?? {}
  const fallbackTitle = metadata?.isMulticar
    ? 'Package'
    : `${lineItem.type} #${lineItem.productId}`
  const displayTitle = title?.trim() || lineItem.name?.trim() || fallbackTitle
  const { date, laps } = properties ?? {}
  const displaySubtitle = label ? sentenceCase(label) : subtitle

  const handleRemove = async () => {
    try {
      await mutateAsync({ lineItem })
    } catch (error) {
      logger.error({ error, lineItem }, 'cart-item.handleRemove.error')
    }
  }

  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false)

  if (compact) {
    const isGiftCard =
      lineItem.type === 'giftcard' ||
      (lineItem.name != null && lineItem.name.toLowerCase().includes('gift')) ||
      (displayTitle != null && displayTitle.toLowerCase().includes('gift'))
    const trackNickname = subtitle || ''

    const referenceValue =
      properties &&
      typeof properties === 'object' &&
      'referenceValue' in properties &&
      typeof properties.referenceValue === 'number'
        ? properties.referenceValue
        : undefined

    const savings =
      properties &&
      typeof properties === 'object' &&
      'savings' in properties &&
      typeof properties.savings === 'number'
        ? properties.savings
        : undefined

    const isEstimatedDiscountPage =
      Boolean(pathname) &&
      (pathname.includes('/booking/choose-date-and-car') ||
        pathname.includes('/booking/coverage-options') ||
        pathname.includes('/booking/ride-along') ||
        pathname.includes('/booking/media-packages'))

    const itemTotal = price * (lineItem.quantity ?? 1)
    const originalPrice =
      referenceValue != null && referenceValue > itemTotal
        ? referenceValue
        : itemTotal
    const discountedPrice =
      savings != null && savings > 0
        ? Math.max(0, originalPrice - savings)
        : itemTotal

    const isInsurance = type === 'insurance'
    const isPitPass =
      (lineItem.name != null && lineItem.name.toLowerCase().includes('pit pass')) ||
      (displayTitle != null && displayTitle.toLowerCase().includes('pit pass'))
    const isFullThrottleOrMedia =
      (lineItem.name != null && (lineItem.name.toLowerCase().includes('throttle') || lineItem.name.toLowerCase().includes('media'))) ||
      (displayTitle != null && (displayTitle.toLowerCase().includes('throttle') || displayTitle.toLowerCase().includes('media')))
    const isRideAlong =
      metadata?.isRideAlong === true ||
      (lineItem.name != null && (lineItem.name.toLowerCase().includes('ride along') || lineItem.name.toLowerCase().includes('ride-along') || lineItem.name.toLowerCase().includes('hellcat'))) ||
      (displayTitle != null && (displayTitle.toLowerCase().includes('ride along') || displayTitle.toLowerCase().includes('ride-along') || displayTitle.toLowerCase().includes('hellcat')))
    const shouldHideEdit = isPitPass || isFullThrottleOrMedia

    const handleEdit = async () => {
      if (typeof window === 'undefined') {
        return
      }
      if (isGiftCard) {
        setIsGiftModalOpen(true)
        return
      }

      if (isRideAlong) {
        if (!window.location.pathname.includes('/booking/ride-along')) {
          try {
            await setIntendedPage('ride_along')
          } catch (error) {
            logger.error({ error }, 'cart-line-item.handleEdit.setIntendedPage.error')
          }
          router.push(ROUTES.BOOKING.RIDE_ALONG)
        }
        return
      }

      // Check if metadata has saved seatTypeId, or fallback to lineItem identifiers
      const rawProps = properties && typeof properties === 'object' ? properties : null
      const metaSeatId =
        rawProps && 'seatTypeId' in rawProps && typeof rawProps.seatTypeId === 'number'
          ? rawProps.seatTypeId
          : null
      const seatId = metaSeatId || lineItem.productId || lineItem.rateId

      if (seatId) {
        // Close cart drawer so user sees the schedule panel
        drawerBus.send({
          name: DRAWER_REQUEST_CLOSE_MESSAGE_NAME,
          details: { id: CART_DRAWER_ID }
        })

        // Save target in sessionStorage for page transitions
        try {
          sessionStorage.setItem('pendingEditSeatTypeId', seatId.toString())
          sessionStorage.setItem('pendingEditLineItemId', lineItem.id.toString())
        } catch (error) {
          logger.error({ error }, 'cart-line-item.handleEdit.sessionStorage.error')
        }

        // Set intended wizard page so BookingWizardGuard allows navigation
        try {
          await setIntendedPage('date_and_car')
        } catch (error) {
          logger.error({ error }, 'cart-line-item.handleEdit.setIntendedPage.error')
        }

        // If not already on the choose-date-and-car page, navigate there
        if (!window.location.pathname.includes('/booking/choose-date-and-car')) {
          router.push(ROUTES.BOOKING.DATE_AND_CAR)
          return
        }

        // Dispatch custom event to notify SupercarOptions component
        window.dispatchEvent(
          new CustomEvent('open-supercar-schedule', {
            detail: {
              seatTypeId: seatId,
              lineItemId: lineItem.id,
              isPackage: metadata?.isMulticar ?? false
            }
          })
        )
      }
    }

    const compactDisplayTitle = isInsurance
      ? 'Base Driver Protection'
      : isPitPass
        ? `Pit Pass × ${lineItem.quantity ?? 1}`
        : displayTitle

    return (
      <article className={clsx(styles.CartLineItemCompact, isInsurance && styles['CartLineItemCompact--insurance'])}>
        <div className={styles.CartLineItemCompact__media}>
          {isPitPass ? (
            <div className={styles.CartLineItemCompact__ticketIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V6Z"></path><path d="M15 6v3m0 2v2m0 2v3"></path></svg>
            </div>
          ) : (
            <img
              src={image || '/images/fallback.png'}
              alt={compactDisplayTitle}
              className={styles.CartLineItemCompact__image}
              loading="lazy"
            />
          )}
        </div>

        <div className={styles.CartLineItemCompact__content}>
          <div className={styles.CartLineItemCompact__header}>
            <div className={styles.CartLineItemCompact__title}>
              <CoreTextMarkdown>{compactDisplayTitle}</CoreTextMarkdown>
            </div>

            <div className={styles.CartLineItemCompact__priceWrapper}>
              {isEstimatedDiscountPage && savings != null && savings > 0 ? (
                <>
                  <div className={styles.CartLineItemCompact__priceRow}>
                    <span className={styles.CartLineItemCompact__cutPrice}>
                      ${Math.ceil(originalPrice)}
                    </span>
                    <span className={styles.CartLineItemCompact__price}>
                      ${Math.ceil(discountedPrice)}
                    </span>
                  </div>
                  <span className={styles.CartLineItemCompact__saving}>
                    ${Math.round(savings)} off at checkout
                  </span>
                  <span className={styles.CartLineItemCompact__discountNote}>
                    Price after discount
                  </span>
                </>
              ) : (
                <>
                  {referenceValue != null &&
                    referenceValue > price * (lineItem.quantity ?? 1) && (
                      <span className={styles.CartLineItemCompact__cutPrice}>
                        ${Math.ceil(referenceValue)}
                      </span>
                    )}
                  <CoreRocketRezPrice
                    data={{
                      id: `${id}-price`,
                      price: price * (lineItem.quantity ?? 1)
                    }}
                    className={styles.CartLineItemCompact__price}
                    valueInCents={false}
                  />
                  {savings != null && savings > 0 && (
                    <span className={styles.CartLineItemCompact__saving}>
                      Saving ${Math.round(savings)}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className={styles.CartLineItemCompact__details}>
            {isInsurance ? (
              <p className={styles.CartLineItemCompact__meta}>
                {lineItem.quantity ?? 1} session &times; ${price}
              </p>
            ) : isPitPass ? (
              <>
                {date && (
                  <p className={styles.CartLineItemCompact__meta}>
                    {format(date, 'EEE, MMM d, yyyy')}
                  </p>
                )}
                {trackNickname && (
                  <p className={styles.CartLineItemCompact__meta}>
                    {trackNickname}
                  </p>
                )}
                <p className={styles.CartLineItemCompact__meta}>
                  {lineItem.quantity ?? 1} guest &times; ${price}
                </p>
              </>
            ) : isFullThrottleOrMedia ? (
              <p className={styles.CartLineItemCompact__meta}>Media package</p>
            ) : isGiftCard ? (
              <p>Digital gift card</p>
            ) : (
              <>
                {date && (
                  <p className={styles.CartLineItemCompact__meta}>
                    {format(date, 'EEE, MMM d, yyyy · h:mm a')}
                  </p>
                )}
                {trackNickname && (
                  <p className={styles.CartLineItemCompact__meta}>
                    {trackNickname}
                  </p>
                )}
                {laps && (
                  <p className={styles.CartLineItemCompact__meta}>
                    {laps} {laps === 1 ? 'Lap' : 'Laps'}
                  </p>
                )}
              </>
            )}
          </div>

          {!readOnly && (
            <div className={styles.CartLineItemCompact__actions}>
              {isInsurance ? (
                isReviewPage && (
                  <button
                    type="button"
                    className={styles.CartLineItemCompact__actionBtn}
                    onClick={async () => {
                      try {
                        await setIntendedPage('coverage_options')
                      } catch (error) {
                        logger.error({ error }, 'cart-line-item.editCoverage.error')
                      }
                      router.push(ROUTES.BOOKING.COVERAGE_OPTIONS)
                    }}
                  >
                    Edit coverage
                  </button>
                )
              ) : isRideAlong ? (
                isReviewPage ? (
                  <>
                    <button
                      type="button"
                      className={styles.CartLineItemCompact__actionBtn}
                      onClick={async () => {
                        try {
                          await setIntendedPage('ride_along')
                        } catch (error) {
                          logger.error({ error }, 'cart-line-item.editRideAlong.error')
                        }
                        router.push(ROUTES.BOOKING.RIDE_ALONG)
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={styles.CartLineItemCompact__actionBtn}
                      onClick={handleRemove}
                      aria-label={t('item.remove')}
                    >
                      {t('item.remove')}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={styles.CartLineItemCompact__actionBtn}
                    onClick={handleRemove}
                    aria-label={t('item.remove')}
                  >
                    {t('item.remove')}
                  </button>
                )
              ) : shouldHideEdit ? (
                <button
                  type="button"
                  className={styles.CartLineItemCompact__actionBtn}
                  onClick={handleRemove}
                  aria-label={t('item.remove')}
                >
                  {t('item.remove')}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className={styles.CartLineItemCompact__actionBtn}
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.CartLineItemCompact__actionBtn}
                    onClick={handleRemove}
                    aria-label={t('item.remove')}
                  >
                    {t('item.remove')}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {isGiftCard && (
          <EditGiftCardModal
            isOpen={isGiftModalOpen}
            lineItem={lineItem}
            onClose={() => setIsGiftModalOpen(false)}
          />
        )}
      </article>
    )
  }

  return (
    <article className={styles.CartLineItem}>
      {isLoading ? (
        <CoreLoadingSpinner aspectRatio="16/9" />
      ) : (
        <>
          <div className={styles.CartLineItem__media}>
            <img
              src={image || '/images/fallback.png'}
              alt={displayTitle}
              className={styles.CartLineItem__image}
              loading="lazy"
            />
          </div>

          <div className={styles.CartLineItem__title}>
            <h3>
              <CoreTextMarkdown>{displayTitle}</CoreTextMarkdown>
            </h3>

            {displaySubtitle && (
              <div className={styles.CartLineItem__subtitle}>
                <CoreTextMarkdown>{displaySubtitle}</CoreTextMarkdown>
              </div>
            )}
          </div>

          <div className={styles.CartLineItem__content}>
            {date && (
              <div className={styles.CartLineItem__date}>
                {format(date, 'EEEE M/d/yy')}
              </div>
            )}

            {date && (
              <div className={styles.CartLineItem__time}>
                {format(date, 'h:mm a')}

                {type !== 'addon' && laps && (
                  <div
                    className={clsx(
                      styles.CartLineItem__laps,
                      styles['CartLineItem__laps--mobile']
                    )}
                  >
                    <CoreBadge
                      label={`${laps} laps`}
                      backgroundColor="#F0EDEB"
                      color="#111111"
                    />
                  </div>
                )}
              </div>
            )}

            {type === 'addon' ? (
              <div />
            ) : (
              <div
                className={clsx(
                  styles.CartLineItem__laps,
                  styles['CartLineItem__laps--desktop']
                )}
              >
                {laps && (
                  <CoreBadge
                    label={`${laps} laps`}
                    backgroundColor="#F0EDEB"
                    color="#111111"
                  />
                )}
              </div>
            )}

            <div className={styles.CartLineItem__inner}>
              <CoreRocketRezPrice
                className={styles.CartLineItem__price}
                priceClassName="u-color-orange"
                data={{
                  id: `${id}-price`,
                  price: price * (lineItem.quantity ?? 1)
                }}
                valueInCents={false}
              />

              {!readOnly && type !== 'insurance' && (
                <CoreCta
                  text={t('item.remove')}
                  className={styles.CartLineItem__remove}
                  onClick={handleRemove}
                  styleType="black"
                  layoutType="text"
                  sizeType="small"
                  type="button"
                />
              )}
            </div>
          </div>
        </>
      )}
    </article>
  )
}
