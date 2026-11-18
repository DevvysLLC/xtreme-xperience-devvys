'use client'

import { type QueryClient, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import {
  ApiCartResponseSchema,
  ApiEventsGetEventResponseSchema,
  RocketRezProductType,
  RocketRezScheduleStatus
} from '../../io/schemas'
import type {
  BookingState,
  CartLineItemMetadata,
  CartState,
  RocketRezCart,
  RocketRezLineItem
} from '../../io/types'
import { CartKeyHelpers } from '../../utils/cart-key'
import { getCartLineItemReadMetadataKey } from '../../utils/get-cart-line-item-metadata-key'
import { isScheduleSoldOut } from '../../utils/is-schedule-sold-out'
import { BOOKING_QUERY_KEY } from '../booking/keys'
import { getRequiredRateIdsForSupercar } from '../booking/use-booking-supercar-schedule'
import { CART_HOLD_DURATION_MS, LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY } from './keys'
import { cartRepository, initialCartState } from './repository'

export const isCartHoldExpired = (
  cartState: Pick<CartState, 'holdExpired' | 'timerStartedAt' | 'cartData'>
): boolean => {
  const hasItems = (cartState.cartData?.lineItems?.length ?? 0) > 0
  if (!hasItems) {
    return false
  }
  if (cartState.holdExpired) {
    return true
  }
  if (!cartState.timerStartedAt) {
    return false
  }
  const startMs = new Date(cartState.timerStartedAt).getTime()
  if (Number.isNaN(startMs)) {
    return false
  }
  return Date.now() - startMs >= CART_HOLD_DURATION_MS
}

const releasingKeys = new Set<string>()

export const releaseCartHoldInRocketRez = async (
  qc: QueryClient
): Promise<void> => {
  const current = qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
  const hasItems = (current.cartData?.lineItems?.length ?? 0) > 0
  if (!hasItems) {
    return
  }

  const cartKeyToRelease = current.cartKey ?? null

  if (!current.holdExpired || current.cartKey !== null) {
    const next: CartState = {
      ...current,
      cartKey: null,
      tokenExpiry: null,
      holdExpired: true,
      isMutating: false,
      isLoading: false
    }
    qc.setQueryData(CART_QUERY_KEY, next)
    cartRepository.write(next)
  }

  if (!cartKeyToRelease || releasingKeys.has(cartKeyToRelease)) {
    return
  }

  releasingKeys.add(cartKeyToRelease)
  try {
    logger.info(
      { hasCartKey: true },
      `${LOG_NAMESPACE}: hold.release — releasing reservation in RocketRez`
    )
    await fetch(ROUTES.API.CART.CLEAR, {
      method: 'DELETE',
      headers: { 'x-cart-key': cartKeyToRelease }
    })
  } catch (error) {
    logger.warn(
      { error },
      `${LOG_NAMESPACE}: hold.release — failed to release RocketRez cart`
    )
  } finally {
    releasingKeys.delete(cartKeyToRelease)
  }
}

const remapMetadataForNewCart = (
  oldLineItems: RocketRezLineItem[],
  newLineItems: RocketRezLineItem[],
  metadataList: CartLineItemMetadata[]
): CartLineItemMetadata[] => {
  const updated = [...metadataList]

  for (const newItem of newLineItems) {
    const newKey = getCartLineItemReadMetadataKey({ lineItem: newItem })
    if (updated.some((m) => m.key === newKey)) {
      continue
    }

    const matchingOldItem = oldLineItems.find(
      (oldItem) =>
        oldItem.productId === newItem.productId &&
        oldItem.type === newItem.type &&
        oldItem.quantity === newItem.quantity &&
        (oldItem.scheduleId ?? null) === (newItem.scheduleId ?? null) &&
        (oldItem.rateId ?? null) === (newItem.rateId ?? null)
    )

    if (!matchingOldItem) {
      continue
    }

    const oldKey = getCartLineItemReadMetadataKey({ lineItem: matchingOldItem })
    const matchedMeta = updated.find((m) => m.key === oldKey)
    if (matchedMeta) {
      updated.push({
        ...matchedMeta,
        key: newKey
      })
    }
  }

  return updated
}

export type RecreateHoldResult =
  | { status: 'active'; priceChanged: false }
  | {
      status: 'available'
      priceChanged: boolean
      oldTotal: number
      newTotal: number
    }
  | {
      status: 'sold_out'
      failedLineItem: RocketRezLineItem | null
      seatTypeId: number | null
    }

export const useCartRecreateHold = () => {
  const qc = useQueryClient()
  const [isRecreating, setIsRecreating] = useState(false)

  const recreateHold = useCallback(async (): Promise<RecreateHoldResult> => {
    const cartState =
      qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
    const oldCart = cartState.cartData
    const oldLineItems = oldCart?.lineItems ?? []

    if (oldLineItems.length === 0 || !isCartHoldExpired(cartState)) {
      return { status: 'active', priceChanged: false }
    }

    setIsRecreating(true)

    try {
      const bookingState = qc.getQueryData<BookingState>(BOOKING_QUERY_KEY)
      const eventItems = oldLineItems.filter(
        (li) => li.type === RocketRezProductType.EVENT
      )
      const topLevelEventItems = eventItems.filter(
        (li) => li.parentLineItemId == null
      )
      const primaryEventItems =
        topLevelEventItems.length > 0 ? topLevelEventItems : eventItems
      const primaryCarItem = primaryEventItems[0] ?? null

      const getSeatTypeIdForLineItem = (
        item: RocketRezLineItem | null
      ): number | null => {
        if (!item) {
          return null
        }
        const key = getCartLineItemReadMetadataKey({ lineItem: item })
        const meta = cartState.metadata.find((m) => m.key === key)
        const props = meta?.properties
        if (
          props &&
          typeof props === 'object' &&
          'seatTypeId' in props &&
          typeof props.seatTypeId === 'number'
        ) {
          return props.seatTypeId
        }
        return item.rateId ?? item.productId ?? null
      }

      // 1. Check DatoCMS manual soldOut override on the selected event
      if (bookingState?.event?.model?.soldOut && primaryEventItems.length > 0) {
        return {
          status: 'sold_out',
          failedLineItem: primaryCarItem,
          seatTypeId: getSeatTypeIdForLineItem(primaryCarItem)
        }
      }

      // 2. Re-check live RocketRez schedule availability for each Event item
      for (const eventItem of primaryEventItems) {
        if (!eventItem.productId || !eventItem.scheduleId) {
          continue
        }
        try {
          const res = await fetch(
            `${ROUTES.API.BOOKING.EVENTS}/${eventItem.productId}`,
            { cache: 'no-store' }
          )
          if (res.ok) {
            const json: unknown = await res.json()
            const parsedEvent = ApiEventsGetEventResponseSchema.safeParse(json)
            const schedules =
              parsedEvent.success && parsedEvent.data.status === 'success'
                ? parsedEvent.data.data?.event.schedules
                : undefined

            if (schedules) {
              const matchedSchedule = schedules
                .flatMap((d) => d.schedules ?? [])
                .find((s) => s.id === eventItem.scheduleId)

              const itemKey = getCartLineItemReadMetadataKey({
                lineItem: eventItem
              })
              const itemMeta = cartState.metadata.find((m) => m.key === itemKey)
              const isMulticar = Boolean(itemMeta?.isMulticar)
              const rateId = eventItem.rateId ?? 0

              if (
                !matchedSchedule ||
                matchedSchedule.scheduleStatus !==
                  RocketRezScheduleStatus.AVAILABLE
              ) {
                return {
                  status: 'sold_out',
                  failedLineItem: eventItem,
                  seatTypeId: getSeatTypeIdForLineItem(eventItem)
                }
              }

              const requiredRateIds =
                isMulticar && rateId > 0
                  ? getRequiredRateIdsForSupercar(matchedSchedule, rateId, true)
                  : rateId

              if (
                rateId > 0 &&
                isScheduleSoldOut(matchedSchedule, requiredRateIds)
              ) {
                return {
                  status: 'sold_out',
                  failedLineItem: eventItem,
                  seatTypeId: getSeatTypeIdForLineItem(eventItem)
                }
              }

              // Also check sufficient quantity for single-rate drives
              if (!isMulticar && rateId > 0) {
                const matchedSeat = (matchedSchedule.seatTypes ?? []).find(
                  (st) =>
                    st != null && (st.rates ?? []).some((r) => r.id === rateId)
                )
                if (
                  !matchedSeat ||
                  (matchedSeat.available ?? 0) < (eventItem.quantity ?? 1)
                ) {
                  return {
                    status: 'sold_out',
                    failedLineItem: eventItem,
                    seatTypeId: getSeatTypeIdForLineItem(eventItem)
                  }
                }
              }
            }
          }
        } catch (scheduleError) {
          logger.warn(
            { scheduleError },
            `${LOG_NAMESPACE}: hold.recreate — schedule precheck warning`
          )
        }
      }

      // 3. Release old cartKey if still set before creating the new 20-minute hold
      if (cartState.cartKey) {
        await releaseCartHoldInRocketRez(qc)
      }

      let newCartKey: string | null = null
      let newTokenExpiry: string | null = null
      let latestCart: RocketRezCart | null = null

      const postAddItems = async (
        itemsToAdd: Array<{
          id: number
          type: string
          quantity: number
          scheduleId?: number | null
          rateId?: number | null
          rateType?: string | null
        }>,
        cartKeyHeader: string | null
      ) => {
        const headers: HeadersInit = { 'Content-Type': 'application/json' }
        if (cartKeyHeader) {
          headers['x-cart-key'] = cartKeyHeader
        }
        const res = await fetch(ROUTES.API.CART.ADD, {
          method: 'POST',
          headers,
          body: JSON.stringify({ lineItems: itemsToAdd })
        })
        if (!res.ok) {
          throw new Error(`Add to cart failed with status ${res.status}`)
        }
        const json: unknown = await res.json()
        const parsed = ApiCartResponseSchema.safeParse(json)
        if (!parsed.success || parsed.data.status !== 'success') {
          throw new Error('Invalid cart response when recreating hold')
        }
        return parsed.data.data
      }

      // 4. Add primary Event items first to establish the new cart and reservation
      if (primaryEventItems.length > 0) {
        for (const eventItem of primaryEventItems) {
          try {
            const responseData = await postAddItems(
              [
                {
                  id: eventItem.productId,
                  type: eventItem.type,
                  quantity: eventItem.quantity,
                  scheduleId: eventItem.scheduleId ?? null,
                  rateId: eventItem.rateId ?? null,
                  rateType: eventItem.rateType ?? 'Participant'
                }
              ],
              newCartKey
            )
            const keyInfo = CartKeyHelpers.fromApiResponse(responseData)
            if (keyInfo) {
              newCartKey = keyInfo.cartKey
              newTokenExpiry = keyInfo.tokenExpiry
            }
            latestCart = responseData.cart

            const hasEventInNewCart = (latestCart.lineItems ?? []).some(
              (li) =>
                li.type === RocketRezProductType.EVENT &&
                li.productId === eventItem.productId
            )
            if (!hasEventInNewCart) {
              if (newCartKey) {
                void fetch(ROUTES.API.CART.CLEAR, {
                  method: 'DELETE',
                  headers: { 'x-cart-key': newCartKey }
                })
              }
              return {
                status: 'sold_out',
                failedLineItem: eventItem,
                seatTypeId: getSeatTypeIdForLineItem(eventItem)
              }
            }
          } catch (addError) {
            logger.warn(
              { addError, eventItem },
              `${LOG_NAMESPACE}: hold.recreate — event item sold out or unavailable`
            )
            if (newCartKey) {
              void fetch(ROUTES.API.CART.CLEAR, {
                method: 'DELETE',
                headers: { 'x-cart-key': newCartKey }
              })
            }
            return {
              status: 'sold_out',
              failedLineItem: eventItem,
              seatTypeId: getSeatTypeIdForLineItem(eventItem)
            }
          }
        }
      }

      // 5. Re-add non-Event items (insurance, add-ons, media packages, gift cards)
      const nonEventItems = oldLineItems.filter(
        (li) => li.type !== RocketRezProductType.EVENT
      )
      for (const item of nonEventItems) {
        try {
          const responseData = await postAddItems(
            [
              {
                id: item.productId,
                type: item.type,
                quantity: item.quantity,
                ...(item.scheduleId != null && { scheduleId: item.scheduleId }),
                ...(item.rateId != null && { rateId: item.rateId }),
                ...(item.rateType != null && { rateType: item.rateType })
              }
            ],
            newCartKey
          )
          const keyInfo = CartKeyHelpers.fromApiResponse(responseData)
          if (keyInfo) {
            newCartKey = keyInfo.cartKey
            newTokenExpiry = keyInfo.tokenExpiry
          }
          latestCart = responseData.cart
        } catch (nonEventError) {
          logger.warn(
            { nonEventError, item },
            `${LOG_NAMESPACE}: hold.recreate — non-event item add warning`
          )
        }
      }

      // 6. Re-apply coupons if any existed
      if (newCartKey && oldCart?.coupons && oldCart.coupons.length > 0) {
        for (const coupon of oldCart.coupons) {
          const couponCode = coupon.code || coupon.serial
          if (!couponCode) {
            continue
          }
          try {
            const couponRes = await fetch(ROUTES.API.CART.COUPON.ADD, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-cart-key': newCartKey
              },
              body: JSON.stringify({ couponCode })
            })
            if (couponRes.ok) {
              const couponJson: unknown = await couponRes.json()
              const parsedCoupon = ApiCartResponseSchema.safeParse(couponJson)
              if (
                parsedCoupon.success &&
                parsedCoupon.data.status === 'success'
              ) {
                latestCart = parsedCoupon.data.data.cart
              }
            }
          } catch (couponErr) {
            logger.warn(
              { couponErr, couponCode },
              `${LOG_NAMESPACE}: hold.recreate — coupon reapply warning`
            )
          }
        }
      }

      if (!latestCart || !newCartKey) {
        return {
          status: 'sold_out',
          failedLineItem: primaryCarItem,
          seatTypeId: getSeatTypeIdForLineItem(primaryCarItem)
        }
      }

      const updatedMetadata = remapMetadataForNewCart(
        oldLineItems,
        latestCart.lineItems ?? [],
        cartState.metadata
      )

      const oldTotal = oldCart?.total ?? 0
      const newTotal = latestCart.total ?? 0
      const priceChanged = Math.abs(newTotal - oldTotal) >= 0.01

      const nextState: CartState = {
        ...cartState,
        cartKey: newCartKey,
        tokenExpiry: newTokenExpiry,
        cartData: latestCart,
        metadata: updatedMetadata,
        timerStartedAt: new Date().toISOString(),
        holdExpired: false,
        isMutating: false,
        isLoading: false,
        error: null
      }

      qc.setQueryData(CART_QUERY_KEY, nextState)
      cartRepository.write(nextState)

      return {
        status: 'available',
        priceChanged,
        oldTotal,
        newTotal
      }
    } finally {
      setIsRecreating(false)
    }
  }, [qc])

  return { recreateHold, isRecreating }
}
