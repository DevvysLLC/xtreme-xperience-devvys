'use client'

import Script from 'next/script'
import { IdleScriptLoader } from '../idle-script-loader'

/**
 * Sendlane beacon script.
 * Loads the Sendlane tracking pixel / pusher for email marketing automation.
 * Only runs in production to avoid polluting tracking in dev/preview.
 */
const SENDLANE_PUSHER_URL = 'https://sendlane.com/scripts/pusher.js'

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

export type SendlaneBeaconProps = {
  eventId: string
}

export const SendlaneBeacon = ({ eventId }: SendlaneBeaconProps) => {
  if (!isProduction) {
    return null
  }

  return (
    <IdleScriptLoader>
      <>
        <Script id="sendlane-init" strategy="lazyOnload">
          {`window._Sendlane=window._Sendlane||[];`}
          {`_Sendlane.push({event_id:'${eventId}'});`}
        </Script>
        <Script
          id="sendlane-pusher"
          src={SENDLANE_PUSHER_URL}
          strategy="lazyOnload"
        />
      </>
    </IdleScriptLoader>
  )
}
