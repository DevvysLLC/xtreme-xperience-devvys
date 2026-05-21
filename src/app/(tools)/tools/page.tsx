import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isToolsAuthenticated } from '../../../utils/tools-auth'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
}

export default async function ToolsPage() {
  if (!(await isToolsAuthenticated())) {
    redirect('/tools/login')
  }

  redirect('/tools/search')
}
