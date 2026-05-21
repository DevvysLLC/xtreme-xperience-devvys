import { NextResponse } from 'next/server'
import { z } from 'zod'
import { initLogger } from '../../../../../core/logger/index'
import { getMiddlewareClient } from '../../../../../server/middleware/index'
import { isToolsAuthenticated } from '../../../../../utils/tools-auth'

const logger = initLogger().child({ name: 'tools-search-api' })

export const runtime = 'nodejs'

const SearchProductsRequestSchema = z.object({
  searchTerm: z.string().min(1, 'Search term is required'),
  type: z.enum(['events', 'retail', 'giftcard'], {
    message: 'Type must be "events", "retail", or "giftcard"'
  })
})

export const POST = async (request: Request) => {
  try {
    if (!(await isToolsAuthenticated())) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Unauthorized'
        },
        { status: 401 }
      )
    }

    const body: unknown = await request.json()

    const parsed = SearchProductsRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Search term and type are required',
          errors: parsed.error.issues
        },
        { status: 400 }
      )
    }

    const client = await getMiddlewareClient()
    const toolsService = await client.getToolsService()
    const { items } = await toolsService.searchProducts(parsed.data)

    if (items.length === 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'No results found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        status: 'success',
        data: items
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error(error, 'Internal error processing tools search request')
    return NextResponse.json(
      {
        status: 'error',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
