import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export const GET = async (): Promise<NextResponse> => {
  const baseUrl = process.env.TYPESENSE_BASE_URL

  if (!baseUrl) {
    return NextResponse.json(
      {
        status: 'error',
        error: 'TYPESENSE_BASE_URL environment variable is not defined'
      },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(`${baseUrl}/health`, { method: 'GET' })
    const contentType = response.headers.get('content-type') || ''
    const body = contentType.includes('application/json')
      ? await response.json()
      : await response.text()

    return NextResponse.json(
      {
        status: response.ok ? 'ok' : 'error',
        typesense: body
      },
      { status: response.ok ? 200 : 503 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}
