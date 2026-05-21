import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Internal tools',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
}

export default function ToolsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/mvp.css@1.12/mvp.css" />
      {children}
    </>
  )
}
