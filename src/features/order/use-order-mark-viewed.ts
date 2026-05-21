'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import { OrderResponseSchema } from '../../io/schemas'
import type { OrderResponse } from '../../io/types'

const ApiOrderResponseSchema = z.object({
  status: z.literal('success'),
  data: OrderResponseSchema
})

export const useOrderMarkViewed = (
  orderId: string
): UseMutationResult<OrderResponse, Error, undefined> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<OrderResponse> => {
      const response = await fetch(`${ROUTES.API.BOOKING.ORDER}/${orderId}`, {
        method: 'PATCH'
      })

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}))
        const errorMessage =
          errorJson && typeof errorJson === 'object' && 'message' in errorJson
            ? String(errorJson.message)
            : `Failed to mark order viewed: ${response.status} ${response.statusText}`
        throw new Error(errorMessage)
      }

      const json: unknown = await response.json()
      const parseResult = ApiOrderResponseSchema.safeParse(json)

      if (!parseResult.success) {
        logger.error(
          { error: parseResult.error },
          'useOrderMarkViewed: Invalid response'
        )
        throw new Error('Invalid response format from order API')
      }

      return parseResult.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
    },
    onError: (error) => {
      logger.error({ error, orderId }, 'useOrderMarkViewed.onError')
    }
  })
}
