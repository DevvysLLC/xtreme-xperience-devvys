import { z } from 'zod'
import type {
  MergedSearchDocument,
  SearchResults
} from '../../../../components/global-search/io'
import type { Logger } from '../../../../core/logger'
import type { TypesenseClient } from '../../client/typesense-client'

const TypesenseSearchResultSchema = z.object({
  hits: z.array(
    z.object({
      document: z.unknown(),
      highlights: z
        .array(
          z.object({
            field: z.string(),
            snippet: z.string()
          })
        )
        .optional()
    })
  ),
  found: z.number(),
  page: z.number(),
  search_time_ms: z.number()
})

type CollectionResult = {
  hits: unknown[]
  found: number
  type: 'supercar' | 'track' | 'page'
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const hasId = (
  value: unknown
): value is { id: string } & Record<string, unknown> => {
  return isRecord(value) && 'id' in value && typeof value.id === 'string'
}

export class SearchService {
  constructor(
    private readonly client: TypesenseClient,
    private readonly logger: Logger
  ) {}

  async searchAll(query: string): Promise<SearchResults> {
    this.logger.info({ query }, 'Searching all collections')

    const [supercarsResult, tracksResult, pagesResult] = await Promise.all([
      this.client
        .search('supercars', TypesenseSearchResultSchema, {
          q: query.trim(),
          query_by: 'searchText',
          per_page: 250
        })
        .catch((error) => {
          this.logger.warn(
            { error, collection: 'supercars' },
            'Search failed for supercars'
          )
          return TypesenseSearchResultSchema.parse({
            hits: [],
            found: 0,
            page: 1,
            search_time_ms: 0
          })
        }),
      this.client
        .search('tracks', TypesenseSearchResultSchema, {
          q: query.trim(),
          query_by: 'searchText',
          per_page: 250
        })
        .catch((error) => {
          this.logger.warn(
            { error, collection: 'tracks' },
            'Search failed for tracks'
          )
          return TypesenseSearchResultSchema.parse({
            hits: [],
            found: 0,
            page: 1,
            search_time_ms: 0
          })
        }),
      this.client
        .search('pages', TypesenseSearchResultSchema, {
          q: query.trim(),
          query_by: 'searchText',
          per_page: 250
        })
        .catch((error) => {
          this.logger.warn(
            { error, collection: 'pages' },
            'Search failed for pages'
          )
          return TypesenseSearchResultSchema.parse({
            hits: [],
            found: 0,
            page: 1,
            search_time_ms: 0
          })
        })
    ])

    const collections: CollectionResult[] = [
      {
        hits: supercarsResult.hits.map((hit) => hit.document),
        found: supercarsResult.found,
        type: 'supercar' as const
      },
      {
        hits: tracksResult.hits.map((hit) => hit.document),
        found: tracksResult.found,
        type: 'track' as const
      },
      {
        hits: pagesResult.hits.map((hit) => hit.document),
        found: pagesResult.found,
        type: 'page' as const
      }
    ].filter((collection) => collection.found > 0)

    const totalFound =
      supercarsResult.found + tracksResult.found + pagesResult.found
    const mergedHits: MergedSearchDocument[] = []

    if (collections.length > 0 && totalFound > 0) {
      const indices = new Array(collections.length).fill(0)
      const maxHits = Math.max(...collections.map((c) => c.hits.length))

      for (let position = 0; position < maxHits; position++) {
        for (let i = 0; i < collections.length; i++) {
          const collection = collections[i]
          if (!collection) {
            continue
          }

          const currentIndex = indices[i]
          if (currentIndex < collection.hits.length) {
            const hit = collection.hits[currentIndex]
            if (!hit) {
              continue
            }

            const weight = collection.found / totalFound
            const stepSize = Math.max(1, Math.round(1 / weight))

            if (position % stepSize === 0 || mergedHits.length === 0) {
              if (hasId(hit) && isRecord(hit)) {
                const hitData = isRecord(hit.data) ? hit.data : {}
                const searchText =
                  typeof hit.searchText === 'string'
                    ? hit.searchText
                    : undefined
                mergedHits.push({
                  id: hit.id,
                  data: hitData,
                  ...(searchText && { searchText }),
                  type: collection.type
                })
                indices[i]++
              }
            }
          }
        }
      }

      for (let i = 0; i < collections.length; i++) {
        const collection = collections[i]
        if (!collection) {
          continue
        }

        const startIndex = indices[i]
        for (let j = startIndex; j < collection.hits.length; j++) {
          const hit = collection.hits[j]
          if (!hit) {
            continue
          }

          if (hasId(hit) && isRecord(hit)) {
            const hitData = isRecord(hit.data) ? hit.data : {}
            const searchText =
              typeof hit.searchText === 'string' ? hit.searchText : undefined
            mergedHits.push({
              id: hit.id,
              data: hitData,
              ...(searchText && { searchText }),
              type: collection.type
            })
          }
        }
      }
    }

    return {
      hits: mergedHits,
      total_found: totalFound,
      search_time_ms:
        supercarsResult.search_time_ms +
        tracksResult.search_time_ms +
        pagesResult.search_time_ms
    }
  }
}
