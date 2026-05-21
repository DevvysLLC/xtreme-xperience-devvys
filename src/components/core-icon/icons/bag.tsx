import { useTranslations } from 'next-intl'

export const BagIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('bag')}
    >
      <path
        d="M9.59474 10.3332V5.75053C9.61903 5.26809 9.87823 4.81312 10.3156 4.48525C10.7529 4.15738 11.3327 3.98334 11.9281 4.00126C12.5234 3.98334 13.1033 4.15738 13.5406 4.48525C13.978 4.81312 14.2372 5.26809 14.2614 5.75053V10.3332M8.46086 20H15.5391C17.005 20 18.2227 18.9233 18.3315 17.5312L18.9974 9.00552C19.0376 8.49005 18.6094 8.0507 18.0666 8.0507H5.93339C5.39065 8.0507 4.96236 8.49005 5.00262 9.00552L5.66855 17.5312C5.77729 18.9233 6.99503 20 8.46086 20Z"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default BagIcon
