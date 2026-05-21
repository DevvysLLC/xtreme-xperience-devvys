'use client'
import clsx from 'clsx'
import type { FC } from 'react'
import { useSwiper } from 'swiper/react'
import { CoreIcon } from '../../core-icon'
import styles from '../style.module.scss'

export type NavigationButtonProps = {
  direction: 'prev' | 'next'
}

export const NavigationButton: FC<NavigationButtonProps> = ({ direction }) => {
  const swiper = useSwiper()

  const handleClick = () => {
    if (direction === 'prev') {
      swiper.slidePrev()
    } else {
      swiper.slideNext()
    }
  }

  return (
    <button
      type="button"
      className={clsx(styles.button, styles[`button--${direction}`])}
      onClick={handleClick}
    >
      <CoreIcon
        icon={direction === 'prev' ? 'chevron-left' : 'chevron-right'}
        stroke="white"
      />
    </button>
  )
}
