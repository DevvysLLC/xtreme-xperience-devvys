'use client'

import { useQuery } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import type { ApiFormGetFormByHandleData } from '../../io'
import { ApiFormGetFormByHandleResponseSchema } from '../../io'
import { getFormQueryKey } from './config'

export const useForm = (handle: string | null) => {
  return useQuery<ApiFormGetFormByHandleData>({
    queryKey: getFormQueryKey(handle ?? ''),
    enabled: !!handle,
    queryFn: async (): Promise<ApiFormGetFormByHandleData> => {
      if (!handle) {
        throw new Error('Form handle is required')
      }

      const response = await fetch(ROUTES.API.FRONTEND.FORM_BY_HANDLE(handle))

      if (!response.ok) {
        throw new Error('Failed to fetch form')
      }

      const json: unknown = await response.json()
      const parseResult = ApiFormGetFormByHandleResponseSchema.safeParse(json)

      if (!parseResult.success) {
        throw new Error('Invalid response format')
      }

      if (parseResult.data.status !== 'success') {
        throw new Error(parseResult.data.message ?? 'Failed to fetch form')
      }

      return parseResult.data.data
    }
  })
}
