import { useTranslations } from 'next-intl'

export const ChevronDownLightIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('chevron_down')}
    >
      <path d="M20.123 8L12 16L3.87689 8" stroke="currentColor" />
    </svg>
  )
}

export default ChevronDownLightIcon
