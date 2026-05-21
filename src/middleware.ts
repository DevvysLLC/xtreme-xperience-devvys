import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const COOKIE_NAME = 'user-guid'
const GUID_EXPIRY_DAYS = 365

const generateGuid = (): string => {
  const guid = crypto.randomUUID()
  const hexString = guid.replace(/-/g, '')
  const buffer = Buffer.from(hexString, 'hex')
  return buffer.toString('base64')
}

const getGuidExpiryDate = (): Date => {
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + GUID_EXPIRY_DAYS)
  return expiryDate
}

export const middleware = (request: NextRequest) => {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  let userGuid = request.cookies.get(COOKIE_NAME)?.value

  if (!userGuid) {
    userGuid = generateGuid()
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-guid', userGuid)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  })

  if (!request.cookies.get(COOKIE_NAME)?.value) {
    const expiryDate = getGuidExpiryDate()
    const isProduction = process.env.NODE_ENV === 'production'

    response.cookies.set(COOKIE_NAME, userGuid, {
      expires: expiryDate,
      path: '/',
      secure: isProduction,
      sameSite: 'strict'
    })
  }

  // Allow Bruno requests with valid auth token
  const middlewareAuthTokenHeader = request.headers.get(
    'x-middleware-auth-token'
  )
  const middlewareAuthToken = process.env.MIDDLEWARE_AUTH_TOKEN
  const apiKey = request.headers.get('x-api-key')
  const allowedApiKey = process.env.API_KEY

  // Check if it's a Bruno request with valid auth token or has valid API key
  if (
    (middlewareAuthToken &&
      middlewareAuthTokenHeader === middlewareAuthToken) ||
    (allowedApiKey && apiKey === allowedApiKey)
  ) {
    return response
  }

  // Get the origin/referer from headers
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host')

  // Extract domain from origin or referer
  let requestDomain: string | null = null
  if (origin) {
    try {
      const originUrl = new URL(origin)
      requestDomain = originUrl.hostname
    } catch {
      // Invalid origin URL, ignore
    }
  } else if (referer) {
    try {
      const refererUrl = new URL(referer)
      requestDomain = refererUrl.hostname
    } catch {
      // Invalid referer URL, ignore
    }
  }

  // Extract hostname from request host
  let requestHostname: string | null = null
  if (host) {
    // Remove port if present
    const hostParts = host.split(':')
    requestHostname = hostParts[0] ?? null
  }

  // Allow requests from the same domain
  if (requestDomain && requestHostname && requestDomain === requestHostname) {
    return response
  }

  // Allow localhost for development (when origin is localhost)
  if (
    requestDomain &&
    (requestDomain === 'localhost' || requestDomain.startsWith('127.0.0.1'))
  ) {
    return response
  }

  // If no origin/referer and host is localhost, allow (for local development)
  if (!requestDomain && requestHostname) {
    if (
      requestHostname === 'localhost' ||
      requestHostname.startsWith('127.0.0.1')
    ) {
      return response
    }
  }

  // Block external domains
  return NextResponse.json(
    {
      status: 'error',
      message: 'Unauthorized'
    },
    { status: 401 }
  )
}

export const config = {
  matcher: '/api/:path*'
}
