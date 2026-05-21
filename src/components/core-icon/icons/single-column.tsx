import { useTranslations } from 'next-intl'

export const SingleColumnIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('single_column')}
    >
      <path d="M4 4H20V20H4V4Z" stroke="currentColor" strokeLinejoin="round" />
    </svg>
  )
}
export default SingleColumnIcon
