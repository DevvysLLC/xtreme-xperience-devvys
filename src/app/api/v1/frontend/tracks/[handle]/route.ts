import { NextResponse } from 'next/server'
import { initDatoSdk } from '../../../../../../core/dato/sdk'
import { initLogger } from '../../../../../../core/logger/index'

const logger = initLogger().child({ name: 'dato-track-by-handle-api' })

export const runtime = 'nodejs'

export const GET = async (
  _request: Request,
  context: { params: Promise<{ handle: string }> }
): Promise<NextResponse> => {
  try {
    const { handle } = await context.params
    const sdk = initDatoSdk()
    const data = await sdk.getAllTracksData()
    const track = data.allTracks.find((t) => t.config?.handle === handle)

    if (!track) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Track not found'
        },
        {
          status: 404
        }
      )
    }

    return NextResponse.json(
      {
        status: 'success',
        data: { track }
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600'
        }
      }
    )
  } catch (error) {
    logger.error(error, 'Internal error processing dato track request')
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
