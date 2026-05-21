import dynamic from 'next/dynamic'
import { type ComponentType, type FC, useMemo } from 'react'
import type { CoreIconFragment } from './core-icon.typegen'

type IconComponent = ComponentType<Record<string, unknown>>

// Cache for dynamic icon components
const iconComponentCache = new Map<string, IconComponent>()

// Cached fallback icon component
const getFallbackIcon = (): IconComponent => {
  const cacheKey = '__fallback__'
  if (!iconComponentCache.has(cacheKey)) {
    const DynamicComponent = dynamic<Record<string, unknown>>(async () => {
      const fallback = await import('./icons/fallback')
      const FallbackComponent = fallback.FallbackIcon
      if (!FallbackComponent) {
        throw new Error('FallbackIcon not found in fallback module')
      }
      return { default: FallbackComponent }
    })
    iconComponentCache.set(cacheKey, DynamicComponent)
  }
  const cached = iconComponentCache.get(cacheKey)
  if (!cached) {
    throw new Error('Failed to get fallback icon from cache')
  }
  return cached
}

// Get or create dynamic icon component
const getIconComponent = (iconName: string): IconComponent => {
  if (!iconComponentCache.has(iconName)) {
    const DynamicComponent = dynamic<Record<string, unknown>>(async () => {
      try {
        const mod = await import(`./icons/${iconName}`)
        const Component = mod.default

        if (!Component) {
          throw new Error(
            `No component found in ${iconName} icon module. Expected default export`
          )
        }
        return { default: Component }
      } catch {
        const fallback = await import('./icons/fallback')
        const FallbackComponent = fallback.FallbackIcon
        if (!FallbackComponent) {
          throw new Error('FallbackIcon not found in fallback module')
        }
        return { default: FallbackComponent }
      }
    })
    iconComponentCache.set(iconName, DynamicComponent)
  }
  const cached = iconComponentCache.get(iconName)
  if (!cached) {
    throw new Error(`Failed to get icon component from cache: ${iconName}`)
  }
  return cached
}

export type Props = {
  ariaHidden?: boolean
  className?: string
  data?: CoreIconFragment
  icon?: string
  stroke?: string
  [key: string]: unknown
}

export const CoreIcon: FC<Props> = ({ data, icon: iconProp, ...restProps }) => {
  const icon = data?.icon ?? iconProp
  const Icon = useMemo(() => {
    if (!icon) {
      return getFallbackIcon()
    }
    return getIconComponent(icon)
  }, [icon])

  const { className, ariaHidden } = restProps
  const hasWrapperProps = className != null || ariaHidden != null

  if (hasWrapperProps) {
    return (
      <span {...restProps}>
        <Icon />
      </span>
    )
  }

  return <Icon />
}
