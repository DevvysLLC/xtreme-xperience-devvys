import clsx from 'clsx'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import MdToJSX from 'markdown-to-jsx'
import { type ComponentType, type FC, lazy, Suspense } from 'react'
import styles from './style.module.scss'

type RawProps = Record<string, unknown>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>
type RegistryEntry = {
  load?: () => Promise<{ default: AnyComponent }>
  component?: FC<unknown>
  mapProps?: (raw: RawProps) => {
    data: Record<string, unknown>
    children?: unknown
  }
  fallback?: React.ReactNode
}

const mapAttributesToDataProp = (
  raw: RawProps
): { data: Record<string, unknown>; children?: unknown } => {
  const { children, ...rest } = raw
  const data: Record<string, unknown> = {}
  Object.assign(data, rest)
  return children ? { data, children } : { data }
}

const registry: Record<string, RegistryEntry> = {
  CoreCountdown: {
    load: () =>
      import('../core-countdown').then((m) => ({
        default: m.CoreCountdown
      })),
    mapProps: (raw: RawProps) => mapAttributesToDataProp(raw),
    fallback: null
  },
  UtilityClass: {
    load: () =>
      import('../utility-class').then((m) => ({
        default: m.UtilityClass
      })),
    mapProps: (raw: RawProps) => mapAttributesToDataProp(raw)
  }
}

const loadComponent = (entry: RegistryEntry): FC<RawProps> => {
  const Component = entry.load ? lazy(entry.load) : entry.component
  const Shim: FC<RawProps> = (raw) => {
    const mapped = entry.mapProps ? entry.mapProps(raw) : raw
    return (
      <Suspense fallback={entry.fallback ?? null}>
        {Component ? <Component {...mapped} /> : null}
      </Suspense>
    )
  }
  return Shim
}

export type Props = {
  children: string
  type?: 'rte'
  className?: string | null
}

export const CoreTextMarkdown: FC<Props> = ({ children, ...props }) => {
  const { type, className } = props
  const _className = type === 'rte' ? styles.rte : null

  // When type is 'rte', convert single newlines to <br /> tags
  // This preserves line breaks in rich text content
  const processedChildren =
    type === 'rte' ? children.replace(/(?<!\n)\n(?!\n)/g, '<br />\n') : children

  const overrides: NonNullable<MarkdownToJSX.Options['overrides']> =
    Object.fromEntries(
      Object.entries(registry).map(([tag, entry]) => [
        tag,
        { component: loadComponent(entry) }
      ])
    )
  const options: MarkdownToJSX.Options = {
    overrides,
    forceWrapper: true
  }
  return (
    <MdToJSX options={options} className={clsx(_className, className)}>
      {processedChildren}
    </MdToJSX>
  )
}
