'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { CoreIcon } from '../../core-icon'
import { Drawer } from '../../global-drawer'
import { useSearch } from '../hooks'
import styles from '../style.module.scss'
import { NoResults } from './no-results'
import { SearchResult } from './result'

export const SearchDrawer = () => {
  const t = useTranslations('search.drawer')
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [debouncedQuery, setDebouncedQuery] = useState<string | null>(null)
  const { data, isLoading, error } = useSearch(debouncedQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedValue = inputValue.trim()
      setDebouncedQuery(trimmedValue.length > 0 ? trimmedValue : null)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [inputValue])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  return (
    <Drawer id="search-drawer" layoutType="search">
      <div className={styles.globalSearch}>
        <form
          onSubmit={(event) => {
            event.preventDefault()
          }}
          className={styles.globalSearch__form}
        >
          <CoreIcon icon="search" />
          <label className={styles.globalSearch__label} htmlFor="search-input">
            {t('aria.search_label')}
          </label>
          <input
            id="search-input"
            type="text"
            name="search"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={t('placeholder')}
            autoComplete="off"
            className={styles.globalSearch__input}
            ref={inputRef}
          />
          <button
            type="button"
            className={styles.globalSearch__closeIcon}
            aria-label={t('aria.clear')}
            onClick={() => {
              setInputValue('')
              inputRef.current?.focus()
            }}
          >
            <CoreIcon icon="close" />
          </button>
        </form>
        <div>
          {isLoading && (
            <div className={styles.globalSearch__results}>{t('loading')}</div>
          )}
          {error && (
            <div className={styles.globalSearch__results}>
              {error instanceof Error ? error.message : t('error')}
            </div>
          )}
          {data && debouncedQuery && (
            <div className={styles.globalSearch__results}>
              {data.total_found === 0 ? (
                <NoResults query={debouncedQuery} />
              ) : (
                <>
                  <div className={styles.globalSearch__totalFound}>
                    {t('results_found', { count: data.total_found })}
                  </div>
                  <ul>
                    {data.hits.map((hit) => (
                      <li key={hit.id}>
                        <SearchResult document={hit} type={hit.type} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  )
}
