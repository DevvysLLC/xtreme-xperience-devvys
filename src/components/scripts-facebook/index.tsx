'use client'

import Script from 'next/script'
import { IdleScriptLoader } from '../idle-script-loader'

/**
 * Facebook Pixel script.
 * Loads the Facebook Pixel for conversion tracking and analytics.
 * Only runs in production to avoid polluting analytics in dev/preview.
 */
const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

export const FacebookPixel = () => {
  if (!isProduction) {
    return null
  }

  const pixelId = '456397837827977'
  const scriptContent = `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init','${pixelId}');fbq('track','PageView');
  `

  return (
    <IdleScriptLoader>
      <>
        <Script id="facebook-pixel" strategy="lazyOnload">
          {scriptContent}
        </Script>
        <noscript>
          <img
            height={1}
            width={1}
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </>
    </IdleScriptLoader>
  )
}
