import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import { CoreIcon } from '../../core-icon'
import type { LayoutType, SizeType, StyleType, TargetType } from '../io'
import styles from '../style.module.scss'

export type AnchorProps = {
  text: string
  layoutType: LayoutType
  styleType: StyleType
  sizeType: SizeType
  href: string
  target: TargetType
  className?: string
  onClick?: () => void
  tabIndex?: number
  icon?: string | null
  iconPosition?: 'left' | 'right'
  ariaLabel?: string | null
  children?: React.ReactNode
}

export const Anchor: FC<AnchorProps> = (props) => {
  const {
    text,
    layoutType,
    styleType,
    sizeType,
    href,
    target,
    className,
    onClick,
    tabIndex,
    icon,
    iconPosition = 'right',
    ariaLabel,
    children
  } = props

  const _className = clsx(className, styles[`coreCta--${layoutType}`])

  return (
    <Link
      href={href}
      target={target}
      className={_className}
      data-layout={layoutType}
      data-style={styleType}
      data-size={sizeType}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-label={ariaLabel ?? text ?? undefined}
      title={ariaLabel ?? text ?? undefined}
    >
      {children ?? (
        <>
          {iconPosition === 'left' && icon && <CoreIcon icon={icon} />}
          {text}
          {iconPosition === 'right' && icon && <CoreIcon icon={icon} />}
        </>
      )}
    </Link>
  )
}
