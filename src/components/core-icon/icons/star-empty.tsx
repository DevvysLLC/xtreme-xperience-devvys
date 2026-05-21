import { useTranslations } from 'next-intl'

export const StarEmptyIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="26"
      fill="none"
      viewBox="0 0 27 26"
      aria-label={t('star_empty')}
    >
      <path
        fill="#E6E6E6"
        d="M13.167 19.323 6.196 24.45a.628.628 0 0 1-.973-.69l2.555-8.319-7.085-5.05a.629.629 0 0 1 .365-1.141L9.83 9.24l2.59-8.21a.628.628 0 0 1 1.194-.015l2.819 8.222 8.584.02a.628.628 0 0 1 .367 1.137L18.47 15.4l2.842 8.386a.628.628 0 0 1-.962.712l-7.182-5.174Z"
      />
    </svg>
  )
}
export default StarEmptyIcon
