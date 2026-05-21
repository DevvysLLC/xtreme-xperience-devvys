import { useTranslations } from 'next-intl'

export const SpeedOrangeIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-label={t('speed')}
    >
      <path
        d="M35 20C35 18.0302 34.612 16.0796 33.8582 14.2597C33.1044 12.4399 31.9995 10.7863 30.6066 9.3934C29.2137 8.00052 27.5601 6.89563 25.7403 6.14181C23.9204 5.38799 21.9698 5 20 5C18.0302 5 16.0796 5.38799 14.2597 6.14181C12.4399 6.89563 10.7863 8.00052 9.3934 9.3934C8.00052 10.7863 6.89563 12.4399 6.14181 14.2597C5.38799 16.0796 5 18.0302 5 20"
        stroke="#EB642C"
        strokeWidth="2"
      />
      <path
        d="M20 20L30 15"
        stroke="#EB642C"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default SpeedOrangeIcon
