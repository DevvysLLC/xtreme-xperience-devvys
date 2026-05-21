'use client'

import { useTranslations } from 'next-intl'
import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  useEffect,
  useRef,
  useState
} from 'react'
import { useLocation } from '../../../features/location'
import styles from '../style.module.scss'

type Props = {
  onSearch?: (query: string) => void
  placeholder?: string
  initialValue?: string
  value?: string
}

export const SearchBar: FC<Props> = ({
  onSearch,
  placeholder,
  initialValue,
  value: controlledValue
}) => {
  const t = useTranslations('section_event_finder')
  const { data: location } = useLocation()
  const homeTrackName = location?.track?.model?.nickname ?? ''
  const [internalSearchQuery, setInternalSearchQuery] = useState(
    initialValue ?? homeTrackName
  )
  const hasSetInitialValue = useRef(!!initialValue)
  const hasSetHomeTrack = useRef(false)
  const onSearchRef = useRef(onSearch)

  // Use controlled value if provided, otherwise use internal state
  const isControlled = controlledValue !== undefined
  const searchQuery = isControlled ? controlledValue : internalSearchQuery

  // Keep the ref updated with the latest callback
  useEffect(() => {
    onSearchRef.current = onSearch
  }, [onSearch])

  // Handle initialValue (from booking store) - takes priority, can arrive after hydration
  // Only applies in uncontrolled mode
  useEffect(() => {
    if (!isControlled && initialValue && !hasSetInitialValue.current) {
      setInternalSearchQuery(initialValue)
      onSearchRef.current?.(initialValue)
      hasSetInitialValue.current = true
    }
  }, [initialValue, isControlled])

  // Handle home track fallback (only if no initialValue was ever set)
  // Only applies in uncontrolled mode
  useEffect(() => {
    if (
      !isControlled &&
      homeTrackName &&
      !hasSetInitialValue.current &&
      !hasSetHomeTrack.current
    ) {
      setInternalSearchQuery(homeTrackName)
      onSearchRef.current?.(homeTrackName)
      hasSetHomeTrack.current = true
    }
  }, [homeTrackName, isControlled])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    if (!isControlled) {
      setInternalSearchQuery(newValue)
    }
    onSearch?.(newValue)
  }

  const handleClear = () => {
    if (!isControlled) {
      setInternalSearchQuery('')
    }
    onSearch?.('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch?.(searchQuery)
  }

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit} role="search">
      <input
        id="location-picker-search"
        type="search"
        className={styles.searchBar__input}
        value={searchQuery}
        onChange={handleInputChange}
        placeholder={placeholder || t('search.placeholder')}
        autoComplete="off"
        aria-label={t('search.label')}
      />
      {searchQuery && (
        <button
          type="button"
          className={styles.searchBar__clear}
          onClick={handleClear}
        >
          {t('search.clear')}
        </button>
      )}
    </form>
  )
}
