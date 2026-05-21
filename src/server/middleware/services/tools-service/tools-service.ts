import { and, eq, ilike } from 'drizzle-orm'
import { logger } from '../../../../core/logger/logger'
import {
  rocketRezProductsEvents,
  rocketRezProductsRetail
} from '../../../../db/schema'
import { RocketRezProductType } from '../../../../io/schemas'
import { getDb } from '../../../db/get-db'

const escapeLike = (value: string): string => {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll('%', '\\%')
    .replaceAll('_', '\\_')
}

export type SearchProductsRequest = {
  searchTerm: string
  type: 'events' | 'retail' | 'giftcard'
}

export type SearchProductsResponse = {
  items: unknown[]
}

export class ToolsService {
  async searchProducts(
    request: SearchProductsRequest
  ): Promise<SearchProductsResponse> {
    logger.info('tools-service.searchProducts', { request })

    const db = getDb()
    const escapedSearchTerm = escapeLike(request.searchTerm)

    let results

    if (request.type === 'events') {
      results = await db
        .select()
        .from(rocketRezProductsEvents)
        .where(ilike(rocketRezProductsEvents.name, `%${escapedSearchTerm}%`))
        .limit(100)
    } else if (request.type === 'giftcard') {
      results = await db
        .select()
        .from(rocketRezProductsRetail)
        .where(
          and(
            eq(rocketRezProductsRetail.type, RocketRezProductType.GIFTCARD),
            ilike(rocketRezProductsRetail.name, `%${escapedSearchTerm}%`)
          )
        )
        .limit(100)
    } else {
      results = await db
        .select()
        .from(rocketRezProductsRetail)
        .where(
          and(
            eq(rocketRezProductsRetail.type, RocketRezProductType.RETAIL),
            ilike(rocketRezProductsRetail.name, `%${escapedSearchTerm}%`)
          )
        )
        .limit(100)
    }

    return {
      items: results
    }
  }
}
