import { useTranslations } from 'next-intl'

export const MenuIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('menu')}
    >
      <path d="M3 6H21" stroke="currentColor" strokeLinecap="round" />
      <path d="M3 12H21" stroke="currentColor" strokeLinecap="round" />
      <path d="M3 18H21" stroke="currentColor" strokeLinecap="round" />
    </svg>
  )
}

export default MenuIcon
