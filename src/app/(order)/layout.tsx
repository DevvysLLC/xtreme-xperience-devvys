import type { Metadata } from 'next'
import { generateSeoMetadata } from '../../components/global-seo'
import { OrderLayoutClient } from './order-layout-client'

// Disable caching for all order routes
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export const generateMetadata = async (): Promise<Metadata> => {
  return generateSeoMetadata()
}

export default function OrderLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <OrderLayoutClient>{children}</OrderLayoutClient>
}
