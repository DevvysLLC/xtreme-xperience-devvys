'use client'

import Script from 'next/script'
import { IdleScriptLoader } from '../idle-script-loader'

/**
 * Google Tag Manager (GTM) script.
 * Loads the custom GTM container from set.thextremexperience.com.
 * Only runs in production to avoid polluting analytics in dev/preview.
 * gtmId can be supplied from Dato (e.g. site.globalSeo.gtmId) to override defaults.
 */
const GTM_SCRIPT_URL = 'https://set.thextremexperience.com/820qhfbfarzi.js'

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

export type GoogleTagManagerProps = {
  /** GTM container id or script params, e.g. from Dato site settings */
  gtmId: string
}

export const GoogleTagManager = ({ gtmId }: GoogleTagManagerProps) => {
  if (!isProduction) {
    return null
  }

  return (
    <IdleScriptLoader>
      <Script
        id="gtm"
        strategy="lazyOnload"
      >{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src="${GTM_SCRIPT_URL}?"+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}</Script>
    </IdleScriptLoader>
  )
}
