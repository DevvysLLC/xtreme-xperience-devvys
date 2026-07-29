export const CHECKOUT_STORAGE_KEY = 'checkout-store'
export const LOG_NAMESPACE = 'checkout'

export const DEFAULT_FORM_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  province: '',
  postalCode: '',
  country: '',
  recipientEmail: '',
  recipientName: '',
  giftMessage: ''
} as const
