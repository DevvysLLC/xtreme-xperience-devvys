'use client'

import clsx from 'clsx'
import type { FC, ReactNode } from 'react'
import { OrderWizardGuard } from './components/order-guard'
import { OrderWizardProvider } from './context'
import styles from './style.module.scss'

type Props = {
  children?: ReactNode
  className?: string
  orderId: string
}

export const OrderWizard: FC<Props> = ({ children, className, orderId }) => {
  return (
    <OrderWizardProvider>
      <OrderWizardGuard orderId={orderId}>
        <section className={clsx(styles.wizard, className)}>
          <div className={styles.wizard__container}>
            <div className={styles.wizard__content}>{children}</div>
          </div>
        </section>
      </OrderWizardGuard>
    </OrderWizardProvider>
  )
}
