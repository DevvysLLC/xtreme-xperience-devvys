import { useTranslations } from 'next-intl'

export const PlusIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('plus')}
    >
      <path d="M19 12L5 12" stroke="currentColor" strokeLinecap="round" />
      <path d="M12 5L12 19" stroke="currentColor" strokeLinecap="round" />
    </svg>
  )
}
export default PlusIcon
