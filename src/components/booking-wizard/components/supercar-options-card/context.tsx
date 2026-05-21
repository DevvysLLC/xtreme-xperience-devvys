'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState
} from 'react'
import type {
  BookingLapQuantityConfig,
  RateTypePrice
} from '../../../../io/types'

type SelectedDaySchedule = {
  scheduleId: number
  rateId: number
  rateType: string
  startTime: string
  available: number | null
  price: number | null
  rateTypePrice: RateTypePrice | null
}

type SupercarOptionsCardState = {
  totalAvailableSessions: number
  selectedLapQuantityOption: BookingLapQuantityConfig
  selectedDaySchedule: SelectedDaySchedule | null
  selectedQuantity: number
}

type SupercarOptionsCardContextType = {
  state: SupercarOptionsCardState
  setTotalAvailableSessions: (count: number) => void
  setSelectedLapQuantityOption: (option: BookingLapQuantityConfig) => void
  setSelectedDaySchedule: (schedule: SelectedDaySchedule | null) => void
  setSelectedQuantity: (quantity: number) => void
}

const SupercarOptionsCardContext = createContext<
  SupercarOptionsCardContextType | undefined
>(undefined)

type Props = {
  children: ReactNode
  initialLapQuantityOption: BookingLapQuantityConfig
}

export const SupercarOptionsCardProvider = ({
  children,
  initialLapQuantityOption
}: Props) => {
  const [totalAvailableSessions, setTotalAvailableSessions] =
    useState<number>(0)
  const [selectedLapQuantityOption, setSelectedLapQuantityOption] =
    useState<BookingLapQuantityConfig>(initialLapQuantityOption)
  const [selectedDaySchedule, setSelectedDaySchedule] =
    useState<SelectedDaySchedule | null>(null)
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)

  const state = useMemo<SupercarOptionsCardState>(
    () => ({
      totalAvailableSessions,
      selectedLapQuantityOption,
      selectedDaySchedule,
      selectedQuantity
    }),
    [
      totalAvailableSessions,
      selectedLapQuantityOption,
      selectedDaySchedule,
      selectedQuantity
    ]
  )

  return (
    <SupercarOptionsCardContext.Provider
      value={{
        state,
        setTotalAvailableSessions,
        setSelectedLapQuantityOption,
        setSelectedDaySchedule,
        setSelectedQuantity
      }}
    >
      {children}
    </SupercarOptionsCardContext.Provider>
  )
}

export const useSupercarOptionsCard = () => {
  const context = useContext(SupercarOptionsCardContext)
  if (context === undefined) {
    throw new Error(
      'useSupercarOptionsCard must be used within a SupercarOptionsCardProvider'
    )
  }
  return context
}
