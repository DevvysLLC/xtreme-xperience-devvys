'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export const ToolsLogin = () => {
  const t = useTranslations('tools_login')
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const loginMutation = useMutation({
    mutationFn: async (params: { password: string }): Promise<void> => {
      const response = await fetch('/api/v1/tools/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })

      const data: unknown = await response.json()

      const isSuccessResponse = (
        value: unknown
      ): value is { status: 'success' } => {
        return (
          typeof value === 'object' &&
          value !== null &&
          'status' in value &&
          value.status === 'success'
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
        return
      }

      throw new Error(getErrorMessage(data) || t('error.invalid_password'))
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await loginMutation.mutateAsync({ password })
      router.push('/tools/search')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.generic'))
    }
  }

  const isLoading = loginMutation.isPending

  return (
    <main
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem',
        minHeight: '100vh',
        height: 'auto'
      }}
    >
      <form onSubmit={handleSubmit}>
        <h1>{t('title')}</h1>
        <label htmlFor="password">
          {t('label.password')}
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            required
          />
        </label>
        {error && (
          <aside
            style={{ color: 'var(--color-bg-secondary)', padding: '1rem' }}
          >
            {error}
          </aside>
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? t('button.loading') : t('button.submit')}
        </button>
      </form>
    </main>
  )
}
