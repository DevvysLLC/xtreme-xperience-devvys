import { useTranslations } from 'next-intl'

export const ArrowLeftIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="9"
      viewBox="0 0 6 9"
      fill="none"
      aria-label={t('arrow_left')}
    >
      <path
        d="M4.70178 8.47363L0.701782 4.41209L4.70178 0.350555"
        stroke="currentColor"
      />
    </svg>
  )
}

export default ArrowLeftIcon
