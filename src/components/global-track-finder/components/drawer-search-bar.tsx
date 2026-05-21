'use client'

import { useTranslations } from 'next-intl'
import type { ChangeEvent, FormEvent } from 'react'
import { useTrackFinderDrawer } from '../context/drawer-context'
import styles from '../style.module.scss'

type TrackFinderDrawerSearchBarProps = {
  placeholder?: string
}

export const TrackFinderDrawerSearchBar = ({
  placeholder
}: TrackFinderDrawerSearchBarProps) => {
  const t = useTranslations('track_finder.drawer')
  const { searchQuery, setSearchQuery } = useTrackFinderDrawer()

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchQuery(value)
  }

  const handleClear = () => {
    setSearchQuery('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form
      className={styles.drawerSearchBar}
      onSubmit={handleSubmit}
      role="search"
    >
      <div className={styles.drawerSearchBar__wrapper}>
        <input
          id="drawer-search-bar"
          type="search"
          className={styles.drawerSearchBar__input}
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder || t('search_placeholder')}
          autoComplete="off"
          aria-label={t('search_label')}
        />
        {searchQuery && (
          <button
            type="button"
            className={styles.drawerSearchBar__clear}
            onClick={handleClear}
          >
            {t('clear_search')}
          </button>
        )}
      </div>
    </form>
  )
}
