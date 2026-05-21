import type { Metadata } from 'next'
import { generateSeoMetadata } from '../../components/global-seo'
import { BookingLayoutClient } from './booking-layout-client'

// Disable caching for all booking routes
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export const generateMetadata = async (): Promise<Metadata> => {
  return generateSeoMetadata()
}

export default function BookingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <BookingLayoutClient>{children}</BookingLayoutClient>
}
