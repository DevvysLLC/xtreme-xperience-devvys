import { useTranslations } from 'next-intl'

export const ProInstructionsOrangeIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-label={t('pro_intrusctions_orange')}
    >
      <path
        d="M6.66669 21.6667C6.66669 18.1305 8.07145 14.7391 10.5719 12.2386C13.0724 9.73813 16.4638 8.33337 20 8.33337C23.5362 8.33337 26.9276 9.73813 29.4281 12.2386C31.9286 14.7391 33.3334 18.1305 33.3334 21.6667H6.66669Z"
        stroke="#EB642C"
        strokeWidth="2"
      />
      <path
        d="M6.66669 21.6666H23.3334L33.3334 26.6666"
        stroke="#EB642C"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default ProInstructionsOrangeIcon
