'use client'

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import type { EventDataFragment } from '../../core/dato/fragments/event-data.typegen'
import {
  type BookingConfigWithPromotions,
  useBookingConfig,
  useBookingEvent,
  useBookingSupercarSchedule,
  useBookingWithCart
} from '../../features/booking'
import { RocketRezScheduleStatus } from '../../io/schemas'
import type {
  RocketRezEventScheduleDate,
  RocketRezEventWithSchedules
} from '../../io/types'
import { getSeatTypeIdWithOverride } from '../../utils/get-seat-type-id-with-override'

type BookingWizardState = {
  bookingEvent: EventDataFragment | null
  selectedEvent: EventDataFragment | null
  eventData: RocketRezEventWithSchedules | null
  isLoadingEventData: boolean
  configData: BookingConfigWithPromotions | null
  isLoadingConfigData: boolean
  selectedDay: RocketRezEventScheduleDate | null
  selectedDayDate: string | null
  activeTabIndex: number
}

type BookingWizardContextType = {
  state: BookingWizardState
  setSelectedDayDate: (date: string | null) => void
  setActiveTabIndex: (index: number) => void
}

const BookingWizardContext = createContext<
  BookingWizardContextType | undefined
>(undefined)

type Props = {
  children: ReactNode
}

const getBookingConfigWithEventOverrides = (
  configData: BookingConfigWithPromotions | null,
  selectedEvent: EventDataFragment | null
): BookingConfigWithPromotions | null => {
  if (!configData || !selectedEvent?.id) {
    return configData
  }

  const matchingOverride = configData.eventOverrides.find(
    (override) => override.event?.id === selectedEvent.id
  )

  if (!matchingOverride) {
    return configData
  }

  return {
    ...configData,
    quantityLabelThreeLaps:
      matchingOverride.quantityLabelThreeLaps ??
      configData.quantityLabelThreeLaps,
    quantityLabelSixLaps:
      matchingOverride.quantityLabelSixLaps ?? configData.quantityLabelSixLaps,
    quantityLabelNineLaps:
      matchingOverride.quantityLabelNineLaps ?? configData.quantityLabelNineLaps
  }
}

