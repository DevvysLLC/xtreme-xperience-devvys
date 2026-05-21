'use client'

import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useMemo
} from 'react'

type GlobalConfigContextType = {
  bookingEnableLegacyBooking: boolean
}

const GlobalConfigContext = createContext<GlobalConfigContextType | undefined>(
  undefined
)

type Props = {
  children: ReactNode
  bookingEnableLegacyBooking: boolean
}

export const GlobalConfigProvider: FC<Props> = ({
  children,
  bookingEnableLegacyBooking
}) => {
  const value = useMemo<GlobalConfigContextType>(
    () => ({
      bookingEnableLegacyBooking
    }),
    [bookingEnableLegacyBooking]
  )

  return (
    <GlobalConfigContext.Provider value={value}>
      {children}
    </GlobalConfigContext.Provider>
  )
}

export const useGlobalConfig = (): GlobalConfigContextType => {
  const context = useContext(GlobalConfigContext)

  if (context === undefined) {
    throw new Error(
      'useGlobalConfig must be used within a GlobalConfigProvider'
    )
  }

  return context
}
