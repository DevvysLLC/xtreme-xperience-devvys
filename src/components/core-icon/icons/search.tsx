import { useTranslations } from 'next-intl'

export const SearchIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('search')}
    >
      <path
        d="M15.8554 15.8955L20 20M17.913 10.9565C17.913 14.7985 14.7985 17.913 10.9565 17.913C7.11454 17.913 4 14.7985 4 10.9565C4 7.11454 7.11454 4 10.9565 4C14.7985 4 17.913 7.11454 17.913 10.9565Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
export default SearchIcon
