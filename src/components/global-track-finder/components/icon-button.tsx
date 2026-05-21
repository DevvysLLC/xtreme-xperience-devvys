'use client'

import clsx from 'clsx'
import type { ButtonHTMLAttributes, FC } from 'react'
import { CoreIcon } from '../../core-icon'
import styles from '../style.module.scss'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: string
  children: React.ReactNode
  variant?: 'default' | 'primary'
}

export const IconButton: FC<IconButtonProps> = ({
  icon,
  children,
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={clsx(
        styles.iconButton,
        styles[`iconButton--${variant}`],
        className
      )}
      {...props}
    >
      <CoreIcon icon={icon} />
      <span>{children}</span>
    </button>
  )
}
