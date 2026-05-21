import { useTranslations } from 'next-intl'

export const StarHalfIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="26"
      fill="none"
      viewBox="0 0 27 26"
      aria-label={t('star_half')}
    >
      <path
        fill="#E6E6E6"
        d="m13.373 19.584-7.24 5.324a.653.653 0 0 1-1.01-.718l2.652-8.639-7.357-5.245A.653.653 0 0 1 .796 9.12l9.112-.01 2.69-8.528a.652.652 0 0 1 1.24-.015l2.928 8.54 8.916.02a.653.653 0 0 1 .381 1.182L18.88 15.51l2.952 8.71a.652.652 0 0 1-1 .738l-7.459-5.373Z"
      />
      <path
        fill="#EB642C"
        d="M13.373.568a.805.805 0 0 0-.41.115l-2.928 8.54-8.916.02a.653.653 0 0 0-.386 1.182L8.09 15.67l-2.652 8.639a.653.653 0 0 0 1.01.718l7.24-5.324-.315-.119Z"
      />
    </svg>
  )
}
export default StarHalfIcon
