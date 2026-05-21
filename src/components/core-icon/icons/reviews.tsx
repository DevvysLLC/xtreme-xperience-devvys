import { useTranslations } from 'next-intl'

export const ReviewsIcon = () => {
  const t = useTranslations('core_icon')

  return (
    <svg
      width="65"
      height="28"
      viewBox="0 0 65 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={t('reviews')}
    >
      <path
        d="M32.2195 3L35.8658 10.378L43.9999 11.561L38.1097 17.3049L39.4999 25.4146L32.2195 21.5854L24.939 25.4146L26.3292 17.3049L20.439 11.561L28.5731 10.378L32.2195 3Z"
        stroke="#0F0F0F"
        strokeWidth="0.97561"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.9025 16.793L23.5854 12.5857L29.5489 11.7198L32.2196 6.30518L34.8903 11.7198L40.8537 12.5857L36.5367 16.793L37.5611 22.732L32.2196 19.9271L26.8781 22.732L27.9025 16.793Z"
        fill="#F84D27"
      />
      <path
        d="M54.5488 4.56104L57.1829 9.91469L63.0854 10.7684L58.8171 14.9391L59.8293 20.8171L54.5488 18.0366L49.2683 20.8171L50.2683 14.9391L46 10.7684L51.9024 9.91469L54.5488 4.56104Z"
        stroke="#0F0F0F"
        strokeWidth="0.97561"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M54.5489 16.3901L51.2075 18.1462L51.8416 14.4267L49.1465 11.7926L52.8782 11.256L54.5489 7.86572L56.2197 11.256L59.9514 11.7926L57.244 14.4267L57.8782 18.1462L54.5489 16.3901Z"
        fill="#F84D27"
      />
      <path
        d="M9.53659 4.56104L12.1829 9.91469L18.0854 10.7684L13.8171 14.9391L14.8171 20.8171L9.53659 18.0366L4.2561 20.8171L5.26829 14.9391L1 10.7684L6.90244 9.91469L9.53659 4.56104Z"
        stroke="#0F0F0F"
        strokeWidth="0.97561"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.84111 14.4267L4.13379 11.7926L7.8655 11.256L9.53623 7.86572L11.207 11.256L14.9387 11.7926L12.2435 14.4267L12.8777 18.1462L9.53623 16.3901L6.20696 18.1462L6.84111 14.4267Z"
        fill="#F84D27"
      />
    </svg>
  )
}
export default ReviewsIcon
