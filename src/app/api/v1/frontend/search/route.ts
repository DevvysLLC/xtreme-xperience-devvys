import { NextResponse } from 'next/server'
import { initLogger } from '../../../../../core/logger'
import { getTypesenseClient } from '../../../../../server/typesense/client/get-typesense-client'
import { SearchService } from '../../../../../server/typesense/services'

const logger = initLogger().child({ name: 'frontend-search-api' })

export const runtime = 'nodejs'

export const GET = async (request: Request): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    if (!q || q.trim().length === 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Query parameter is required'
        },
        {
          status: 400
        }
      )
    }

    const typesenseClient = getTypesenseClient()
    const searchService = new SearchService(typesenseClient, logger)
    const results = await searchService.searchAll(q.trim())

    return NextResponse.json(
      {
        status: 'success',
        data: results
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
        }
      }
    )
  } catch (error) {
    logger.error(error, 'Internal error processing search request')
    return NextResponse.json(
      {
        status: 'error',
        message: 'Internal server error'
      },
      {
        status: 500
      }
    )
  }
}
