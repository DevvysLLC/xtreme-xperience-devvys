'use client'

import { useRouter } from 'next/navigation'
import { startTransition, useEffect } from 'react'
import styles from '../error-not-found/style.module.scss'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Returns a "Try again" handler for an error boundary: it refetches the page from the server,
 * then re-renders the boundary. reset() alone would re-render the same failed server payload.
 */
export const useRefetchRetry = (reset: () => void) => {
  const router = useRouter()
  return () =>
    startTransition(() => {
      router.refresh()
      reset()
    })
}

/** Friendly, retryable error message for the app's error boundaries. */
export const ErrorRetry = ({ error, reset }: Props) => {
  const retry = useRefetchRetry(reset)
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.subtitle}>
          This page couldn&apos;t load right now. Please try again in a moment.
        </p>
        <div className={styles.ctas}>
          <button type="button" onClick={retry}>
            Try again
          </button>
          <a href="/">Go to the homepage</a>
        </div>
      </div>
    </section>
  )
}
