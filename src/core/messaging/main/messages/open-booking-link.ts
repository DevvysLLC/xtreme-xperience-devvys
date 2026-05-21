export const OPEN_BOOKING_LINK_MESSAGE_NAME = 'open:booking-link'

export type OpenBookingLinkDetails = {
  link: string
}

export type OpenBookingLink = {
  name: typeof OPEN_BOOKING_LINK_MESSAGE_NAME
  details: OpenBookingLinkDetails
}
