import type { Metadata } from 'next'
import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { GlobalConfigProvider } from '../components/global-config/context'
import { DialogProvider, GlobalDialog } from '../components/global-dialog'
import {
  FormDialogProvider,
  GlobalFormDialog
} from '../components/global-form-dialog'
import { generateSeoMetadata } from '../components/global-seo'
import { FacebookPixel } from '../components/scripts-facebook'
import { ScriptsGoogleAnalytics } from '../components/scripts-google-analytics'
import { GoogleTagManager } from '../components/scripts-google-tag-manager'
import { SendlaneBeacon } from '../components/scripts-sendlane'
import { initDatoSdk } from '../core/dato/sdk'
import { NavigationTracker } from '../features/analytics'
import { CartProvider } from '../features/cart'
import { fontVariables } from '../fonts'
import { QueryClientProviderWrapper } from '../providers/query-client-provider'
import '../styles/main.scss'

export const revalidate = 60

export const generateMetadata = async (): Promise<Metadata> => {
  const seoMetadata = await generateSeoMetadata()
  return {
    ...seoMetadata,
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_ID
    }
  }
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()
  const sdk = initDatoSdk()
  const { globalConfig } = await sdk.getGlobalConfig()
  const gtmId = globalConfig?.googleGtmId ?? null
  const enableGtm = globalConfig?.googleEnableGtm ?? null
  const enableEventTracking = globalConfig?.googleEnableEventTracking ?? null
  const enableAnalytics = globalConfig?.googleEnableAnalytics ?? null
  const enableFacebookPixel = globalConfig?.enableFacebookPixel ?? null
  const bookingEnableLegacyBooking =
    globalConfig && 'bookingEnableLegacyBooking' in globalConfig
      ? Boolean(globalConfig.bookingEnableLegacyBooking)
      : false

  return (
    <html lang={locale} className={fontVariables}>
      <head>
        <link rel="dns-prefetch" href="//image.mux.com" />
        <link rel="dns-prefetch" href="//stream.mux.com" />
        <link rel="preconnect" href="//image.mux.com" crossOrigin="" />
      </head>
      <body>
        <QueryClientProviderWrapper>
          <CartProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <GlobalConfigProvider
                bookingEnableLegacyBooking={bookingEnableLegacyBooking}
              >
                <DialogProvider>
                  <FormDialogProvider>
                    {children}
                    <GlobalDialog />
                    <GlobalFormDialog />
                  </FormDialogProvider>
                </DialogProvider>
              </GlobalConfigProvider>
            </NextIntlClientProvider>
          </CartProvider>
        </QueryClientProviderWrapper>
        {enableGtm && gtmId && <GoogleTagManager gtmId={gtmId} />}
        {enableGtm && <NavigationTracker />}
        {enableFacebookPixel && <FacebookPixel />}
        {enableAnalytics && enableEventTracking && (
          <ScriptsGoogleAnalytics enabled={true} />
        )}
        <SendlaneBeacon eventId="n3aU5n3fkeNcY" />
        {process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID && (
          <Script
            id="klaviyo-onsite"
            strategy="afterInteractive"
            src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID}`}
          />
        )}
      </body>
    </html>
  )
}
