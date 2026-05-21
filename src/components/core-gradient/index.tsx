import clsx from 'clsx'
import type { FC } from 'react'
import type { CoreGradientFragment } from './core-gradient.typegen'
import styles from './style.module.scss'

export type Props = {
  data: CoreGradientFragment
  className?: string
}

const parseCssRgbToRgba = (cssRgb: string | undefined): string | undefined => {
  if (!cssRgb) {
    return undefined
  }

  // Match rgb(r g b) or rgb(r g b / alpha)
  const match = /rgb\((\d+)\s+(\d+)\s+(\d+)(?:\s*\/\s*([\d.]+))?\)/.exec(cssRgb)

  if (!match) {
    // If it doesn't match expected format, return as-is
    return cssRgb
  }

  const [, r, g, b, alpha] = match
  const alphaValue = alpha !== undefined ? Number.parseFloat(alpha) : 1

  return `rgba(${r}, ${g}, ${b}, ${alphaValue})`
}

const formatDirection = (direction: string | null): string => {
  if (!direction) {
    return '0deg'
  }

  switch (direction) {
    case 'top':
      return '0deg'
    case 'right':
      return '90deg'
    case 'bottom':
      return '180deg'
    case 'left':
      return '270deg'
    default:
      return '0deg'
  }
}

export const CoreGradient: FC<Props> = ({ data, ...props }) => {
  const { enabled, direction, startColor, endColor, customCssGradient } = data
  const { className = '' } = props

  if (!enabled) {
    return null
  }

  if (customCssGradient) {
    return (
      <div
        className={clsx(styles.gradient, className)}
        style={{ background: customCssGradient }}
      ></div>
    )
  }

  const rgbaStartColor = parseCssRgbToRgba(startColor?.cssRgb)
  const rgbaEndColor = parseCssRgbToRgba(endColor?.cssRgb)

  return (
    <div
      className={clsx(styles.gradient, className)}
      style={{
        background: `linear-gradient(${formatDirection(direction)}, ${rgbaStartColor || startColor?.cssRgb} 0%, ${rgbaEndColor || endColor?.cssRgb} 100%)`
      }}
    ></div>
  )
}
