'use client'

import type { ComponentProps } from 'react'
import { ErrorRetry } from '../../components/error-retry'

/**
 * Catches page errors inside the `(frontend)` layout, so the header, footer
 * and navigation stay on screen around the error message.
 */
export default function FrontendErrorBoundary(props: ComponentProps<typeof ErrorRetry>) {
  return <ErrorRetry {...props} />
}
