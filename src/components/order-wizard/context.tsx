'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState
} from 'react'

type OrderWizardState = {
  activePanel: 'content' | 'summary'
}

type OrderWizardContextType = {
  state: OrderWizardState
  setActivePanel: (panel: OrderWizardState['activePanel']) => void
}

const OrderWizardContext = createContext<OrderWizardContextType | undefined>(
  undefined
)

type Props = {
  children: ReactNode
}

export const OrderWizardProvider = ({ children }: Props) => {
  const [activePanel, setActivePanel] =
    useState<OrderWizardState['activePanel']>('content')

  const value = useMemo<OrderWizardContextType>(
    () => ({
      state: { activePanel },
      setActivePanel
    }),
    [activePanel]
  )

  return (
    <OrderWizardContext.Provider value={value}>
      {children}
    </OrderWizardContext.Provider>
  )
}

export const useOrderWizardState = () => {
  const context = useContext(OrderWizardContext)
  if (!context) {
    throw new Error(
      'useOrderWizardState must be used within OrderWizardProvider'
    )
  }
  return context
}
