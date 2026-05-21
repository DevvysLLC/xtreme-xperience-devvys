import { useTranslations } from 'next-intl'

export const PauseIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('pause')}
    >
      <path d="M15.5 3L15.5 21" stroke="currentColor" strokeLinecap="round" />
      <path d="M8.5 3L8.5 21" stroke="currentColor" strokeLinecap="round" />
    </svg>
  )
}
export default PauseIcon
