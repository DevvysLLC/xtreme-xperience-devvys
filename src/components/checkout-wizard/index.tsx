'use client'

import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC, type ReactNode, useState } from 'react'
import { useCart } from '../../features/cart'
import { CoreCta } from '../core-cta'
import { CoreIcon } from '../core-icon'
import { CartSummary } from '../global-cart/components/summary'
import { CheckoutWizardGuard } from './components/checkout-guard'
import { CheckoutWizardProvider } from './context'
import styles from './style.module.scss'

type Props = {
  children?: ReactNode
  className?: string
}

export const CheckoutWizard: FC<Props> = ({ children, className }) => {
  const t = useTranslations('booking_wizard.cart')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const pathname = usePathname()
  const isComplete = pathname?.includes('/checkout/complete')
  const { data: cart } = useCart()
  const lineItems = cart?.cartData?.lineItems ?? []
  const totalItems = lineItems.reduce(
    (acc, item) => acc + (item.quantity ?? 1),
    0
  )

  return (
    <CheckoutWizardProvider>
      <CheckoutWizardGuard>
        <section className={clsx(styles.wizard, className)}>
          <div className={styles.wizard__container}>
            <div className={styles.wizard__content}>{children}</div>

            {!isComplete && totalItems > 0 && (
              <div className={styles.mobile}>
                <div
                  className={clsx(
                    styles.popup,
                    isCartOpen && styles['popup--open']
                  )}
                >
                  <button
                    type="button"
                    className={styles.popup__title}
                    onClick={() => {
                      setIsCartOpen(!isCartOpen)
                    }}
                  >
                    {t('title', {
                      count: totalItems.toString()
                    })}

                    <CoreIcon icon={isCartOpen ? 'close' : 'chevron-down'} />
                  </button>

                  <div
                    className={styles.popup__content}
                    aria-hidden={!isCartOpen}
                  >
                    <CartSummary />
                  </div>

                  <div className={styles.popup__actions}>
                    <CoreCta
                      text={t('continue')}
                      className={styles.popup__button}
                      href={null}
                      layoutType="button"
                      sizeType="small"
                      styleType="black"
                      onClick={() => {
                        setIsCartOpen(!isCartOpen)
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </CheckoutWizardGuard>
    </CheckoutWizardProvider>
  )
}
