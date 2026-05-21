'use client'

import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { ROUTES } from '../../../config/routes'
import {
  isSuccessResponse,
  SearchApiResponseSchema,
  type SearchResults,
  SearchResultsSchema
} from '../io'

const SEARCH_QUERY_KEY = ['frontend', 'search'] as const

export const useSearch = (query: string | null) => {
  const t = useTranslations('search.hooks')

  return useQuery<SearchResults>({
    queryKey: [...SEARCH_QUERY_KEY, query],
    queryFn: async (): Promise<SearchResults> => {
      if (!query || query.trim().length === 0) {
        return {
          hits: [],
          total_found: 0,
          search_time_ms: 0
        }
      }

      const url = new URL(ROUTES.API.FRONTEND.SEARCH, window.location.origin)
      url.searchParams.set('q', query.trim())

      const response = await fetch(url.toString())
      const jsonData = await response.json()
      const parseResult = SearchApiResponseSchema.safeParse(jsonData)

      if (!parseResult.success) {
        throw new Error(t('error.invalid_response'))
      }

      const apiResponse = parseResult.data

      if (!response.ok || !isSuccessResponse(apiResponse)) {
        throw new Error(
          apiResponse.status === 'error'
            ? apiResponse.message
            : t('error.search_failed')
        )
      }

      const dataParseResult = SearchResultsSchema.safeParse(apiResponse.data)
      if (!dataParseResult.success) {
        throw new Error(t('error.invalid_data'))
      }

      return dataParseResult.data
    },
    enabled: query !== null && query.trim().length > 0
  })
}
