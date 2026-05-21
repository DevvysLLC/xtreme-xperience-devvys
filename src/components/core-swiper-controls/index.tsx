import clsx from 'clsx'
import type { FC } from 'react'
import 'swiper/css'
import { useSwiper } from 'swiper/react'
import { CoreIcon } from '../core-icon'
import styles from './style.module.scss'

export type Props = {
  className?: string
  layout?: 'default' | 'reverse'
  hidePagination?: boolean
  activeIndex: number
  totalSlides: number
}

export const CoreSwiperControls: FC<Props> = ({
  activeIndex,
  totalSlides,
  className,
  layout = 'default',
  hidePagination = false
}) => {
  const swiper = useSwiper()

  return (
    <div
      className={clsx(
        styles.container,
        className,
        styles[`container--${layout}`]
      )}
    >
      <button
        type="button"
        className={styles.prev}
        onClick={() => swiper.slidePrev()}
      >
        <CoreIcon icon="chevron-left" />
      </button>

      {!hidePagination && (
        <div className={clsx(styles.pagination)}>
          {`${activeIndex + 1}/${totalSlides}`}
        </div>
      )}

      <button
        type="button"
        className={styles.next}
        onClick={() => swiper.slideNext()}
      >
        <CoreIcon icon="chevron-right" />
      </button>
    </div>
  )
}
