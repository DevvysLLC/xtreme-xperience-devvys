import { useTranslations } from 'next-intl'

export const AccountIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('account')}
    >
      <path
        d="M12.0002 11.9999C14.6512 11.9999 16.8002 9.85087 16.8002 7.1999C16.8002 4.54894 14.6512 2.3999 12.0002 2.3999C9.34923 2.3999 7.2002 4.54894 7.2002 7.1999C7.2002 9.85087 9.34923 11.9999 12.0002 11.9999Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.5999 21.6C21.5999 19.0539 20.5885 16.6121 18.7881 14.8118C16.9878 13.0114 14.546 12 11.9999 12C9.45382 12 7.01203 13.0114 5.21168 14.8118C3.41133 16.6121 2.3999 19.0539 2.3999 21.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default AccountIcon
