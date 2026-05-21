'use client'
import type { ReactNode } from 'react'
import { HeaderProvider } from '../context/header-context'
import { HeaderWrapper } from './header-wrapper'

type Props = {
  children: ReactNode
  relativePaths: string | null | undefined
  isTransparent?: boolean | null
}

export const HeaderWithContext = ({
  children,
  relativePaths,
  isTransparent
}: Props) => {
  return (
    <HeaderProvider relativePaths={relativePaths} isTransparent={isTransparent}>
      <HeaderWrapper>{children}</HeaderWrapper>
    </HeaderProvider>
  )
}
