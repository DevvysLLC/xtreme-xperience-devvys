'use client'

import type { FC, ReactNode } from 'react'
import { BookingHeader } from '../../components/booking-header'
import { DrawerManager } from '../../components/global-drawer/drawer-manager'

type Props = {
  children: ReactNode
}

export const LegacyLayoutClient: FC<Props> = ({ children }) => {
  return (
    <>
      <BookingHeader showCart={false} />
      <main className="main-content-container main-content-container--full-height">
        {children}
      </main>
      <DrawerManager />
    </>
  )
}
