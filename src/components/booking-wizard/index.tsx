'use client'

import type { FC, ReactNode } from 'react'
import { BookingWizardGuard } from './components/booking-guard'
import { BookingWizardProvider } from './context'

type Props = {
  children?: ReactNode
}

export const BookingWizard: FC<Props> = ({ children }) => {
  return (
    <BookingWizardProvider>
      <BookingWizardGuard>{children}</BookingWizardGuard>
    </BookingWizardProvider>
  )
}
