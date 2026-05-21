import { useTranslations } from 'next-intl'

export const CheckIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('check')}
    >
      <path d="M3 12.5385L9.35294 19L21 5" stroke="currentColor" />
    </svg>
  )
}

export default CheckIcon
