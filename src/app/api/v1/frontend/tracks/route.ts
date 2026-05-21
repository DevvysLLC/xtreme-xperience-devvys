import { NextResponse } from 'next/server'
import { initDatoSdk } from '../../../../../core/dato/sdk'
import { initLogger } from '../../../../../core/logger/index'

const logger = initLogger().child({ name: 'dato-tracks-api' })

export const runtime = 'nodejs'

export const GET = async (): Promise<NextResponse> => {
  try {
    const sdk = initDatoSdk()
    const data = await sdk.getAllTracksData()

    return NextResponse.json(
      {
        status: 'success',
        data: data
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600'
        }
      }
    )
  } catch (error) {
    logger.error(error, 'Internal error processing dato tracks request')
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
