import { NextResponse } from 'next/server'
import { initDatoSdk } from '../../../../../../core/dato/sdk'
import { initLogger } from '../../../../../../core/logger'

const logger = initLogger().child({ name: 'dato-form-by-handle-api' })

export const runtime = 'nodejs'

export const GET = async (
  _request: Request,
  context: { params: Promise<{ handle: string }> }
): Promise<NextResponse> => {
  try {
    const { handle } = await context.params
    const sdk = initDatoSdk()
    const data = await sdk.getFormByHandle({ handle })

    logger.info({ handle, data }, 'Form data fetched from DatoCMS')

    if (!data.form) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Form not found'
        },
        {
          status: 404
        }
      )
    }

    return NextResponse.json(
      {
        status: 'success',
        data: { form: data.form }
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600'
        }
      }
    )
  } catch (error) {
    logger.error(error, 'Internal error processing dato form request')
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
