import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const store = await cookies()
  const currentLocale = store.get('locale')?.value || 'en'

  return {
    locale: currentLocale,
    messages: (await import(`../locales/${currentLocale}.json`)).default,
    interpolation: {
      escapeValue: true
    }
  }
})
