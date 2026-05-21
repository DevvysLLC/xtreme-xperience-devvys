import { useTranslations } from 'next-intl'

export const TurnkeyOrangeIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-label={t('turnkey_orange')}
    >
      <path
        d="M5 11.6666H15L20 16.6666L25 11.6666H35M13.3333 20L18.3333 25L26.6667 16.6666"
        stroke="#EB642C"
        strokeWidth="2"
      />
    </svg>
  )
}

export default TurnkeyOrangeIcon
