'use client'

import { useRefetchRetry } from '../components/error-retry'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

/** Last-resort boundary for errors in the root layout itself. */
export default function GlobalError({ reset }: Props) {
  const retry = useRefetchRetry(reset)
  return (
    <html lang="en">
      <body
        style={{ fontFamily: 'system-ui, sans-serif', padding: '4rem 1.5rem', textAlign: 'center' }}
      >
        <h1>Something went wrong</h1>
        <p>This page couldn&apos;t load right now. Please try again in a moment.</p>
        <button type="button" onClick={retry}>
          Try again
        </button>
      </body>
    </html>
  )
}
