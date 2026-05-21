import type { Metadata } from 'next'
import { generateSeoMetadata } from '../../components/global-seo'
import { LegacyLayoutClient } from './legacy-layout-client'

// Disable caching for all legacy routes
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export const generateMetadata = async (): Promise<Metadata> => {
  return generateSeoMetadata()
}

export default function LegacyLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <LegacyLayoutClient>{children}</LegacyLayoutClient>
}
