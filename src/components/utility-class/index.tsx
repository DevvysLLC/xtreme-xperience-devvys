import { createElement, type FC, type ReactNode } from 'react'

type UtilityClassData = {
  className?: string
  tag?: string
}

type Props = {
  data: UtilityClassData
  children?: ReactNode
}

export const UtilityClass: FC<Props> = ({ data, children }) => {
  const tag = typeof data.tag === 'string' && data.tag ? data.tag : 'span'
  const cls =
    typeof data.className === 'string' && data.className ? data.className : null
  return createElement(tag, cls ? { className: cls } : undefined, children)
}
