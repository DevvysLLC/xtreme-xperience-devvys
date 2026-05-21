import { useTranslations } from 'next-intl'

export const ShippingIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('shipping')}
    >
      <path
        d="M10.9831 15.8843C10.9831 17.2495 9.92069 18.3561 8.61019 18.3561C7.29968 18.3561 6.2373 17.2495 6.2373 15.8843C6.2373 14.5192 7.29968 13.4126 8.61019 13.4126C9.92069 13.4126 10.9831 14.5192 10.9831 15.8843Z"
        stroke="#212121"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.2345 15.8843C20.2345 17.2495 19.1721 18.3561 17.8616 18.3561C16.5511 18.3561 15.4887 17.2495 15.4887 15.8843C15.4887 14.5192 16.5511 13.4126 17.8616 13.4126C19.1721 13.4126 20.2345 14.5192 20.2345 15.8843Z"
        stroke="#212121"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 8.46875H6.53107M2 10.5874H6.53107M2 12.706H6.53107"
        stroke="#212121"
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      <path
        d="M4.47168 12.7062V14.8842C4.47168 15.4364 4.91939 15.8842 5.47168 15.8842H6.23722M4.47168 8.4689V6.64404C4.47168 6.09176 4.91939 5.64404 5.47168 5.64404H16.797C17.597 5.64404 18.3201 6.12084 18.6352 6.8562L20.2344 10.5875L21.2493 11.3995C21.7237 11.779 21.9999 12.3537 21.9999 12.9612V14.8842C21.9999 15.4364 21.5522 15.8842 20.9999 15.8842H20.2344M11.1807 15.8842H15.2909"
        stroke="#212121"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.2347 10.5875H15.6122C15.0449 10.5875 14.585 9.95518 14.585 9.17512V5.64404"
        stroke="#212121"
        strokeWidth="0.75"
      />
    </svg>
  )
}
export default ShippingIcon
