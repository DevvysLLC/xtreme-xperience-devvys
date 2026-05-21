const COOKIE_NAME = 'user-guid'

let cachedGuid: string | null = null
let cacheValid = false

export const setUserGuidCookie = (guid: string, expiryDate: Date): void => {
  if (typeof document === 'undefined') {
    return
  }

  const isProduction = process.env.NODE_ENV === 'production'
  const expires = expiryDate.toUTCString()

  document.cookie = `${COOKIE_NAME}=${guid}; expires=${expires}; path=/; ${
    isProduction ? 'Secure; ' : ''
  }SameSite=Strict`

  cachedGuid = guid
  cacheValid = true
}

export const getUserGuidCookie = (): string | null => {
  if (typeof document === 'undefined') {
    return null
  }

  if (cacheValid && cachedGuid) {
    return cachedGuid
  }

  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === COOKIE_NAME && value) {
      const guid = decodeURIComponent(value)
      cachedGuid = guid
      cacheValid = true
      return guid
    }
  }

  cachedGuid = null
  cacheValid = true
  return null
}

export const clearUserGuidCache = (): void => {
  cachedGuid = null
  cacheValid = false
}

export const deleteUserGuidCookie = (): void => {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`
  clearUserGuidCache()
}
