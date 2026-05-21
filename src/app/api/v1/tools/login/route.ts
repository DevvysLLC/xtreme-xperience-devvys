import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const isLoginBody = (body: unknown): body is { password: string } => {
  if (typeof body !== 'object' || body === null) {
    return false
  }
  if (!('password' in body)) {
    return false
  }
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const password = (body as { password: unknown }).password
  return typeof password === 'string'
}

export const POST = async (request: Request) => {
  try {
    const body: unknown = await request.json()

    if (!isLoginBody(body)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Password is required'
        },
        { status: 400 }
      )
    }

    const { password } = body

    if (!password) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Password is required'
        },
        { status: 400 }
      )
    }

    const toolsPassword = process.env.ADMIN_TOOLS_PASSWORD

    if (!toolsPassword) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Admin tools password not configured'
        },
        { status: 500 }
      )
    }

    if (password !== toolsPassword) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid password'
        },
        { status: 401 }
      )
    }

    const cookieStore = await cookies()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)

    cookieStore.set('tools_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt
    })

    return NextResponse.json(
      {
        status: 'success',
        message: 'Login successful'
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
