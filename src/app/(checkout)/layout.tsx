import type { Metadata } from 'next'
import { generateSeoMetadata } from '../../components/global-seo'
import { CheckoutLayoutClient } from './checkout-layout-client'

// Disable caching for all checkout routes
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export const generateMetadata = async (): Promise<Metadata> => {
  return generateSeoMetadata()
}

export default function CheckoutLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <CheckoutLayoutClient>{children}</CheckoutLayoutClient>
}
