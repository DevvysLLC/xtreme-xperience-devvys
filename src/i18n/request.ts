import { getRequestConfig } from 'next-intl/server'
import messages from '../locales/en.json'

// The site ships a single locale. Reading it from a cookie (via `cookies()`)
// opted every route into dynamic rendering and disabled page caching.
export default getRequestConfig(async () => ({
  locale: 'en',
  messages,
  interpolation: {
    escapeValue: true
  }
}))
