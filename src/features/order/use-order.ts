'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import { OrderResponseSchema } from '../../io/schemas'
import type { OrderResponse } from '../../io/types'

const ApiOrderResponseSchema = z.object({
  status: z.literal('success'),
  data: OrderResponseSchema
})

export type UseOrderInput = {
  id: string | number
  enabled?: boolean
}

export const useOrder = ({
  id,
  enabled = true
}: UseOrderInput): UseQueryResult<OrderResponse> => {
  return useQuery({
    queryKey: ['order', id],
    enabled: enabled && id != null && id !== '',
    queryFn: async (): Promise<OrderResponse> => {
      try {
        const response = await fetch(`${ROUTES.API.BOOKING.ORDER}/${id}`)

        if (!response.ok) {
          const errorJson = await response.json().catch(() => ({}))
          const errorMessage =
            errorJson && typeof errorJson === 'object' && 'message' in errorJson
              ? String(errorJson.message)
              : `Failed to fetch order: ${response.status} ${response.statusText}`
          throw new Error(errorMessage)
        }

        const json: unknown = await response.json()
        const parseResult = ApiOrderResponseSchema.safeParse(json)

        if (!parseResult.success) {
          logger.error({ error: parseResult.error }, 'Invalid order response')
          throw new Error('Invalid response format from order API')
        }

        return parseResult.data.data
      } catch (error) {
        logger.error({ error, id }, 'Error fetching order')
        throw error instanceof Error ? error : new Error('Unknown error')
      }
    }
  })
}

export type UseOrderReturn = ReturnType<typeof useOrder>
