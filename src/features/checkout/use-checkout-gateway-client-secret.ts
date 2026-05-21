'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import { RocketRezGetPaymentGatewayClientSecretResponseSchema } from '../../io/schemas'
import type { CartState } from '../../io/types'
import { CART_QUERY_KEY, initialCartState } from '../cart'

const ApiPaymentGatewayClientSecretResponseSchema = z.object({
  status: z.enum(['success', 'error']),
  data: RocketRezGetPaymentGatewayClientSecretResponseSchema.and(
    z.object({
      userGuid: z.string(),
      paymentMethodId: z.number()
    })
  ).optional(),
  message: z.string().optional()
})

type ApiPaymentGatewayClientSecretResponse = z.infer<
  typeof ApiPaymentGatewayClientSecretResponseSchema
>

export const useCheckoutGatewayClientSecret = () => {
  const qc = useQueryClient()

  return useMutation<ApiPaymentGatewayClientSecretResponse, Error, undefined>({
    mutationFn: async () => {
      const cartState =
        qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
      const cartKey = cartState.cartKey

      if (!cartKey) {
        logger.error(
          'ClientSecret: No cart key in store, cannot fetch client secret'
        )
        throw new Error('Cart key is required')
      }

      const url = ROUTES.API.CART.PAYMENT

      logger.info(
        {
          url,
          cartKeyPreview: `${cartKey.slice(0, 10)}...`
        },
        'ClientSecret: Fetching payment gateway client secret'
      )

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-cart-key': cartKey
        }
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        logger.error(
          {
            status: response.status,
            statusText: response.statusText,
            errorBody
          },
          'ClientSecret: API returned non-OK response'
        )
        throw new Error(
          `Failed to get payment gateway client secret: ${response.statusText}`
        )
      }

      const jsonData: unknown = await response.json()

      logger.info(
        { responseBody: jsonData },
        'ClientSecret: Raw API response (secret redacted)'
      )

      const parseResult =
        ApiPaymentGatewayClientSecretResponseSchema.safeParse(jsonData)
      if (!parseResult.success) {
        logger.error(
          { validationError: parseResult.error },
          'ClientSecret: Response failed Zod validation'
        )
        throw new Error('Invalid response format')
      }
      const data = parseResult.data

      logger.info(
        {
          status: data.status,
          hasClientSecret: !!data.data?.result?.data?.clientSecret,
          hasUserGuid: !!data.data?.userGuid,
          paymentMethodId: data.data?.paymentMethodId ?? null,
          resultStatusCode: data.data?.result?.statusCode ?? null,
          resultErrorMessage: data.data?.result?.errorMessage ?? null
        },
        'ClientSecret: Parsed successfully'
      )

      return data
    },
    onError: (error) => {
      logger.error({ error }, 'useCheckoutGatewayClientSecret.onError')
    }
  })
}

export type UseCheckoutGatewayClientSecretReturn = ReturnType<
  typeof useCheckoutGatewayClientSecret
>
