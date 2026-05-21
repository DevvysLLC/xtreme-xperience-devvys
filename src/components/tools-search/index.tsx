'use client'

import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type SearchType = 'events' | 'retail' | 'giftcard'

export const ToolsSearch = () => {
  const t = useTranslations('tools_search')
  const [searchType, setSearchType] = useState<SearchType>('events')
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<unknown[]>([])
  const [error, setError] = useState('')

  const searchMutation = useMutation({
    mutationFn: async (params: {
      searchTerm: string
      type: SearchType
    }): Promise<unknown[]> => {
      const response = await fetch('/api/v1/tools/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })

      const data: unknown = await response.json()

      const isSuccessResponse = (
        value: unknown
      ): value is { status: 'success'; data: unknown } => {
        return (
          typeof value === 'object' &&
          value !== null &&
          'status' in value &&
          value.status === 'success' &&
          'data' in value
        )
      }

      const getErrorMessage = (value: unknown): string | null => {
        if (
          typeof value !== 'object' ||
          value === null ||
          !('message' in value)
        ) {
          return null
        }
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const message = (value as { message: unknown }).message
        return typeof message === 'string' ? message : null
      }

      if (response.ok && isSuccessResponse(data)) {
        return Array.isArray(data.data) ? data.data : []
      }

      throw new Error(getErrorMessage(data) || t('error.generic'))
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResults([])

    const trimmedTerm = searchTerm.trim()
    if (!trimmedTerm) {
      setError(t('error.generic'))
      return
    }

    try {
      const data = await searchMutation.mutateAsync({
        searchTerm: trimmedTerm,
        type: searchType
      })
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.generic'))
    }
  }

  const isLoading = searchMutation.isPending

  return (
    <main
      style={{
        maxWidth: 'var(--width-card-wide)',
        width: '100%',
        margin: '0 auto',
        padding: '2rem',
        minHeight: '100vh',
        height: 'auto'
      }}
    >
      <h1>{t('title')}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="type">
          {t('label.type')}
          <select
            id="type"
            value={searchType}
            onChange={(e) => {
              const value = e.target.value
              if (
                value === 'events' ||
                value === 'retail' ||
                value === 'giftcard'
              ) {
                setSearchType(value)
              }
            }}
            required
          >
            <option value="events">{t('option.events')}</option>
            <option value="retail">{t('option.retail')}</option>
            <option value="giftcard">{t('option.giftcard')}</option>
          </select>
        </label>
        <label htmlFor="search">
          {t('label.search')}
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
            }}
            placeholder={t('placeholder.search')}
            required
            maxLength={200}
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? t('button.loading') : t('button.search')}
        </button>
      </form>
      {error && (
        <aside style={{ color: 'var(--color-bg-secondary)', padding: '1rem' }}>
          {error}
        </aside>
      )}
      {results.length > 0 && (
        <>
          <section>
            <header>
              <h2>
                {t('results.title')} ({results.length})
              </h2>
            </header>
          </section>
          <section>
            <textarea
              readOnly
              value={results
                .map((result) => JSON.stringify(result, null, 2))
                .join('\n')}
              style={{
                width: '100%',
                minHeight: '400px',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}
            />
          </section>
        </>
      )}
    </main>
  )
}
