import { useTranslations } from 'next-intl'

export const LocationOrangeIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-label={t('location')}
    >
      <path
        d="M20 35C20 35 30 25.8334 30 18.3334C30 15.6812 28.9464 13.1377 27.0711 11.2623C25.1957 9.38694 22.6522 8.33337 20 8.33337C17.3478 8.33337 14.8043 9.38694 12.9289 11.2623C11.0536 13.1377 10 15.6812 10 18.3334C10 25.8334 20 35 20 35Z"
        stroke="#EB642C"
        strokeWidth="2"
      />
      <path
        d="M20 21.6667C21.8409 21.6667 23.3333 20.1743 23.3333 18.3333C23.3333 16.4924 21.8409 15 20 15C18.159 15 16.6666 16.4924 16.6666 18.3333C16.6666 20.1743 18.159 21.6667 20 21.6667Z"
        fill="#EB642C"
      />
    </svg>
  )
}
export default LocationOrangeIcon