export const BookingWizardProvider = ({ children }: Props) => {
  const { booking } = useBookingWithCart()
  const bookingEvent = booking?.event ?? null
  const persistedSelectedEventId =
    booking?.date_and_car?.value?.selectedEvent ?? null
  const persistedSelectedDayDate =
    booking?.date_and_car?.value?.selectedDay ?? null
  const persistedActiveTabIndex =
    booking?.date_and_car?.value?.activeTabIndex ?? 0

  const [selectedDayDateOverride, setSelectedDayDateOverride] = useState<
    string | null
  >(null)
  const [activeTabIndexOverride, setActiveTabIndexOverride] = useState<
    number | null
  >(null)

  const bookingEventId = bookingEvent?.model?.rocketRezId ?? null
  const eventIdToUse = bookingEventId ?? persistedSelectedEventId

  const eventId = useMemo(() => {
    const n = Number(eventIdToUse)
    return Number.isFinite(n) ? n : 0
  }, [eventIdToUse])

  const { data: eventData, isLoading: isLoadingEventData } = useBookingEvent({
    eventId,
    enabled: eventId > 0
  })

  const { data: configData, isLoading: isLoadingConfigData } =
    useBookingConfig()

  // Event changed -> clear UI overrides to avoid stale cross-event state.
  useEffect(() => {
    setSelectedDayDateOverride(null)
    setActiveTabIndexOverride(null)
  }, [eventIdToUse])

  const lastResolvedEventDataRef = useRef<{
    eventId: number
    eventData: RocketRezEventWithSchedules
  } | null>(null)

  useEffect(() => {
    if (eventId <= 0) {
      lastResolvedEventDataRef.current = null
      return
    }
    if (eventData?.event) {
      lastResolvedEventDataRef.current = {
        eventId,
        eventData: eventData.event
      }
    }
  }, [eventId, eventData])

  const resolvedEventData =
    eventData?.event ??
    (lastResolvedEventDataRef.current?.eventId === eventId
      ? lastResolvedEventDataRef.current.eventData
      : null)
  const resolvedIsLoadingEventData =
    isLoadingEventData || (eventId > 0 && resolvedEventData === null)


  const { lowestAvailablePriceFromRates } = useBookingSupercarSchedule()

  const activeTabIndex = useMemo(() => {
    if (activeTabIndexOverride !== null) {
      return activeTabIndexOverride
    }
    return persistedActiveTabIndex
  }, [activeTabIndexOverride, persistedActiveTabIndex])

  const resolvedConfigData = useMemo(
    () => getBookingConfigWithEventOverrides(configData ?? null, bookingEvent),
    [configData, bookingEvent]
  )

  const activeGroup =
    resolvedConfigData?.supercars?.[activeTabIndex ?? 0] ?? null
  const selectedEventRocketRezId = bookingEvent?.model?.rocketRezId ?? null
  const isMulticarGroup =
    activeGroup?.supercars?.some((supercar) => supercar.isMulticar) ?? false

  const resolvedRateIds = useMemo(() => {
    const mappedRateIds =
      activeGroup?.supercars?.map((supercar) =>
        getSeatTypeIdWithOverride({
          defaultSeatTypeId: supercar.rocketRezSeatTypeId,
          overrides: supercar.rocketRezSeatTypeIdOverrides,
          selectedEventId: selectedEventRocketRezId
        })
      ) ?? []

    return Array.from(
      new Set(
        mappedRateIds.filter(
          (rateId): rateId is number =>
            Number.isFinite(rateId) && !Number.isNaN(rateId) && rateId > 0
        )
      )
    )
  }, [activeGroup?.supercars, selectedEventRocketRezId])

  const availableScheduleDates = useMemo(
    () => new Set((resolvedEventData?.schedules ?? []).map((day) => day.date)),
    [resolvedEventData?.schedules]
  )

  const isScheduleDayAvailable = useCallback(
    (date: string) => {
      const dayObj = resolvedEventData?.schedules?.find(
        (day) => day.date === date
      )
      if (!dayObj?.schedules || dayObj.schedules.length === 0) {
        return false
      }
      if (resolvedRateIds.length > 0) {
        const price = lowestAvailablePriceFromRates(
          dayObj.schedules,
          resolvedRateIds,
          isMulticarGroup
        )
        return price !== null
      }
      return dayObj.schedules.some((schedule) => {
        if (schedule.scheduleStatus !== RocketRezScheduleStatus.AVAILABLE) {
          return false
        }
        return (schedule.seatTypes ?? []).some(
          (seat) => seat != null && (seat.available ?? 0) > 0
        )
      })
    },
    [
      resolvedEventData?.schedules,
      resolvedRateIds,
      lowestAvailablePriceFromRates,
      isMulticarGroup
    ]
  )

  const firstScheduleDate = useMemo(() => {
    const schedules = resolvedEventData?.schedules
    if (!schedules || schedules.length === 0) {
      return null
    }
    const firstAvailableDay = schedules.find((day) =>
      isScheduleDayAvailable(day.date)
    )
    return firstAvailableDay?.date ?? schedules[0]?.date ?? null
  }, [resolvedEventData?.schedules, isScheduleDayAvailable])

  const selectedDayDate = useMemo(() => {
    if (
      selectedDayDateOverride !== null &&
      availableScheduleDates.has(selectedDayDateOverride) &&
      isScheduleDayAvailable(selectedDayDateOverride)
    ) {
      return selectedDayDateOverride
    }
    if (
      persistedSelectedDayDate !== null &&
      availableScheduleDates.has(persistedSelectedDayDate) &&
      isScheduleDayAvailable(persistedSelectedDayDate)
    ) {
      return persistedSelectedDayDate
    }
    return firstScheduleDate
  }, [
    selectedDayDateOverride,
    persistedSelectedDayDate,
    firstScheduleDate,
    availableScheduleDates,
    isScheduleDayAvailable
  ])

  const selectedDay = useMemo(
    () =>
      resolvedEventData?.schedules?.find(
        (day) => day.date === selectedDayDate
      ) ?? null,
    [resolvedEventData?.schedules, selectedDayDate]
  )

  const state = useMemo<BookingWizardState>(
    () => ({
      bookingEvent,
      selectedEvent: bookingEvent,
      selectedDay,
      selectedDayDate,
      eventData: resolvedEventData,
      configData: resolvedConfigData,
      isLoadingEventData: resolvedIsLoadingEventData,
      isLoadingConfigData,
      activeTabIndex
    }),
    [
      bookingEvent,
      selectedDay,
      selectedDayDate,
      resolvedEventData,
      resolvedConfigData,
      resolvedIsLoadingEventData,
      isLoadingConfigData,
      activeTabIndex
    ]
  )

  const setSelectedDayDate = useCallback((date: string | null) => {
    setSelectedDayDateOverride((prev) => (prev === date ? prev : date))
  }, [])

  const setActiveTabIndex = useCallback((index: number) => {
    setActiveTabIndexOverride((prev) => (prev === index ? prev : index))
  }, [])

  const contextValue = useMemo<BookingWizardContextType>(
    () => ({ state, setSelectedDayDate, setActiveTabIndex }),
    [state, setSelectedDayDate, setActiveTabIndex]
  )

  return (
    <BookingWizardContext.Provider value={contextValue}>
      {children}
    </BookingWizardContext.Provider>
  )
}

export const useBookingWizardState = () => {
  const context = useContext(BookingWizardContext)
  if (context === undefined) {
    throw new Error(
      'useBookingWizardState must be used within BookingWizardProvider'
    )
  }
  return context
}

export const useOptionalBookingWizardState = () => {
  return useContext(BookingWizardContext)
}
