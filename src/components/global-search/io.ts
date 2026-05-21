import { z } from 'zod'

export const SearchDocumentSchema = z.object({
  id: z.string(),
  data: z.record(z.string(), z.unknown()),
  searchText: z.string().optional()
})

export const MergedSearchDocumentSchema = SearchDocumentSchema.extend({
  type: z.enum(['supercar', 'track', 'page'])
})

export const SearchCollectionResultSchema = z.object({
  hits: z.array(SearchDocumentSchema),
  found: z.number(),
  search_time_ms: z.number()
})

export const SearchResultsSchema = z.object({
  hits: z.array(MergedSearchDocumentSchema),
  total_found: z.number(),
  search_time_ms: z.number()
})

export const SearchApiResponseSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('success'),
    data: SearchResultsSchema
  }),
  z.object({
    status: z.literal('error'),
    message: z.string()
  })
])

export type SearchDocument = z.infer<typeof SearchDocumentSchema>
export type MergedSearchDocument = z.infer<typeof MergedSearchDocumentSchema>
export type SearchCollectionResult = z.infer<
  typeof SearchCollectionResultSchema
>
export type SearchResults = z.infer<typeof SearchResultsSchema>
export type SearchApiResponse = z.infer<typeof SearchApiResponseSchema>

export const isSuccessResponse = (
  response: SearchApiResponse
): response is Extract<SearchApiResponse, { status: 'success' }> => {
  return response.status === 'success'
}
