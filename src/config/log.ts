export const ALLOWED_DOMAINS = [
  'localhost',
  '.localhost',
  '.vercel.app'
] as const

export const isAllowedLoggingDomain = (hostname: string): boolean => {
  if (hostname.length === 0) {
    return false
  }

  if (hostname === '127.0.0.1' || hostname === '::1') {
    return true
  }

  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    return true
  }

  return hostname.endsWith('.vercel.app')
}
