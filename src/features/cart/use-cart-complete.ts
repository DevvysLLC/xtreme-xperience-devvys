'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import { OrderResponseSchema, RocketRezCartSchema } from '../../io/schemas'
import type {
  CartState,
  LocationState,
  OrderResponse,
  PersistedLocationState,
  RocketRezCart
} from '../../io/types'
import { LOCATION_QUERY_KEY } from '../location/keys'
import { LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY } from './keys'
import { initialCartState } from './repository'

const toPersistedLocationState = (
  location: LocationState | undefined
): PersistedLocationState | null => {
  if (!location) {
    return null
  }

  return {
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy,
    timestamp: location.timestamp,
    label: location.label,
    track: location.track
  }
}

const ApiCartCompleteResponseSchema = z.object({
  status: z.literal('success'),
  data: z.object({
    order: OrderResponseSchema,
    cart: z.object({
      cart: RocketRezCartSchema,
      cartToken: z.string(),
      tokenExpiry: z.string().nullable()
    })
  })
})

export type CartCompleteResponse = {
  order: OrderResponse
  cart: RocketRezCart
}

/**
 * Completes the cart (server-side order creation) without clearing client-side
 * stores.
 *
 * Store cleanup (cart, booking, checkout) is deferred to the complete page via
 * `useCartClearAfterComplete`. Clearing stores here would cause a race
 * condition: the wizard guard watches `cart.contents.totalItems` and would
 * redirect to HOME before `router.push` to the complete page takes effect.
 *
 * @see useCartClearAfterComplete — clears all stores on the complete page
 */
export const useCartComplete = (): UseMutationResult<
  CartCompleteResponse,
  Error,
  undefined
> => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<CartCompleteResponse> => {
      logger.info({}, `${LOG_NAMESPACE}: mutationFn [complete]`)
      const state =
        qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
      const cartKey = state.cartKey

      if (!cartKey) {
        throw new Error('Cart key is required to complete cart')
      }

      const metadata = state.metadata.length > 0 ? state.metadata : null
      const locationState = qc.getQueryData<LocationState>(LOCATION_QUERY_KEY)
      const location = toPersistedLocationState(locationState)

      const response = await fetch(ROUTES.API.CART.COMPLETE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cart-key': cartKey
        },
        body: JSON.stringify({ metadata, location })
      })

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}))
        const errorMessage =
          errorJson && typeof errorJson === 'object' && 'message' in errorJson
            ? String(errorJson.message)
            : `Failed to complete cart: ${response.status} ${response.statusText}`
        throw new Error(errorMessage)
      }

      const json: unknown = await response.json()
      const parseResult = ApiCartCompleteResponseSchema.safeParse(json)

      if (!parseResult.success) {
        logger.error(
          { error: parseResult.error },
          `${LOG_NAMESPACE}: mutation.onError [complete] — invalid response`
        )
        throw new Error('Invalid response format from cart complete API')
      }

      return {
        order: parseResult.data.data.order,
        cart: parseResult.data.data.cart.cart
      }
    },
    onMutate: () => {
      logger.info({}, `${LOG_NAMESPACE}: mutation.onMutate [complete]`)
    },
    onSuccess: (data) => {
      logger.info(
        { orderId: data.order.externalId },
        `${LOG_NAMESPACE}: mutation.onSuccess [complete]`
      )
    },
    onError: (error) => {
      logger.error({ error }, `${LOG_NAMESPACE}: mutation.onError [complete]`)
    }
  })
}
