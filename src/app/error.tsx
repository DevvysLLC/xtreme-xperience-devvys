'use client'

import type { ComponentProps } from 'react'
import { ErrorRetry } from '../components/error-retry'

/**
 * Catches errors in `(frontend)/layout.tsx` itself, such as the global header
 * and footer. Page errors there stop at `(frontend)/error.tsx`, inside the
 * layout. Also the only boundary for every route group outside (frontend),
 * since none of them has its own error.tsx.
 */
export default function ErrorBoundary(props: ComponentProps<typeof ErrorRetry>) {
  return (
    <main className="main-content-container">
      <ErrorRetry {...props} />
    </main>
  )
}
