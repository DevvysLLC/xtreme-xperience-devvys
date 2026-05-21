'use client'

import Script from 'next/script'
import type { FC, ReactNode } from 'react'
import { BookingHeader } from '../../components/booking-header'
import { CheckoutWizard } from '../../components/checkout-wizard'
import { GlobalToast } from '../../components/global-toast'

type Props = {
  children: ReactNode
}

export const CheckoutLayoutClient: FC<Props> = ({ children }) => {
  return (
    <>
      <BookingHeader showCart={false} />
      <main className="main-content-container main-content-container--full-height">
        <CheckoutWizard>{children}</CheckoutWizard>
      </main>
      <GlobalToast />
      <Script src="https://js.stripe.com/v3/" />
    </>
  )
}
