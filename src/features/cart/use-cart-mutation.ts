'use client'

import {
  type UseMutationResult,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import type { z } from 'zod'
import { logger } from '../../core/logger/logger'
import type { ApiCartResponse } from '../../io'
import {
  ApiCartResponseSchema,
  type MiddlewareCartResponseSchema
} from '../../io'
import type { CartState } from '../../io/types'
import { CartKeyHelpers } from '../../utils/cart-key'
import { CART_ERRORS, LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY, CART_REFRESH_QUERY_KEY } from './keys'
import { cartRepository, initialCartState } from './repository'

type UseCartMutationOptions<TInput> = {
  endpoint: string | ((input: TInput) => string)
  method: 'POST' | 'PATCH' | 'DELETE'
  requireCartKey?: boolean
  includeBody?: boolean
  getBody?: (input: TInput) => unknown
  skipSetCartData?: boolean
  onSuccessExtra?: (
    data: z.infer<typeof MiddlewareCartResponseSchema>,
    input: TInput
  ) => void
  onError?: (error: Error, input: TInput) => void
}

export const useCartMutation = <TInput>(
  options: UseCartMutationOptions<TInput>
): UseMutationResult<ApiCartResponse, Error, TInput> => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: TInput): Promise<ApiCartResponse> => {
      const isRefreshing =
        qc.isFetching({ queryKey: CART_REFRESH_QUERY_KEY }) > 0
      const cartState =
        qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState

      if (isRefreshing || cartState.isMutating) {
        logger.info(
          { isRefreshing, isMutating: cartState.isMutating, input },
          `${LOG_NAMESPACE}: mutation.blocked — operation in progress`
        )
        return Promise.reject(new Error(CART_ERRORS.OPERATION_IN_PROGRESS))
      }

      if (options.requireCartKey && !cartState.cartKey) {
        return Promise.reject(new Error(CART_ERRORS.NO_CART_KEY))
      }

      qc.setQueryData<CartState>(CART_QUERY_KEY, {
        ...cartState,
        isMutating: true,
        isLoading: true
      })

      const existingCartKey = cartState.cartKey ?? null

      const endpoint =
        typeof options.endpoint === 'function'
          ? options.endpoint(input)
          : options.endpoint

      const headers: HeadersInit = {}

      if (options.includeBody) {
        headers['Content-Type'] = 'application/json'
      }

      if (existingCartKey) {
        headers['x-cart-key'] = existingCartKey
      }

      const fetchOptions: RequestInit = {
        method: options.method,
        headers
      }

      if (options.includeBody && options.method !== 'DELETE') {
        const body = options.getBody ? options.getBody(input) : input
        fetchOptions.body = JSON.stringify(body)
      }

      const performRequest = async (cartKeyOverride: string | null) => {
        const requestHeaders: HeadersInit = { ...headers }

        if (cartKeyOverride) {
          requestHeaders['x-cart-key'] = cartKeyOverride
        } else {
          delete requestHeaders['x-cart-key']
        }

        const requestOptions: RequestInit = {
          ...fetchOptions,
          headers: requestHeaders
        }

        return fetch(endpoint, requestOptions)
      }

      let res: Response
      try {
        res = await performRequest(existingCartKey)

        if (
          existingCartKey &&
          !options.requireCartKey &&
          (res.status === 401 || res.status === 404)
        ) {
          logger.info(
            { status: res.status, endpoint },
            `${LOG_NAMESPACE}: mutation.retry-without-cart-key`
          )
          res = await performRequest(null)
        }
      } catch (fetchError) {
        const errorMessage =
          fetchError instanceof Error
            ? `Failed to ${options.method} cart: ${fetchError.message}`
            : `Failed to ${options.method} cart: Network error`
        const error = new Error(errorMessage)
        logger.error(
          { error, fetchError, input, endpoint },
          `${LOG_NAMESPACE}: mutation.fetch-error`
        )
        throw error
      }

      if (!res.ok) {
        let errorMessage = `Failed to ${options.method} cart`
        try {
          const errorJson = await res.json().catch(() => null)
          if (
            errorJson &&
            typeof errorJson === 'object' &&
            'message' in errorJson &&
            typeof errorJson.message === 'string'
          ) {
            errorMessage = errorJson.message
          } else {
            errorMessage = `Failed to ${options.method} cart: ${res.status} ${res.statusText}`
          }
        } catch {
          errorMessage = `Failed to ${options.method} cart: ${res.status} ${res.statusText}`
        }
        const error = new Error(errorMessage)
        logger.error(
          { error, status: res.status, statusText: res.statusText, input },
          `${LOG_NAMESPACE}: mutation.fetch-error`
        )
        throw error
      }

      const json: unknown = await res.json()
      const parseResult = ApiCartResponseSchema.safeParse(json)

      if (!parseResult.success) {
        throw new Error(CART_ERRORS.INVALID_RESPONSE)
      }

      if (parseResult.data.status !== 'success') {
        throw new Error(
          parseResult.data.message ?? `Failed to ${options.method} cart`
        )
      }

      return parseResult.data
    },
    onMutate: (input) => {
      logger.info({ input }, `${LOG_NAMESPACE}: mutation.onMutate`)
    },
    onSuccess: (response, input) => {
      if (response.status !== 'success') {
        return
      }

      const base =
        qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
      let next: CartState = {
        ...base,
        isMutating: false,
        isLoading: false,
        error: null
      }

      const result = CartKeyHelpers.fromApiResponse(response.data)
      if (result) {
        next = {
          ...next,
          cartKey: result.cartKey,
          tokenExpiry: result.tokenExpiry
        }
      }

      if (!options.skipSetCartData) {
        const hadItems = (base.cartData?.lineItems?.length ?? 0) > 0
        const hasItems = (response.data.cart.lineItems?.length ?? 0) > 0

        if (!hadItems && hasItems && !next.timerStartedAt) {
          next = { ...next, timerStartedAt: new Date().toISOString() }
        }

        next = { ...next, cartData: response.data.cart }
      }

      qc.setQueryData(CART_QUERY_KEY, next)
      cartRepository.write(next)

      logger.info(
        {
          hasCartKey: !!next.cartKey,
          itemCount: next.cartData?.lineItems?.length ?? 0
        },
        `${LOG_NAMESPACE}: mutation.onSuccess`
      )

      if (options.onSuccessExtra) {
        options.onSuccessExtra(response.data, input)
      }
    },
    onError: (error, input) => {
      if (
        error instanceof Error &&
        (error.message === CART_ERRORS.OPERATION_IN_PROGRESS ||
          error.message === CART_ERRORS.NO_CART_KEY)
      ) {
        return
      }

      const current =
        qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
      qc.setQueryData<CartState>(CART_QUERY_KEY, {
        ...current,
        isMutating: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      logger.error({ error, input }, `${LOG_NAMESPACE}: mutation.onError`)

      if (options.onError) {
        options.onError(
          error instanceof Error ? error : new Error('Unknown error'),
          input
        )
      }
    }
  })
}
