'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'

export type CheckoutWizardState = {
  activeStep: number
}

type CheckoutWizardContextValue = {
  state: CheckoutWizardState
  setActiveStep: (step: number) => void
}

const CheckoutWizardContext = createContext<
  CheckoutWizardContextValue | undefined
>(undefined)

type Props = {
  children: React.ReactNode
}

export const CheckoutWizardProvider = ({ children }: Props) => {
  const [activeStep, setActiveStepState] = useState(0)

  const setActiveStep = useCallback((step: number) => {
    setActiveStepState(step)
  }, [])

  const state = useMemo<CheckoutWizardState>(
    () => ({ activeStep }),
    [activeStep]
  )

  return (
    <CheckoutWizardContext.Provider value={{ state, setActiveStep }}>
      {children}
    </CheckoutWizardContext.Provider>
  )
}

export const useCheckoutWizardState = () => {
  const context = useContext(CheckoutWizardContext)
  if (context === undefined) {
    throw new Error(
      'useCheckoutWizardState must be used within CheckoutWizardProvider'
    )
  }
  return context
}
