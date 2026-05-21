import { useTranslations } from 'next-intl'

export const LocationIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('location')}
    >
      <path
        d="M4 8.99029C4 5.15534 7.55555 2 12 2C16.4444 2 20 5.15534 20 8.99029C20 13.1165 13.8333 20.0097 12 22C10.1667 20.0097 4 13.068 4 8.99029Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
      <path
        d="M12.2118 6.30469C10.4052 6.30469 8.92709 7.59625 8.92709 9.17484C8.92709 10.7534 10.4052 12.045 12.2118 12.045C14.0184 12.045 15.4965 10.7534 15.4965 9.17484C15.4965 7.59625 14.0184 6.30469 12.2118 6.30469Z"
        stroke="currentColor"
      />
    </svg>
  )
}
export default LocationIcon
