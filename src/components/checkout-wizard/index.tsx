'use client'

import clsx from 'clsx'
import type { FC, ReactNode } from 'react'
import { CheckoutWizardGuard } from './components/checkout-guard'
import { CheckoutWizardProvider } from './context'
import styles from './style.module.scss'

type Props = {
  children?: ReactNode
  className?: string
}

export const CheckoutWizard: FC<Props> = ({ children, className }) => {
  return (
    <CheckoutWizardProvider>
      <CheckoutWizardGuard>
        <section className={clsx(styles.wizard, className)}>
          <div className={styles.wizard__container}>
            <div className={styles.wizard__content}>{children}</div>
          </div>
        </section>
      </CheckoutWizardGuard>
    </CheckoutWizardProvider>
  )
}
