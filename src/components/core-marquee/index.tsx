import clsx from 'clsx'
import type { FC, ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import style from './style.module.scss'

export type Props = {
  data: {
    text?: string
    elements?: (string | ReactNode)[]
  }
  containerClass?: string
  innerClass?: string
}

const CLONE_ITEMS_ARRAY = 5

export const CoreMarquee: FC<Props> = ({ data, ...props }) => {
  const { text, elements } = data
  const { containerClass = '', innerClass = '' } = props
  const uniqueId = uuidv4()
  const items: (string | ReactNode)[] = elements
    ? elements
    : text
      ? text
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : []

  return (
    <div className={clsx(style.marquee, containerClass)}>
      {Array.from({ length: CLONE_ITEMS_ARRAY }).map((_, cloneIndex) => (
        <div
          className={clsx(style.marquee__inner, innerClass)}
          key={`${uniqueId}-${cloneIndex}`}
        >
          {items.map((item, itemIndex) => {
            const key = `${uniqueId}-${cloneIndex}-${itemIndex}`
            // If item is a string, wrap it in a span; otherwise render as-is
            return typeof item === 'string' ? (
              <span key={key}>{item}</span>
            ) : (
              <span key={key}>{item}</span>
            )
          })}
        </div>
      ))}
    </div>
  )
}
