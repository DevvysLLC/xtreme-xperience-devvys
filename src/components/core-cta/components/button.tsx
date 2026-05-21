import clsx from 'clsx'
import type { FC } from 'react'
import { CoreIcon } from '../../core-icon'
import type { ButtonType, LayoutType, SizeType, StyleType } from '../io'
import styles from '../style.module.scss'

export type ButtonProps = {
  text: string
  layoutType: LayoutType
  styleType: StyleType
  sizeType: SizeType
  type: ButtonType
  className?: string
  onClick?: () => void
  tabIndex?: number
  icon?: string | null
  iconPosition?: 'left' | 'right'
  ariaLabel?: string | null
  children?: React.ReactNode
  disabled?: boolean
}

export const Button: FC<ButtonProps> = (props) => {
  const {
    text,
    layoutType,
    styleType,
    sizeType,
    type,
    className,
    onClick,
    tabIndex,
    icon,
    iconPosition = 'right',
    ariaLabel,
    children,
    disabled
  } = props

  const _className = clsx(className, styles[`coreCta--${layoutType}`])

  return (
    <button
      type={type}
      className={_className}
      data-layout={layoutType}
      data-style={styleType}
      data-size={sizeType}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-label={ariaLabel ?? text ?? undefined}
      disabled={disabled}
      data-ga-section-name="core-cta"
      data-ga-action="click"
      data-ga-label={text}
      data-ga-value={ariaLabel ?? text}
    >
      {children ?? (
        <>
          {iconPosition === 'left' && icon && <CoreIcon icon={icon} />}
          {text}
          {iconPosition === 'right' && icon && <CoreIcon icon={icon} />}
        </>
      )}
    </button>
  )
}
