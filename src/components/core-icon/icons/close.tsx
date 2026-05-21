import { useTranslations } from 'next-intl'

export const CloseIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      aria-label={t('close')}
    >
      <path stroke="currentColor" d="m4 4 16 16M20 4 4 20" />
    </svg>
  )
}

export default CloseIcon
