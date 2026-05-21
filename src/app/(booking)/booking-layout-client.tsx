'use client'

import type { FC, ReactNode } from 'react'
import { BookingHeader } from '../../components/booking-header'
import { BookingWizard } from '../../components/booking-wizard'
import { DrawerManager } from '../../components/global-drawer/drawer-manager'
import { GlobalToast } from '../../components/global-toast'

type Props = {
  children: ReactNode
}

export const BookingLayoutClient: FC<Props> = ({ children }) => {
  return (
    <>
      <BookingHeader showCart={false} />
      <main className="main-content-container main-content-container--full-height">
        <BookingWizard>{children}</BookingWizard>
      </main>
      <DrawerManager />
      <GlobalToast />
    </>
  )
}
