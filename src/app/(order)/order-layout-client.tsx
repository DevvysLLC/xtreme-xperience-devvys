'use client'

import type { FC, ReactNode } from 'react'
import { BookingHeader } from '../../components/booking-header'

type Props = {
  children: ReactNode
}

export const OrderLayoutClient: FC<Props> = ({ children }) => {
  return (
    <>
      <BookingHeader showCart={false} />
      <main className="main-content-container main-content-container--full-height">
        {children}
      </main>
    </>
  )
}
