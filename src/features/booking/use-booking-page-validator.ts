'use client'

import { useMemo } from 'react'
import type { BookingWizardPageKey } from '../../components/booking-wizard/config'
import type { BookingState } from '../../io/types'
import { useBookingWithCart } from './use-booking-with-cart'

type BookingCartSummary = {
  hasCars: boolean
  cartHasValidInsurance: boolean
  totalCars: number
  totalSessions: number
}

export const getBookingPageValidity = (
  booking: BookingState | null | undefined,
  cart: BookingCartSummary
): Record<BookingWizardPageKey, boolean> => {
  const location = Boolean(booking?.event && booking?.track)
  const dateAndCar = Boolean(
    booking?.date_and_car &&
      location &&
      cart.hasCars &&
      cart.totalCars > 0 &&
      cart.totalSessions > 0
  )
  const coverageOptions = Boolean(
    booking?.coverage_options && dateAndCar && cart.cartHasValidInsurance
  )
  const rideAlong = Boolean(booking?.ride_along && coverageOptions)
  const mediaPackages = Boolean(booking?.media_packages && rideAlong)
  const review = Boolean(booking?.review && mediaPackages)

  return {
    location,
    date_and_car: dateAndCar,
    coverage_options: coverageOptions,
    ride_along: rideAlong,
    media_packages: mediaPackages,
    review
  }
}

export const useBookingPageValidator = () => {
  const { booking, cart } = useBookingWithCart()
  const { contents } = cart

  return useMemo(
    () =>
      getBookingPageValidity(booking, {
        hasCars: contents.hasCars,
        cartHasValidInsurance: contents.cartHasValidInsurance,
        totalCars: contents.totalCars,
        totalSessions: contents.totalSessions
      }),
    [
      booking,
      contents.cartHasValidInsurance,
      contents.hasCars,
      contents.totalCars,
      contents.totalSessions
    ]
  )
}
