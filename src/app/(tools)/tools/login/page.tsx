import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ToolsLogin } from '../../../../components/tools-login'
import { isToolsAuthenticated } from '../../../../utils/tools-auth'

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

export default async function ToolsLoginPage() {
  if (await isToolsAuthenticated()) {
    redirect('/tools/search')
  }

  return <ToolsLogin />
}
