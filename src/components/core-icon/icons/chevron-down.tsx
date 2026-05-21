import { useTranslations } from 'next-intl'

export const ChevronDownIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('chevron_down')}
    >
      <path
        d="M10.0615 4L5.99998 8L1.93845 4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export default ChevronDownIcon
