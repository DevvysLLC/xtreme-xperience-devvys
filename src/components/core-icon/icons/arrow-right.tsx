import { useTranslations } from 'next-intl'

export const ArrowRightIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('arrow_right')}
    >
      <path
        d="M13.4286 3L22 12M22 12L13.4286 21M22 12L2 12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArrowRightIcon
