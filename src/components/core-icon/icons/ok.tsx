import { useTranslations } from 'next-intl'

export const OkIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('ok')}
    >
      <path
        d="M2 9.54949C2 9.19488 2.27809 8.90741 2.62114 8.90741H7.34177C7.68482 8.90741 7.96291 9.19488 7.96291 9.54949V19.1806C7.96291 19.5352 7.68482 19.8227 7.34177 19.8227H2.62114C2.27809 19.8227 2 19.5352 2 19.1806V9.54949Z"
        stroke="currentColor"
        strokeWidth="0.75"
      />
      <path
        d="M7.9626 9.41805V19.3461C9.10835 20.3158 10.4856 21 11.5649 21H19.0185C20.6652 21 22 19.6202 22 17.918V12.2678C22 10.5657 20.6652 9.18581 19.0185 9.18581H16.0304C16.0308 8.48183 16.1902 7.6818 16.6582 6.61748C17.317 5.11923 17.2173 3.79622 15.7886 3.21442C13.7531 2.38545 12.6705 4.11537 11.6484 5.74859L11.627 5.7827C11.1312 6.57496 9.49019 8.37024 7.9626 9.41805Z"
        stroke="currentColor"
        strokeWidth="0.75"
      />
    </svg>
  )
}
export default OkIcon
