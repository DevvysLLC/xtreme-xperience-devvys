import { useTranslations } from 'next-intl'

export const FullScreenIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('full_screen')}
    >
      <path
        d="M15.3333 2H22V8.66667M8.66667 2H2V8.66667M2 15.3333V22H8.66667M15.3333 22H22V15.3333"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default FullScreenIcon
