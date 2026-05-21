import { useTranslations } from 'next-intl'

export const PlayIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('play')}
    >
      <path
        d="M20 12L5 22L5 2L20 12Z"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default PlayIcon
